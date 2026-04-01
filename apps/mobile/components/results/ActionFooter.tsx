import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { GradientButton } from '../ui/GradientButton';
import { OutlineButton } from '../ui/OutlineButton';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

interface ActionFooterProps {
  onShare: () => void;
}

export function ActionFooter({ onShare }: ActionFooterProps) {
  const handleTrack = () => {
    Linking.openURL('https://livertracker.com/auth/signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.trackSection}>
        <GradientButton title="Track This Score" onPress={handleTrack} style={styles.button} />
        <Text style={styles.trackSubtext}>Monitor changes over time with LiverTracker</Text>
      </View>

      <OutlineButton title="Share with Doctor" onPress={onShare} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.fieldGap,
  },
  trackSection: {
    gap: 6,
  },
  button: {
    width: '100%',
  },
  trackSubtext: {
    ...Typography.helperText,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
