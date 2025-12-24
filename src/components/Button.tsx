import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { colors } from '@/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textStyle: TextStyle[] = [
    styles.text,
    variant === 'secondary' && styles.secondaryText,
    disabled && styles.disabledText,
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primary : colors.white} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  secondaryText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.disabledText,
  },
});
