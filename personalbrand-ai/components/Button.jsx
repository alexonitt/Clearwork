import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  textStyle,
}) {
  const isPrimary = variant === 'primary';
  const isAccent = variant === 'accent';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isAccent && styles.accent,
        !isPrimary && !isAccent && styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isAccent ? colors.accentText : colors.text} />
      ) : (
        <Text
          style={[
            styles.text,
            isAccent && styles.accentText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.text,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  accent: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.cardElevated,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
  },
  accentText: {
    color: colors.accentText,
  },
});
