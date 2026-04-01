import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectDropdownProps<T extends string> {
  label: string;
  required?: boolean;
  options: SelectOption<T>[];
  selectedValue: T | null;
  onValueChange: (value: T) => void;
  placeholder?: string;
}

export function SelectDropdown<T extends string>({
  label,
  required,
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select...',
}: SelectDropdownProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = options.find((o) => o.value === selectedValue)?.label ?? null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        accessibilityRole="combobox"
        accessibilityLabel={label}
        accessibilityValue={{ text: selectedLabel ?? placeholder }}
      >
        <Text style={[styles.triggerText, !selectedLabel && styles.placeholder]}>
          {selectedLabel ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{label}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} accessibilityLabel="Close">
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, item.value === selectedValue && styles.optionSelected]}
                onPress={() => {
                  onValueChange(item.value);
                  setModalVisible(false);
                }}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: item.value === selectedValue }}
              >
                <Text
                  style={[
                    styles.optionText,
                    item.value === selectedValue && styles.optionTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {item.value === selectedValue && (
                  <Ionicons name="checkmark" size={18} color={Colors.gradientStart} />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>
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
  trigger: {
    height: Spacing.inputHeight,
    borderRadius: Spacing.inputBorderRadius,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  triggerText: {
    ...Typography.inputValue,
    color: Colors.textPrimary,
    flex: 1,
  },
  placeholder: {
    color: Colors.textDisabled,
  },
  modal: {
    flex: 1,
    backgroundColor: Colors.backgroundPage,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.backgroundCard,
  },
  optionSelected: {
    backgroundColor: '#EBF3FF',
  },
  optionText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.brandMid,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 16,
  },
});
