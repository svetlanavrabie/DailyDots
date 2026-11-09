/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: Object.fromEntries(
        ['canvas', 'surface', 'ink', 'muted', 'line', 'accent-soft', 'accent-alt', 'primary', 'primary-hover', 'peach', 'mint', 'rose', 'notebook-cover', 'notebook-border', 'notebook-ink']
          .map((name) => [name, `rgb(var(--${name}) / <alpha-value>)`]),
      ),
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      boxShadow: { soft: '0 4px 24px rgb(15 23 42 / 5%)' },
    },
  },
  plugins: [],
}
