/** Tailwind config — tokens copied 1:1 from the original site's :root CSS variables.
 *  Do not change these values; the brief requires the existing palette/theme to remain intact. */
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#faf8f5',
        surface: '#ffffff',
        text: '#1e1c19',
        'text-muted': '#6b6760',
        accent: '#b8953a',
        'accent-hover': '#a17e2e',
        'accent-soft': '#e8dfce',
        'accent-light': '#e8d5a3',
        border: '#e6e2da',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
        full: '60px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.03)',
        hover: '0 6px 20px rgba(0, 0, 0, 0.05)',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
} satisfies Config;
