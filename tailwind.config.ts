import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // МУАС palette — driven by CSS variables (see globals.css)
        paper: 'rgb(var(--paper) / <alpha-value>)',      // warm off-white
        ink: 'rgb(var(--ink) / <alpha-value>)',          // near-black graphite
        muted: 'rgb(var(--muted) / <alpha-value>)',      // secondary text
        line: 'rgb(var(--line) / <alpha-value>)',        // hairlines
        terra: 'rgb(var(--terra) / <alpha-value>)',      // terracotta accent
        coal: 'rgb(var(--coal) / <alpha-value>)',        // dark sections bg
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.04em' },
      maxWidth: { wide: '1480px' },
      transitionTimingFunction: { swift: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
  plugins: [],
};
export default config;
