import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

type InputStatus = 'normal' | 'mildly_elevated' | 'elevated' | 'critical';

interface CalculatorInputProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  value: string;
  onChangeText: (text: string) => void;
  status?: InputStatus;
  error?: string;
  warning?: string;
  style?: ViewStyle;
  accessibilityHint?: string;
}

const STATUS_COLORS: Record<InputStatus, string> = {
  normal: Colors.normal,
  mildly_elevated: Colors.moderate,
  elevated: Colors.severe,
  critical: Colors.critical,
};

export function CalculatorInput({
  label,
  required,
  placeholder,
  helperText,
  value,
  onChangeText,
  status,
  error,
  warning,
  style,
  accessibilityHint,
}: CalculatorInputProps) {
  const [focused, setFocused] = useState(false);

  const showDot = value.length > 0 && status;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label} accessibilityRole="text">
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textDisabled}
          keyboardType="decimal-pad"
          returnKeyType="done"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint ?? helperText}
        />
        {showDot && (
          <View
            style={[styles.statusDot, { backgroundColor: STATUS_COLORS[status!] }]}
            accessibilityLabel={`Status: ${status}`}
          />
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : warning ? (
        <Text style={styles.warningText}>{warning}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    ...Typography.inputLabel,
    color: Colors.textPrimary,
  },
  required: {
    color: Colors.severe,
  },
  inputWrapper: {
    height: Spacing.inputHeight,
    borderRadius: Spacing.inputBorderRadius,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderWidth: 1.5,
    borderColor: Colors.brandBlue,
    shadowColor: Colors.brandBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  inputWrapperError: {
    borderColor: Colors.severe,
  },
  input: {
    flex: 1,
    ...Typography.inputValue,
    color: Colors.textPrimary,
    padding: 0,
  },
  statusDot: {
    width: Spacing.statusDotSize,
    height: Spacing.statusDotSize,
    borderRadius: Spacing.statusDotSize / 2,
    marginLeft: 8,
  },
  helperText: {
    ...Typography.helperText,
    color: Colors.textSecondary,
  },
  errorText: {
    ...Typography.helperText,
    color: Colors.severe,
  },
  warningText: {
    ...Typography.helperText,
    color: Colors.moderate,
  },
});
