/** @type {import('tailwindcss').Config} */
// Design tokens. Names are kept from the first design so every page picks up the
// new look; the values are what changed:
//   bean  = ink (near-black)      cream = page/paper greys
//   chili = signal orange (deals, errors, accents on light)
//   honey = acid lime (highlights on ink, primary call-outs)
//   leaf  = go-green (free delivery, open now, success)
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bean: { DEFAULT: '#0E0E0C', 800: '#1D1D1A', 700: '#3A3A35', 600: '#5E5E57' },
        cream: { DEFAULT: '#F4F3EF', 100: '#ECEAE4', 200: '#E1DFD7', 300: '#CCC9BE' },
        chili: { DEFAULT: '#E2400C', 600: '#C7360A', 700: '#A12B07' },
        honey: { DEFAULT: '#D9F23B', 600: '#C2DB22' },
        leaf: { DEFAULT: '#12804A' },
      },
      fontFamily: {
        display: ['Anton', 'Impact', '"Arial Narrow"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { blob: '1rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(14,14,12,.06), 0 4px 16px -8px rgba(14,14,12,.12)',
        lift: '0 2px 4px rgba(14,14,12,.08), 0 18px 40px -16px rgba(14,14,12,.30)',
        hard: '4px 4px 0 0 #0E0E0C',
      },
      letterSpacing: { display: '-0.01em' },
    },
  },
  plugins: [],
}
