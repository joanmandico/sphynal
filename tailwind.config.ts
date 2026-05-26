import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0e5eaf',
        'primary-dim': '#00529d',
        'primary-container': '#d5e3ff',
        'on-primary': '#f6f7ff',
        'on-primary-container': '#00519c',
        secondary: '#526074',
        'secondary-container': '#d5e3fc',
        'on-secondary-container': '#455367',
        tertiary: '#545f78',
        'tertiary-container': '#d1ddfa',
        'on-tertiary-container': '#434e66',
        surface: '#f7f9fb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f0f4f7',
        'surface-container': '#e8eff3',
        'surface-container-high': '#e1e9ee',
        'surface-container-highest': '#d9e4ea',
        'surface-bright': '#f7f9fb',
        'surface-dim': '#cfdce3',
        'on-surface': '#2a3439',
        'on-surface-variant': '#566166',
        outline: '#717c82',
        'outline-variant': '#a9b4b9',
        error: '#9f403d',
        'error-container': '#fe8983',
        background: '#f7f9fb',
        'on-background': '#2a3439',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config