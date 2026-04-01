// Color palette derived from the easy MELD & Child PUGH brand identity
export const Colors = {
  // Backgrounds
  backgroundPage: '#F0F6FF',       // very light blue-tinted page
  backgroundCard: '#FFFFFF',

  // Text
  textPrimary: '#0D2B6B',          // deep navy — from logo "easy" text
  textSecondary: '#4A6FA5',        // medium blue-grey
  textDisabled: '#9CB3D4',
  textWhite: '#FFFFFF',

  // Brand — pulled directly from logo blues
  brandNavy: '#0D2B6B',            // dark navy ("easy" text)
  brandBlue: '#4A90D9',            // main sky blue ("MELD" text)
  brandMid: '#2563EB',             // mid blue ("Child PUGH" text)
  brandLight: '#7EC8F0',           // light blue ampersand

  // Gradient — used on CTAs and active tabs
  gradientStart: '#2563EB',
  gradientEnd: '#4A90D9',

  // Semantic result colors (unchanged — clinical standard)
  normal: '#10B981',
  moderate: '#F59E0B',
  severe: '#EF4444',
  critical: '#991B1B',

  // Borders
  border: '#D1E4F7',
  borderFocus: '#2563EB',

  // Tinted backgrounds for stat cards
  normalTint: '#ECFDF5',
  moderateTint: '#FFFBEB',
  severeTint: '#FEF2F2',
  criticalTint: '#FFF1F1',

  // Hero section background
  heroGradientTop: '#0D2B6B',
  heroGradientBottom: '#2563EB',
} as const;

export type ColorKey = keyof typeof Colors;
