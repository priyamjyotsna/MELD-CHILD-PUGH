import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SteatosisGradeInfo } from '@livertracker/clinical-scores';
import { Colors } from '../../constants/colors';
import { Shadow, Spacing } from '../../constants/spacing';

const GRADE_COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444'];

interface SteatosisScaleProps {
  capValue: number;
  grade: string;
  gradeLabel: string;
  capColor: string;
  estimatedFatPercentage: string;
  allGrades: SteatosisGradeInfo[];
}

export function SteatosisScale({
  capValue,
  grade,
  gradeLabel,
  capColor,
  estimatedFatPercentage,
  allGrades,
}: SteatosisScaleProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Steatosis Grade (Liver Fat)</Text>

      {/* Horizontal scale bar */}
      <View style={styles.scaleBar}>
        {GRADE_COLORS.map((color, i) => (
          <View key={i} style={[styles.segment, { backgroundColor: color }]}>
            <Text style={styles.segLabel}>{allGrades[i]?.grade}</Text>
          </View>
        ))}
      </View>

      {/* Value callout */}
      <View style={[styles.callout, { borderColor: capColor }]}>
        <Text style={[styles.calloutValue, { color: capColor }]}>{capValue} dB/m</Text>
        <Text style={styles.calloutGrade}>{gradeLabel}</Text>
        <Text style={styles.calloutFat}>Estimated liver fat: {estimatedFatPercentage}</Text>
      </View>

      {/* Grade detail list */}
      <View style={styles.gradeList}>
        {allGrades.map((g, i) => (
          <View key={g.grade} style={[styles.gradeRow, g.isActive && styles.gradeRowActive]}>
            <View style={[styles.gradeDot, { backgroundColor: GRADE_COLORS[i] }]} />
            <Text style={[styles.gradeText, g.isActive && styles.gradeTextActive]}>
              {g.grade}
            </Text>
            <Text style={styles.gradeCutoff}>{g.cutoff}</Text>
            {g.isActive && <Text style={styles.activeIndicator}>← You</Text>}
          </View>
        ))}
      </View>
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
  scaleBar: {
    flexDirection: 'row',
    height: 28,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  callout: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  calloutValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  calloutGrade: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  calloutFat: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  gradeList: {
    gap: 4,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  gradeRowActive: {
    backgroundColor: '#F0F6FF',
  },
  gradeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gradeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 24,
  },
  gradeTextActive: {
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  gradeCutoff: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  activeIndicator: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandBlue,
  },
});
