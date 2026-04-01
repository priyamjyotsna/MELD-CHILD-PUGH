import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Shadow, Spacing } from '../../constants/spacing';

interface CalculatorCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  onPress: () => void;
}

export function CalculatorCard({
  emoji,
  title,
  subtitle,
  description,
  onPress,
}: CalculatorCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${description}`}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.cardPadding,
    gap: 8,
    ...Shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 28,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.helperText,
    color: Colors.textSecondary,
  },
  chevron: {
    fontSize: 22,
    color: Colors.textDisabled,
    fontWeight: '300',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
