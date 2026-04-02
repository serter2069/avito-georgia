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
        // Brand: Avito Georgia (from Trinity brand #38)
        primary: '#6366f1',       // brandPrimary - Indigo
        'primary-dark': '#8b5cf6', // brandSecondary - Violet
        secondary: '#f59e0b',     // statusWarning - Amber (accent)
        accent: '#a78bfa',        // textAccent - Light violet
        surface: '#16213e',       // bgSurface
        'surface-card': '#1e1e35', // bgCard
        dark: '#0f0f1a',          // bgPrimary
        'dark-secondary': '#1a1a2e', // bgSecondary
        'text-primary': '#e2e8f0',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
        border: '#2d2d4e',
        'border-focus': '#6366f1',
        success: '#4CAF50',
        warning: '#f59e0b',
        error: '#ef4444',
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

