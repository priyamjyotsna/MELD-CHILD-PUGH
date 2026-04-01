import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { ComponentContribution } from '@livertracker/clinical-scores';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Shadow, Spacing } from '../../constants/spacing';

interface ComponentBreakdownProps {
  components: ComponentContribution[];
}

const STATUS_COLORS: Record<ComponentContribution['status'], string> = {
  normal: Colors.normal,
  mildly_elevated: Colors.moderate,
  elevated: Colors.severe,
  critical: Colors.critical,
};

function BarRow({ component, delay }: { component: ComponentContribution; delay: number }) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: component.contribution,
      duration: 500,
      delay,
      useNativeDriver: false,
    }).start();
  }, [component.contribution]);

  const barColor = STATUS_COLORS[component.status];

  return (
    <View
      style={styles.row}
      accessibilityLabel={`${component.name}: ${component.inputValue}${component.unit ? ' ' + component.unit : ''}`}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.componentName}>{component.name}</Text>
        {component.clampNote && (
          <Text style={styles.clampNote}>{component.clampNote}</Text>
        )}
      </View>

      <View style={styles.rowRight}>
        <Text style={styles.valueText}>
          {component.unit ? `${component.inputValue} ${component.unit}` : String(component.inputValue)}
          {component.points !== undefined && (
            <Text style={styles.pointsText}> ({component.points}pt)</Text>
          )}
        </Text>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                backgroundColor: barColor,
                width: animatedWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

export function ComponentBreakdown({ components }: ComponentBreakdownProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Score Breakdown</Text>
      <View style={styles.rows}>
        {components.map((comp, index) => (
          <BarRow key={comp.name} component={comp} delay={index * 100} />
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
    gap: 16,
    ...Shadow.card,
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  rows: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  rowLeft: {
    flex: 1,
    gap: 2,
  },
  componentName: {
    ...Typography.inputLabel,
    color: Colors.textPrimary,
  },
  clampNote: {
    ...Typography.helperText,
    color: Colors.moderate,
    fontStyle: 'italic',
  },
  rowRight: {
    flex: 1.2,
    gap: 4,
    alignItems: 'flex-end',
  },
  valueText: {
    ...Typography.helperText,
    color: Colors.textSecondary,
  },
  pointsText: {
    color: Colors.gradientStart,
    fontWeight: '600',
  },
  barTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
