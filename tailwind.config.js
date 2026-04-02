/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./stores/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand: Avito Georgia — Teal Batumi (from brand.html)
        primary: '#0A7B8A',
        'primary-dark': '#0A2840',
        secondary: '#f59e0b',
        accent: '#1A9BAA',
        surface: '#E8F4F8',
        'surface-card': '#FFFFFF',
        dark: '#F2F8FA',
        'dark-secondary': '#E8F4F8',
        'text-primary': '#0A2840',
        'text-secondary': '#1A4A6E',
        'text-muted': '#6A8898',
        border: '#C8E0E8',
        'border-focus': '#0A7B8A',
        success: '#2E7D30',
        warning: '#f59e0b',
        error: '#C0392B',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}

