/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'slot-spin': 'slot-spin 0.5s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'slot-spin': {
          '0%': { transform: 'translateY(0) scaleY(1) rotateX(0deg)' },
          '25%': { transform: 'translateY(5px) scaleY(0.8) rotateX(90deg)' },
          '50%': { transform: 'translateY(10px) scaleY(0.6) rotateX(180deg)' },
          '75%': { transform: 'translateY(5px) scaleY(0.8) rotateX(270deg)' },
          '100%': { transform: 'translateY(0) scaleY(1) rotateX(360deg)' },
        },
      },
    },
  },
  plugins: [],
};