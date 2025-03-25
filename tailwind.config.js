/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        youtubeRed: '#FF0000',
        serviceNowGreen: {
          DEFAULT: '#81b5a1',
          light: '#b3d1c8',
          dark: '#597e72',
        },
        linkedinBlue: '#0A66C2',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 5px 0 rgba(0, 0, 0, 0.05)',
        'card-dark': '0 2px 5px 0 rgba(0, 0, 0, 0.3)',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxHeight: {
        '0': '0',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      zIndex: {
        '-10': '-10',
        '-1': '-1',
        '60': '60',
        '70': '70',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
} 