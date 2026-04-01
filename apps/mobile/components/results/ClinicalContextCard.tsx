import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ClinicalContext } from '@livertracker/clinical-scores';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Shadow, Spacing } from '../../constants/spacing';

interface StatCardProps {
  value: string;
  label: string;
  tintColor: string;
}

function StatCard({ value, label, tintColor }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: tintColor }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface ClinicalContextCardProps {
  context: ClinicalContext;
  scoreType: 'meld' | 'childPugh';
}

function getTintColor(severityColor: string): string {
  switch (severityColor) {
    case Colors.normal:
      return Colors.normalTint;
    case Colors.moderate:
      return Colors.moderateTint;
    default:
      return Colors.severeTint;
  }
}

export function ClinicalContextCard({ context, scoreType }: ClinicalContextCardProps) {
  const tint = getTintColor(context.severityColor);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>What This Score Means</Text>

      <View style={styles.statRow}>
        {scoreType === 'meld' && context.threeMonthMortality && (
          <StatCard
            value={context.threeMonthMortality}
            label="3-Month Mortality"
            tintColor={tint}
          />
        )}
        {scoreType === 'childPugh' && context.oneYearSurvival && (
          <StatCard value={context.oneYearSurvival} label="1-Year Survival" tintColor={tint} />
        )}
        {scoreType === 'childPugh' && context.twoYearSurvival && (
          <StatCard value={context.twoYearSurvival} label="2-Year Survival" tintColor={tint} />
        )}
        {scoreType === 'childPugh' && context.perioperativeMortality && (
          <StatCard
            value={context.perioperativeMortality}
            label="Perioperative Mortality"
            tintColor={tint}
          />
        )}
        {scoreType === 'meld' && (
          <StatCard value="MELD ≥ 15" label="Transplant Evaluation Threshold" tintColor={tint} />
        )}
      </View>

      <Text style={styles.clinicalNote}>{context.clinicalNote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.cardPadding,
    gap: 16,
    ...Shadow.card,
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  statLabel: {
    ...Typography.helperText,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  clinicalNote: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
