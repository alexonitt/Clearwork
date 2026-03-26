import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../constants/colors';

export function IdeaCard({ hook, caption, platform, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `${hook}\n\n${caption}`;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.hook}>{hook}</Text>
      <Text style={styles.caption} numberOfLines={4}>{caption}</Text>
      <View style={styles.footer}>
        <View style={styles.platformPill}>
          <Text style={styles.platformText}>{platform}</Text>
        </View>
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.8}>
          <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  hook: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  platformPill: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  platformText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  copyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  copyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
});
