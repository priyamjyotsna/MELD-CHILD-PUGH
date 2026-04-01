import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface SeverityBannerProps {
  label: string;
  color: string;
}

export function SeverityBanner({ label, color }: SeverityBannerProps) {
  return (
    <View style={[styles.banner, { backgroundColor: color }]}>
      <Text style={styles.text} accessibilityRole="text" accessibilityLabel={`Severity: ${label}`}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    ...Typography.cardTitle,
    color: Colors.textWhite,
    textAlign: 'center',
  },
});
