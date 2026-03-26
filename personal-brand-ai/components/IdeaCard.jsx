import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../constants/colors';
import { fontSizes } from '../constants/fonts';
import { spacing } from '../constants/spacing';
import { Button } from './Button';

export function IdeaCard({ idea, index }) {
  const copyCaption = async () => {
    const text = [idea.topic, idea.hook, idea.caption].filter(Boolean).join('\n\n');
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Caption copied to clipboard.');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.topic}>{idea.topic}</Text>
      <Text style={styles.hook}>"{idea.hook}"</Text>
      <Text style={styles.caption}>{idea.caption}</Text>
      <Text style={styles.bestTime}>Best time: {idea.bestTime}</Text>
      <Button title="Copy caption" onPress={copyCaption} style={styles.copyButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  topic: {
    fontSize: fontSizes.large,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  hook: {
    fontSize: fontSizes.body,
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  caption: {
    fontSize: fontSizes.small,
    color: colors.muted,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  bestTime: {
    fontSize: fontSizes.small,
    color: colors.accent,
    marginBottom: spacing.md,
  },
  copyButton: {
    marginTop: spacing.xs,
  },
});
