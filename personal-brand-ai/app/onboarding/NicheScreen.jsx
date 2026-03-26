import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSizes } from '../../constants/fonts';
import { spacing } from '../../constants/spacing';
import { Button } from '../../components/Button';

export function NicheScreen({ navigation, route }) {
  const [niche, setNiche] = useState(route.params?.niche ?? '');

  const next = () => {
    navigation.navigate('Platform', { ...route.params, niche: niche.trim() });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.title}>What is your niche?</Text>
        <Text style={styles.subtitle}>e.g. Fitness, Tech, Cooking, Finance</Text>
        <TextInput
          style={styles.input}
          value={niche}
          onChangeText={setNiche}
          placeholder="Enter your niche"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
        />
      </View>
      <Button title="Continue" onPress={next} disabled={!niche.trim()} />
    </KeyboardAvoidingView>
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
  title: { fontSize: fontSizes.headline, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: fontSizes.body, color: colors.muted, marginBottom: spacing.xl },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: fontSizes.body,
    color: colors.text,
  },
});
