import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors } from '../constants/colors';

export function MissionCard({ title, reason, onComplete, completed }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.reason}>{reason}</Text>
      {!completed && (
        <Button
          title="Complete"
          variant="primary"
          onPress={onComplete}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 24,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  reason: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    marginTop: 4,
  },
});
