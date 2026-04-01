import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface CheckboxProps {
  label: string;
  sublabel?: string;
  checked: boolean;
  onToggle: () => void;
}

export function Checkbox({ label, sublabel, checked, onToggle }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color={Colors.textWhite} />}
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    minHeight: 44,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: Colors.brandBlue,
    borderColor: Colors.brandBlue,
  },
  labelContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...Typography.inputLabel,
    color: Colors.textPrimary,
  },
  sublabel: {
    ...Typography.helperText,
    color: Colors.textSecondary,
  },
});
