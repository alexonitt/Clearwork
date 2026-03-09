/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'apex-bg': '#000000',
        'apex-text': '#FFFFFF',
        'apex-muted': '#A1A1AA',
        'apex-border': '#27272A',
        'apex-card': '#0A0A0A',
        'cw-bg': '#FFFFFF',
        'cw-bg-muted': '#F7F7F5',
        'cw-border': '#E5E5E0',
        'cw-text': '#1A1A1A',
        'cw-muted': '#6B6B6B',
        'cw-accent': '#1A1A1A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'cw-card': '0 18px 45px rgba(0,0,0,0.04)',
        'cw-card-hover': '0 24px 60px rgba(0,0,0,0.06)',
        'apex-card': '0 4px 24px rgba(0,0,0,0.4)',
        'apex-card-hover': '0 12px 40px rgba(255,255,255,0.06)',
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { opacity: '1', transform: 'translate(0, 0) scale(1)' },
          '50%': { opacity: '0.8', transform: 'translate(2%, 2%) scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}

