// lib/theme.ts — SINGLE SOURCE OF TRUTH for all design tokens
// All colors, spacing, typography — ONLY from here

export const colors = {
  // Brand (6)
  primary: '#0A7B8A',
  accent: '#1A9BAA',
  background: '#FFFFFF',
  surface: '#F2F8FA',
  text: '#0A2840',
  textSecondary: '#6A8898',
  // Semantic (3)
  error: '#C0392B',
  success: '#2E7D30',
  warning: '#f59e0b',
} as const;

// Tailwind mapping — for className usage
export const tw = {
  primary: 'bg-primary',
  primaryText: 'text-primary',
  primaryBorder: 'border-primary',
  accent: 'bg-accent',
  accentText: 'text-accent',
  background: 'bg-white',
  surface: 'bg-bg-primary',
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
  small: 'text-xs text-text-muted',
} as const;

export const radius = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
} as const;
