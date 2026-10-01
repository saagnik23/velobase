/**
 * VELORA Design Tokens
 *
 * Canonical source of truth for every color, font, spacing, radius,
 * and motion value in the VELORA design system. Section 6 of the
 * master skill spec, locked.
 *
 * Palette: light-first, dark equal.
 * Accent: Signal Saffron — the one accent.
 * Forbidden: purple, indigo, blue-violet gradients, neon green, cream+terracotta.
 */

// ─── Colors ──────────────────────────────────────────────────────────
export const colors = {
  // Page backgrounds
  salt: '#F5F5F2',         // Light page background
  graphite: '#1B1C1E',     // Ink / dark text
  basalt: '#131412',       // Dark page background
  ash: '#E4E4DF',          // Borders (light mode)
  slate: '#2A2B2D',        // Dark surfaces

  // Accent — the one accent
  saffron: '#F2A900',

  // Semantic
  moss: '#2F6B4F',         // Success
  brick: '#D8402F',        // Danger

  // Extended palette (derived)
  saffronHover: '#E09D00',
  saffronActive: '#CC8F00',
  saffronSubtle: 'rgba(242, 169, 0, 0.12)',
  saffronMuted: 'rgba(242, 169, 0, 0.06)',

  mossSubtle: 'rgba(47, 107, 79, 0.12)',
  mossBorder: 'rgba(47, 107, 79, 0.35)',
  brickSubtle: 'rgba(216, 64, 47, 0.12)',
  brickBorder: 'rgba(216, 64, 47, 0.35)',

  // Neutral scale (dark mode)
  neutral50: '#FAFAF8',
  neutral100: '#F5F5F2',   // = salt
  neutral200: '#E4E4DF',   // = ash
  neutral300: '#C8C8C2',
  neutral400: '#9B9B94',
  neutral500: '#6E6E68',
  neutral600: '#4A4A46',
  neutral700: '#2A2B2D',   // = slate
  neutral800: '#1B1C1E',   // = graphite
  neutral900: '#131412',   // = basalt

  // Surface (dark mode)
  surfaceBase: '#131412',
  surfaceRaised: '#1B1C1E',
  surfaceOverlay: '#2A2B2D',
  surfaceActive: '#353638',

  // Text
  textPrimary: '#F5F5F2',
  textSecondary: '#9B9B94',
  textMuted: '#6E6E68',
  textInverse: '#131412',
  textOnSaffron: '#131412',

  // Border (dark mode)
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderDefault: 'rgba(255, 255, 255, 0.14)',
  borderStrong: 'rgba(255, 255, 255, 0.24)',
  borderFocus: '#F2A900',
} as const;

// ─── Typography ──────────────────────────────────────────────────────
export const fonts = {
  display: "'Bricolage Grotesque', system-ui, sans-serif",
  body: "'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace",
} as const;

export const fontSizes = {
  xs: '0.6875rem',    // 11px
  sm: '0.8125rem',    // 13px
  base: '0.875rem',   // 14px
  md: '1rem',         // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
  '7xl': '4.5rem',    // 72px
} as const;

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeights = {
  tight: '1.15',
  snug: '1.3',
  normal: '1.5',
  relaxed: '1.625',
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

// ─── Radii (vary by hierarchy) ───────────────────────────────────────
export const radii = {
  none: '0',
  sm: '4px',      // Small controls
  md: '6px',      // Controls, buttons
  lg: '10px',     // Panels, cards
  xl: '14px',     // Hero surfaces
  '2xl': '20px',  // Large hero elements
  full: '9999px', // Pills, avatars
} as const;

// ─── Shadows (depth from borders and tonal steps, not identical soft shadows) ─
export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 2px 8px rgba(0, 0, 0, 0.12)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.16)',
  xl: '0 8px 32px rgba(0, 0, 0, 0.2)',
  saffronGlow: '0 0 24px rgba(242, 169, 0, 0.3)',
  saffronGlowSm: '0 0 12px rgba(242, 169, 0, 0.2)',
  focus: '0 0 0 2px rgba(242, 169, 0, 0.4)',
} as const;

// ─── Motion (responds to user action only) ───────────────────────────
export const motion = {
  fast: '120ms cubic-bezier(0.16, 1, 0.3, 1)',
  normal: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '350ms cubic-bezier(0.16, 1, 0.3, 1)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const durations = {
  fast: 120,
  normal: 200,
  slow: 350,
  spring: 500,
} as const;

export const easings = {
  default: [0.16, 1, 0.3, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  inOut: [0.45, 0, 0.55, 1] as const,
};

// ─── Breakpoints ─────────────────────────────────────────────────────
export const breakpoints = {
  sm: '375px',
  md: '768px',
  lg: '1280px',
  xl: '1920px',
} as const;

// ─── Z-Index ─────────────────────────────────────────────────────────
export const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  tooltip: 600,
  commandPalette: 700,
} as const;

// ─── Latency Budgets (tests, not goals) ──────────────────────────────
export const latencyBudgets = {
  dashboardRouteChange: 100,     // ms perceived
  apiP95Read: 100,               // ms warm
  apiP95Write: 200,              // ms warm
  gatewayOverhead: 5,            // ms
  landingTTFB: 200,              // ms
  landingLCP: 1500,              // ms
  landingCLS: 0.05,
  landingINP: 100,               // ms
  landingJSBudget: 170,          // KB first load
  tableVirtualizedFPS: 60,
  realtimeP95InRegion: 50,       // ms
} as const;
