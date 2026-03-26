import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';

const PLATFORM_ICONS = {
  Instagram: '📷',
  TikTok: '🎵',
  LinkedIn: '💼',
  Snapchat: '👻',
  'YouTube': '▶️',
  'Twitter/X': '𝕏',
};

export function PlatformCard({ platform, selected, onPress }) {
  const icon = PLATFORM_ICONS[platform] || '•';

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{platform}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 100,
  },
  selected: {
    borderColor: colors.accent,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
