import express from 'express'
import Stripe from 'stripe'
import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

console.log('Stripe Secret Key loaded:', process.env.STRIPE_SECRET_KEY ? 'YES' : 'NO')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const resendApiKey = process.env.RESEND_API_KEY

if (!stripeSecretKey) {
  console.warn('Missing STRIPE_SECRET_KEY in environment.')
}

if (!resendApiKey) {
  console.warn('Missing RESEND_API_KEY in environment.')
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null
const resend = resendApiKey ? new Resend(resendApiKey) : null

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured.' })
    }

    const { email, amount } = req.body || {}

    if (!email || !amount) {
      return res.status(400).json({ error: 'Email and amount are required.' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      receipt_email: email,
      metadata: {
        product: 'Ultimate Life Planner',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating PaymentIntent:', error)
    return res.status(500).json({ error: 'Unable to create payment. Please try again.' })
  }
})

app.post('/api/send-template-email', async (req, res) => {
  try {
    const { email, notionLink } = req.body || {}

    if (!email || !notionLink) {
      return res.status(400).json({ error: 'Email and Notion link are required.' })
    }

    if (!resend) {
      console.warn('Resend is not configured; skipping email send.')
      return res.json({ ok: false, skipped: true })
    }

    const { error } = await resend.emails.send({
      from: 'Clearwork <hello@clearwork.studio>',
      to: email,
      subject: 'Your Ultimate Life Planner is ready',
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #1A1A1A; padding: 24px;">
          <h1 style="font-size: 24px; margin: 0 0 16px;">Your Ultimate Life Planner is ready</h1>
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 12px;">
            Thanks for your purchase. Your Clearwork Ultimate Life Planner is ready to add to your Notion workspace.
          </p>
          <p style="margin: 0 0 20px;">
            <a href="${notionLink}" style="display: inline-block; padding: 10px 18px; background: #1A1A1A; color: #FFFFFF; text-decoration: none; border-radius: 999px; font-size: 14px;">
              Open your Ultimate Life Planner
            </a>
          </p>
          <p style="font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
            You can duplicate the template into your own workspace and customise it however you like.
          </p>
          <p style="font-size: 12px; color: #6B6B6B; margin: 24px 0 0;">
            If you have any questions, just reply to this email.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending email via Resend:', error)
      // Still return ok so the frontend can treat the purchase as successful.
      return res.json({ ok: false, error: 'Email failed to send.' })
    }

    return res.json({ ok: true })
  } catch (error) {
    console.error('Unexpected error in send-template-email:', error)
    return res.json({ ok: false, error: 'Unexpected error while sending email.' })
  }
})

const port = process.env.PORT || 8787
app.listen(port, () => {
  console.log(`Clearwork server listening on http://localhost:${port}`)
})

