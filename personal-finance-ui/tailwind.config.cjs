module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1'
        }
      },
      keyframes: {
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.97)' },
          '100%': { opacity: 1, transform: 'scale(1)' }
        },
        'scale-in-up': {
          '0%': { opacity: 0, transform: 'translateY(4px) scale(0.97)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' }
        }
      },
      animation: {
        'scale-in': 'scale-in 80ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in-up': 'scale-in-up 90ms cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  plugins: []
}
