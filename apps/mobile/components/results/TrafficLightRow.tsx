import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import type { EnzymeResult } from '@livertracker/clinical-scores';
import { Colors } from '../../constants/colors';

interface TrafficLightRowProps {
  enzyme: EnzymeResult;
  delay: number;
  onPress?: () => void;
}

export function TrafficLightRow({ enzyme, delay, onPress }: TrafficLightRowProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(dotScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.7}
        accessibilityLabel={`${enzyme.name}: ${enzyme.value} ${enzyme.unit}, ${enzyme.statusLabel}`}
      >
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: enzyme.statusColor, transform: [{ scale: dotScale }] },
          ]}
        />
        <Text style={styles.enzymeName}>{enzyme.name}</Text>
        <Text style={styles.value}>
          {enzyme.value} <Text style={styles.unit}>{enzyme.unit}</Text>
        </Text>
        <Text style={[styles.status, { color: enzyme.statusColor }]}>{enzyme.statusLabel}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  enzymeName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    width: 80,
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  unit: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
});
