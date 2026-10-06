/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Chilli red: primary brand colour
        brand: {
          50: '#FFF1EE', 100: '#FFE0DA', 200: '#FFC2B8', 300: '#FF9686', 400: '#F2604A',
          500: '#DC3A24', 600: '#C22A17', 700: '#A12012', 800: '#7F1B12', 900: '#5E160F',
        },
        // Saffron orange
        saffron: { 50: '#FFF6EA', 100: '#FFE8CC', 200: '#FFD199', 300: '#FFB35C', 400: '#FF9A2E', 500: '#F58210', 600: '#D96A08', 700: '#A84F05' },
        // Turmeric yellow
        sun: { 100: '#FFF3C4', 200: '#FFE88A', 300: '#FFD84D', 400: '#FCC419', 500: '#E8AC00' },
        // Leaf green (taken from the green headings on the menu board)
        leaf: { 100: '#DDF3E4', 600: '#0B7A3E', 700: '#0A6434' },
        cream: { DEFAULT: '#FFFAF0', 100: '#FFF4DF', 200: '#F6E7C8' },
        ink: { DEFAULT: '#2A1A12', soft: '#5B4A40', muted: '#7A6A5E' },
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Noto Sans Telugu"', 'system-ui', 'sans-serif'],
        sans: ['"Nunito Sans"', '"Noto Sans Telugu"', 'system-ui', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', '"Nunito Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(42,26,18,.06), 0 4px 14px rgba(42,26,18,.07)',
        lift: '0 10px 26px rgba(42,26,18,.15)',
      },
    },
  },
  plugins: [],
}
