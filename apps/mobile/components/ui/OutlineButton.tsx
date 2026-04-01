import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

interface OutlineButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function OutlineButton({ title, onPress, disabled, style }: OutlineButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.button, disabled && styles.disabled, style]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Spacing.buttonHeight,
    borderRadius: Spacing.buttonBorderRadius,
    borderWidth: 1.5,
    borderColor: Colors.brandBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#EBF3FF',
  },
  disabled: {
    borderColor: Colors.textDisabled,
    backgroundColor: Colors.backgroundPage,
  },
  text: {
    ...Typography.buttonText,
    color: Colors.brandMid,
  },
  disabledText: {
    color: Colors.textDisabled,
  },
});
