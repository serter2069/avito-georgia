// lib/theme.ts — SINGLE SOURCE OF TRUTH for all design tokens
// All colors, spacing, typography — ONLY from here

export const colors = {
  // Brand (6) — Avito-inspired green
  primary: '#00AA6C',
  accent: '#008F5D',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#737373',
  // Semantic (3)
  error: '#C0392B',
  success: '#00AA6C',
  warning: '#f59e0b',
  // Borders
  border: '#C8E0E8',
  borderLight: '#E2E8F0',
} as const;

// Tailwind mapping — for className usage
export const tw = {
  primary: 'bg-primary',
  primaryText: 'text-primary',
  primaryBorder: 'border-primary',
  accent: 'bg-accent',
  accentText: 'text-accent',
  background: 'bg-white',
  surface: 'bg-bg-muted',
  text: 'text-text-primary',
  textSecondary: 'text-text-secondary',
  error: 'text-error',
  errorBg: 'bg-error',
  errorBorder: 'border-border-error',
  success: 'text-success',
  successBg: 'bg-success',
  warning: 'text-warning',
  warningBg: 'bg-warning',
  border: 'border-border',
  borderLight: 'border-border-light',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const typography = {
  h1: 'text-3xl font-extrabold',
  h2: 'text-2xl font-bold',
  h3: 'text-lg font-semibold',
  body: 'text-base',
  caption: 'text-sm text-text-secondary',
  small: 'text-xs text-text-disabled',
} as const;

export const radius = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
} as const;
