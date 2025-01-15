/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{html,ts}",],
  theme: {
    extend: {
      screens: {
        'xl-1745': {'max': '1745px'}, // Custom breakpoint for 1745px
      },
      colors: {
        'custom-teal': '#43CECF',
        'custom-purple': '#D6BCFA'
      }
    },
  },
  plugins: [require('tailwindcss-primeui')],
}

