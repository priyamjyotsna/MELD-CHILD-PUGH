import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import type { FibrosisStageInfo } from '@livertracker/clinical-scores';
import { Colors } from '../../constants/colors';
import { Shadow, Spacing } from '../../constants/spacing';

const STAGE_COLORS = ['#10B981', '#84CC16', '#F59E0B', '#F97316', '#EF4444'];

interface FibrosisScaleProps {
  stiffnessValue: number;
  stage: string;
  stageLabel: string;
  allStages: FibrosisStageInfo[];
  stiffnessColor: string;
}

const SCALE_WIDTH = Dimensions.get('window').width - 72;
const MAX_KPA = 25; // visual max for the scale

export function FibrosisScale({
  stiffnessValue,
  stage,
  stageLabel,
  allStages,
  stiffnessColor,
}: FibrosisScaleProps) {
  const markerPos = useRef(new Animated.Value(0)).current;

  const clampedKpa = Math.min(stiffnessValue, MAX_KPA);
  const targetFraction = clampedKpa / MAX_KPA;

  useEffect(() => {
    Animated.timing(markerPos, {
      toValue: targetFraction,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [targetFraction]);

  const markerLeft = markerPos.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCALE_WIDTH - 4],
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Fibrosis Stage</Text>

      {/* Scale bar */}
      <View style={styles.scaleContainer}>
        <View style={styles.scaleBar}>
          {STAGE_COLORS.map((color, i) => (
            <View key={i} style={[styles.segment, { backgroundColor: color }]} />
          ))}
        </View>

        {/* Animated marker */}
        <Animated.View style={[styles.marker, { left: markerLeft, backgroundColor: stiffnessColor }]}>
          <View style={[styles.markerTriangle, { borderBottomColor: stiffnessColor }]} />
        </Animated.View>

        {/* kPa label below marker */}
        <Animated.View style={[styles.markerLabel, { left: markerLeft }]}>
          <Text style={styles.markerLabelText}>{stiffnessValue} kPa</Text>
        </Animated.View>
      </View>

      {/* Stage labels */}
      <View style={styles.labelsRow}>
        {allStages.map((s, i) => (
          <View
            key={s.stage}
            style={[styles.labelItem, s.isActive && styles.labelItemActive]}
          >
            <View style={[styles.labelDot, { backgroundColor: STAGE_COLORS[i] }]} />
            <Text style={[styles.labelStage, s.isActive && { fontWeight: '800', color: Colors.textPrimary }]}>
              {s.stage}
            </Text>
            <Text style={styles.labelCutoff}>{s.cutoff}</Text>
          </View>
        ))}
      </View>

      {/* Active stage */}
      <View style={[styles.activeStage, { borderLeftColor: stiffnessColor }]}>
        <Text style={[styles.activeLabel, { color: stiffnessColor }]}>{stageLabel}</Text>
      </View>
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scaleContainer: {
    height: 60,
    marginHorizontal: 4,
  },
  scaleBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginTop: 20,
  },
  segment: {
    flex: 1,
  },
  marker: {
    position: 'absolute',
    top: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    marginLeft: -8,
    marginTop: 6,
  },
  markerTriangle: {
    position: 'absolute',
    top: -8,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  markerLabel: {
    position: 'absolute',
    top: 40,
    marginLeft: -30,
    width: 60,
    alignItems: 'center',
  },
  markerLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  labelsRow: {
    gap: 6,
    marginTop: 8,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  labelItemActive: {
    backgroundColor: '#F0F6FF',
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  labelStage: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 24,
  },
  labelCutoff: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  activeStage: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 4,
  },
  activeLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
});
