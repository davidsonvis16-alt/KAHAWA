/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bean: { DEFAULT: '#2A1810', 800: '#3B2418', 700: '#5A3826', 600: '#7A5038' },
        cream: { DEFAULT: '#FBF4E8', 100: '#F6E9D5', 200: '#EEDBBE', 300: '#E2C79F' },
        chili: { DEFAULT: '#E0533A', 600: '#C8412A', 700: '#A93421' },
        honey: { DEFAULT: '#F2B33D', 600: '#D99A22' },
        leaf: { DEFAULT: '#3E7B4F' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { blob: '2.25rem' },
      boxShadow: {
        soft: '0 1px 0 rgba(42,24,16,.04), 0 12px 32px -12px rgba(42,24,16,.18)',
        lift: '0 2px 0 rgba(42,24,16,.05), 0 24px 48px -16px rgba(42,24,16,.28)',
      },
    },
  },
  plugins: [],
}
