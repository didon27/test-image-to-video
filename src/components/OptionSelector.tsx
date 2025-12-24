import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { colors } from '@/constants';

interface Option<T> {
  value: T;
  label: string;
}

interface OptionSelectorProps<T> {
  label: string;
  options: Option<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
}

export function OptionSelector<T extends string | number>({
  label,
  options,
  selectedValue,
  onSelect,
}: OptionSelectorProps<T>): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textInfo,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.primary,
  },
});
