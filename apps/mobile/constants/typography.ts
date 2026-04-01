import { Platform } from 'react-native';

export const fontFamily = Platform.select({ ios: 'System', default: undefined });

export const Typography = {
  screenTitle: {
    fontSize: 28,
    fontWeight: '600' as const,
    fontFamily,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600' as const,
    fontFamily,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    fontFamily,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily,
  },
  helperText: {
    fontSize: 13,
    fontWeight: '400' as const,
    fontFamily,
  },
  scoreDisplay: {
    fontSize: 48,
    fontWeight: '700' as const,
    fontFamily,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    fontFamily,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily,
  },
} as const;
