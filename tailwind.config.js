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
        // Brand: Avito Georgia — Avito-inspired green marketplace
        // Token values must stay in sync with lib/theme.ts
        primary: '#00AA6C',
        'primary-dark': '#008F5D',
        'primary-light': '#00CC80',
        secondary: '#f59e0b',
        accent: '#008F5D',
        // Backgrounds
        surface: '#E8F4F8',
        'surface-card': '#FFFFFF',
        'bg-primary': '#F2F8FA',
        'bg-subtle': '#F8FAFC',
        'bg-muted': '#F3F4F6',
        'bg-brand-subtle': '#F0FDFA',
        // dark/dark-secondary = white card backgrounds (intentional naming for dark-on-light pattern)
        dark: '#FFFFFF',
        'dark-secondary': '#FFFFFF',
        // Text
        'text-primary': '#0A2840',
        'text-secondary': '#1A4A6E',
        'text-muted': '#6A8898',
        'text-subtle': '#64748B',
        'text-disabled': '#94A3B8',
        'text-accent': '#0A7B8A',
        // Borders
        border: '#C8E0E8',
        'border-light': '#E2E8F0',
        'border-soft': '#CBD5E1',
        'border-focus': '#0A7B8A',
        'border-error': '#C0392B',
        'border-divider': '#F1F5F9',
        // Status
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

