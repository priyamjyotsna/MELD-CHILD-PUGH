import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export function BrandFooter() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => Linking.openURL('https://livertracker.com')}
        accessibilityRole="link"
        accessibilityLabel="Visit LiverTracker.com"
      >
        <Text style={styles.brand}>Made by Dr. Jyotsna Priyam</Text>
        <Text style={styles.link}>livertracker.com</Text>
      </TouchableOpacity>
      <Text style={styles.disclaimer}>
        For educational purposes only. Not medical advice.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 16,
  },
  brand: {
    ...Typography.footerText,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  link: {
    ...Typography.footerText,
    color: Colors.gradientStart,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  disclaimer: {
    ...Typography.footerText,
    color: Colors.textDisabled,
    textAlign: 'center',
    marginTop: 4,
  },
});
