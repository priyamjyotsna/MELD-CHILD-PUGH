import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { MeldResult } from '@livertracker/clinical-scores';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Shadow, Spacing } from '../../constants/spacing';

interface ScoreComparisonProps {
  meld: MeldResult;
  meldNa: MeldResult | null;
  meld3: MeldResult | null;
  activeFormula: 'MELD' | 'MELD-Na' | 'MELD 3.0';
}

export function ScoreComparison({ meld, meldNa, meld3, activeFormula }: ScoreComparisonProps) {
  const items = [
    { result: meld, label: 'MELD', formula: 'MELD' as const },
    meldNa ? { result: meldNa, label: 'MELD-Na', formula: 'MELD-Na' as const } : null,
    meld3 ? { result: meld3, label: 'MELD 3.0', formula: 'MELD 3.0' as const } : null,
  ].filter(Boolean) as { result: MeldResult; label: string; formula: string }[];

  if (items.length <= 1) return null;

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = item.formula === activeFormula;
        return (
          <View
            key={item.formula}
            style={[styles.badge, isActive && styles.badgeActive]}
            accessibilityLabel={`${item.label}: ${item.result.score}`}
          >
            <Text style={styles.badgeLabel}>{item.label}</Text>
            <Text style={[styles.badgeScore, { color: item.result.clinicalContext.severityColor }]}>
              {item.result.score}
            </Text>
            <View
              style={[
                styles.dot,
                { backgroundColor: item.result.clinicalContext.severityColor },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Spacing.cardBorderRadius,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    ...Shadow.card,
  },
  badgeActive: {
    borderWidth: 1.5,
    borderColor: Colors.brandBlue,
  },
  badgeLabel: {
    ...Typography.helperText,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  badgeScore: {
    fontSize: 24,
    fontWeight: '700',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
