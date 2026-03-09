import { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { createClient } from '@supabase/supabase-js'

const NOTION_TEMPLATE_LINK =
  'https://likeable-pea-7ee.notion.site/Ultimate-Life-Planner-f7deccf15dff4311915c592009c20baf?pvs=143'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : null

const cardElementOptions = {
  style: {
    base: {
      color: '#F9F9F7',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '14px',
      '::placeholder': {
        color: '#6B6B6B',
      },
      iconColor: '#F9F9F7',
    },
    invalid: {
      color: '#ff6b6b',
      iconColor: '#ff6b6b',
    },
  },
}

export function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleClose = () => {
    if (isLoading) return
    setError('')
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!stripe || !elements) {
      setError('Payment system is still loading. Please wait a moment and try again.')
      return
    }

    if (!email) {
      setError('Please add your email so we can send your template.')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Card details are not ready yet. Please try again.')
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Create PaymentIntent
      const amount = 2900

      const paymentIntentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, amount }),
      })

      if (!paymentIntentResponse.ok) {
        setError('Connection failed, please try again.')
        setIsLoading(false)
        return
      }

      const { clientSecret, error: intentError } = await paymentIntentResponse.json()

      if (!clientSecret || intentError) {
        setError(intentError || 'Unable to start payment. Please try again.')
        setIsLoading(false)
        return
      }

      // Step 2: Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email,
          },
        },
      })

      if (stripeError) {
        if (stripeError.type === 'card_error' || stripeError.type === 'validation_error') {
          setError(stripeError.message || 'There was a problem with your card details.')
        } else {
          setError('Something went wrong. Please try again.')
        }
        setIsLoading(false)
        return
      }

      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        setError('Payment did not complete. Please try again.')
        setIsLoading(false)
        return
      }

      const stripePaymentId = paymentIntent.id

      // Step 3: Save order to Supabase (non-blocking for user experience)
      if (supabase) {
        try {
          const { error: dbError } = await supabase.from('orders').insert({
            email,
            amount,
            stripe_payment_id: stripePaymentId,
            status: 'completed',
            notion_link: NOTION_TEMPLATE_LINK,
          })

          if (dbError) {
            console.error('Error saving order to Supabase:', dbError)
          }
        } catch (dbErr) {
          console.error('Unexpected Supabase error:', dbErr)
        }
      } else {
        console.warn('Supabase is not configured; skipping order insert.')
      }

      // Step 4: Send template email via backend
      try {
        const emailResponse = await fetch('/api/send-template-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, notionLink: NOTION_TEMPLATE_LINK }),
        })

        if (!emailResponse.ok) {
          console.error('Email request failed with status:', emailResponse.status)
        } else {
          const data = await emailResponse.json()
          if (!data.ok) {
            console.error('Email send reported an issue:', data.error || data)
          }
        }
      } catch (emailErr) {
        console.error('Network error while sending template email:', emailErr)
        // Email errors should not block success state
      }

      setIsLoading(false)
      setError('')
      onSuccess()
    } catch (err) {
      console.error('Unexpected checkout error:', err)
      setError('Connection failed, please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-[#2A2A28] bg-[#111111] p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-xs text-[#A0A0A0] hover:text-white"
          aria-label="Close checkout"
        >
          ✕
        </button>

        <div className="mb-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#9E9E98]">
            Checkout
          </p>
          <h2 className="mt-2 font-serif text-xl text-white">Ultimate Life Planner</h2>
          <p className="mt-1 text-xs text-[#C4C4BD]">One-time payment • Instant Notion access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="checkout-email"
              className="block text-xs font-medium text-[#E8E8E1]"
            >
              Email address
            </label>
            <input
              id="checkout-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#2A2A28] bg-[#141414] px-3 py-2 text-sm text-[#F9F9F7] outline-none transition-colors placeholder:text-[#6B6B6B] focus:border-[#E5E5E0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#E8E8E1]">Card details</label>
            <div className="rounded-lg border border-[#2A2A28] bg-[#141414] px-3 py-2.5">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#ff8080]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !stripe}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-cw-accent bg-cw-accent px-4 py-2.5 text-sm font-medium text-white transition-all duration-150 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100"
          >
            {isLoading ? 'Processing…' : 'Complete Purchase — $29'}
          </button>

          <p className="mt-1 text-[10px] text-[#7A7A73]">
            Secure payment powered by Stripe. You&apos;ll receive a link to the Ultimate Life Planner
            in your inbox right after purchase.
          </p>
        </form>
      </div>
    </div>
  )
}

