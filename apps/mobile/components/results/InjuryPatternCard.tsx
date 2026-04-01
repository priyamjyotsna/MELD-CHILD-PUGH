import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { InjuryPattern } from '@livertracker/clinical-scores';
import { Colors } from '../../constants/colors';
import { Shadow, Spacing } from '../../constants/spacing';

interface InjuryPatternCardProps {
  pattern: InjuryPattern;
  patternLabel: string;
  explanation: string;
  rRatio?: number;
  astAltRatio?: number;
  astAltRatioInterpretation?: string;
}

const PATTERN_ICONS: Record<InjuryPattern, keyof typeof Ionicons.glyphMap> = {
  hepatocellular: 'cellular-outline',
  cholestatic: 'water-outline',
  mixed: 'git-merge-outline',
  normal: 'checkmark-circle-outline',
  insufficient_data: 'help-circle-outline',
};

const PATTERN_COLORS: Record<InjuryPattern, string> = {
  hepatocellular: '#EF4444',
  cholestatic: '#F97316',
  mixed: '#F59E0B',
  normal: '#10B981',
  insufficient_data: Colors.textSecondary,
};

export function InjuryPatternCard({
  pattern,
  patternLabel,
  explanation,
  rRatio,
  astAltRatio,
  astAltRatioInterpretation,
}: InjuryPatternCardProps) {
  const color = PATTERN_COLORS[pattern];
  const icon = PATTERN_ICONS[pattern];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Liver Injury Pattern</Text>

      <View style={styles.patternRow}>
        <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.patternLabel, { color }]}>{patternLabel}</Text>
        {rRatio !== undefined && (
          <Text style={styles.rRatio}>R ratio: {rRatio.toFixed(1)}</Text>
        )}
      </View>

      <Text style={styles.explanation}>{explanation}</Text>

      {astAltRatio !== undefined && astAltRatioInterpretation && (
        <View style={styles.ratioSection}>
          <Text style={styles.ratioTitle}>AST/ALT Ratio: {astAltRatio}</Text>
          <Text style={styles.ratioText}>{astAltRatioInterpretation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.cardPadding,
    gap: 14,
    ...Shadow.card,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternLabel: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  rRatio: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  explanation: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  ratioSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    gap: 4,
  },
  ratioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  ratioText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
