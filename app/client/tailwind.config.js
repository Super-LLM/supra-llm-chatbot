/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        default: '#343541',
        hover: '#202123',
      },
    },
  },
  plugins: [],
};
