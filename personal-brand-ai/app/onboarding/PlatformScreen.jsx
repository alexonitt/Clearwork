import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSizes } from '../../constants/fonts';
import { spacing } from '../../constants/spacing';
import { Button } from '../../components/Button';

const OPTIONS = ['Instagram', 'TikTok', 'LinkedIn', 'All'];

export function PlatformScreen({ navigation, route }) {
  const [platform, setPlatform] = useState(route.params?.platform ?? null);

  const next = () => {
    navigation.navigate('Goal', { ...route.params, platform });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What platform are you focusing on?</Text>
        {OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.option, platform === opt && styles.optionSelected]}
            onPress={() => setPlatform(opt)}
          >
            <Text style={[styles.optionText, platform === opt && styles.optionTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Continue" onPress={next} disabled={!platform} />
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
