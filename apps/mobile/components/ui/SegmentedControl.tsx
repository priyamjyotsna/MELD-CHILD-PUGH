import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  selectedValue: T;
  onValueChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  selectedValue,
  onValueChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = option.value === selectedValue;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onValueChange(option.value)}
            style={styles.segmentWrapper}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.label}
          >
            {isActive ? (
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activeSegment}
              >
                <Text style={styles.activeText}>{option.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveSegment}>
                <Text style={styles.inactiveText}>{option.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EBF3FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    padding: 3,
    gap: 3,
  },
  segmentWrapper: {
    flex: 1,
  },
  activeSegment: {
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: Colors.brandBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveSegment: {
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeText: {
    ...Typography.inputLabel,
    color: Colors.textWhite,
    fontWeight: '700',
  },
  inactiveText: {
    ...Typography.inputLabel,
    color: Colors.textSecondary,
  },
});
