/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0b2a33',
        muted: 'rgba(11,42,51,.72)',
        glass: 'rgba(255,255,255,.62)',
        glass2: 'rgba(255,255,255,.80)',
        sun: '#ffbe3b',
        sun2: '#ff8f2f',
        aqua: '#1fe1c2',
        aqua2: '#1aa7ff',
      },
      fontFamily: {
        heading: ['Fredoka', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '28px',
        'lg': '22px',
        'md': '16px',
      },
      boxShadow: {
        'game': '0 18px 44px rgba(0,30,45,.22)',
        'game-sm': '0 10px 24px rgba(0,30,45,.18)',
      },
      backdropBlur: {
        'glass': '10px',
        'glass-lg': '12px',
        'glass-xl': '14px',
      },
    },
  },
  plugins: [],
}

