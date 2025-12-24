export const colors = {
  // Primary
  primary: '#007AFF',
  primaryLight: '#E8F0FE',

  // Background
  background: '#FFFFFF',
  backgroundDark: '#000000',
  backgroundSecondary: '#F8F8F8',
  backgroundTertiary: '#F0F0F0',
  backgroundCard: '#1A1A1A',
  backgroundError: '#FFF0F0',
  backgroundInfo: '#F0F8FF',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textLight: '#AAAAAA',
  textPlaceholder: '#BBBBBB',
  textWhite: '#FFFFFF',
  textInfo: '#333333',

  // Status
  error: '#FF3B30',
  errorLight: 'rgba(255, 59, 48, 0.9)',
  success: '#34C759',
  warning: '#FF9500',

  // UI Elements
  border: '#E5E5E5',
  disabled: '#E5E5E5',
  disabledText: '#999999',
  overlay: 'rgba(0, 0, 0, 0.6)',
  track: '#E5E5E5',

  // Transparent
  transparent: 'transparent',
  black: '#000000',
  white: '#FFFFFF',
} as const;

export type ColorName = keyof typeof colors;
