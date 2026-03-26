import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSizes } from '../../constants/fonts';
import { spacing } from '../../constants/spacing';
import { Button } from '../../components/Button';

export function DescribeScreen({ navigation, route }) {
  const [about, setAbout] = useState(route.params?.about ?? '');

  const next = () => {
    const profile = {
      niche: route.params.niche,
      platform: route.params.platform,
      goal: route.params.goal,
      postingFrequency: route.params.postingFrequency,
      about: about.trim(),
    };
    navigation.navigate('BrandIdentityResult', { profile });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.title}>Describe yourself in one sentence</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={about}
          onChangeText={setAbout}
          placeholder="e.g. I'm a software engineer who loves teaching beginners."
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={3}
        />
      </View>
      <Button title="Create my brand identity" onPress={next} disabled={!about.trim()} />
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
  title: { fontSize: fontSizes.headline, fontWeight: '600', color: colors.text, marginBottom: spacing.xl },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  inputMultiline: { minHeight: 100, textAlignVertical: 'top' },
});
