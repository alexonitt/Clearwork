import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSizes } from '../../constants/fonts';
import { spacing } from '../../constants/spacing';
import { Button } from '../../components/Button';

const OPTIONS = ['Daily', '3x a week', 'Weekly'];

export function PostingFrequencyScreen({ navigation, route }) {
  const [postingFrequency, setPostingFrequency] = useState(route.params?.postingFrequency ?? null);

  const next = () => {
    navigation.navigate('Describe', { ...route.params, postingFrequency });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How often can you post?</Text>
        {OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.option, postingFrequency === opt && styles.optionSelected]}
            onPress={() => setPostingFrequency(opt)}
          >
            <Text style={[styles.optionText, postingFrequency === opt && styles.optionTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Continue" onPress={next} disabled={!postingFrequency} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  content: { flex: 1, paddingTop: spacing.xxl },
  title: { fontSize: fontSizes.headline, fontWeight: '600', color: colors.text, marginBottom: spacing.xl },
  option: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: '#EFF6FF' },
  optionText: { fontSize: fontSizes.body, color: colors.text },
  optionTextSelected: { color: colors.accent, fontWeight: '600' },
});
