export const Spacing = {
  screenPadding: 16,
  cardPadding: 20,
  cardBorderRadius: 12,
  inputHeight: 48,
  inputBorderRadius: 8,
  buttonHeight: 52,
  buttonBorderRadius: 12,
  sectionGap: 24,
  fieldGap: 16,
  statusDotSize: 8,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
} as const;
