/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#edab12',
        secondary: '#421907',
        textlight: '#FFF8F0',
        textdark: '#1a202c',
        background: '#0a0a0a',
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(0, 0, 0, 0.3)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif'],
        'clash': ['Clash Display', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      animation: {
        rise: 'rise 1s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        rise: {
          '0%': {
            transform: 'translateY(30px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        slideUp: {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 20px rgba(237, 171, 18, 0.1)',
          },
          '100%': {
            boxShadow: '0 0 30px rgba(237, 171, 18, 0.3)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%)',
        'premium-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 25%, #1a1a1a 50%, #0f0f0f 75%, #0a0a0a 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      blur: {
        '4xl': '72px',
        '5xl': '96px',
      }
    },
  },
  plugins: [],
}