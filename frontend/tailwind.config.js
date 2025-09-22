/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors matching our CSS variables
        primary: {
          bg: '#1a1a1a',
          'bg-secondary': '#2a2a2a',
          card: '#333333',
          'card-hover': '#3a3a3a',
          modal: '#2a2a2a',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
          muted: '#808080',
        },
        accent: {
          green: '#00ff88',
          'green-hover': '#00e676',
          blue: '#00bcd4',
          purple: '#9c27b0',
          orange: '#ff9800',
          red: '#f44336',
        },
        border: {
          DEFAULT: '#404040',
          hover: '#505050',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'fadeIn': 'fadeIn 0.25s ease-out',
        'slideUp': 'slideUp 0.25s ease-out',
        'scaleIn': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}