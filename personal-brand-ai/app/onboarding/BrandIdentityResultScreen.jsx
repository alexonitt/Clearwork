import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { generateBrandIdentity } from '../../utils/gemini';
import { setUserProfile, setBrandIdentity, setOnboardingComplete } from '../../utils/storage';
import { useOnboarding } from '../../context/OnboardingContext';
import { colors } from '../../constants/colors';
import { fontSizes } from '../../constants/fonts';
import { spacing } from '../../constants/spacing';
import { Button } from '../../components/Button';

export function BrandIdentityResultScreen({ navigation, route }) {
  const { profile } = route.params ?? {};
  const { setOnboardingComplete: setOnboardingCompleteContext } = useOnboarding();
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) {
      setIdentity({
        positioning: 'Build a clear, trustworthy personal brand with consistent, helpful content.',
        pillars: ['Quick wins and tutorials', 'Behind-the-scenes process', 'Proof, results, and lessons learned'],
        checklist: [
          'Clarify who you help and the outcome in your bio',
          'Add one clear call-to-action',
          'Pin 3 posts: value, proof, story',
          'Use a consistent profile photo and banner',
          'Create highlights/featured posts for FAQs',
        ],
        raw: '',
      });
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const result = await generateBrandIdentity(profile);
        if (!cancelled) {
          setIdentity(result);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [profile?.niche]);

  const finishOnboarding = async () => {
    await setUserProfile(profile);
    if (identity) await setBrandIdentity(identity);
    await setOnboardingComplete(true);
    setOnboardingCompleteContext(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Creating your brand identity...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Your Brand Identity</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Positioning</Text>
          <Text style={styles.positioning}>{identity?.positioning}</Text>
        </View>
        <Text style={styles.sectionTitle}>Content pillars</Text>
        {(identity?.pillars ?? []).map((p, i) => (
          <View key={i} style={styles.pillarCard}>
            <Text style={styles.pillarText}>{p}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>Profile checklist</Text>
        {(identity?.checklist ?? []).map((item, i) => (
          <View key={i} style={styles.checkItem}>
            <Text style={styles.checkText}>• {item}</Text>
          </View>
        ))}
      </ScrollView>
      <Button title="Continue to my dashboard" onPress={finishOnboarding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  loadingText: { marginTop: spacing.md, fontSize: fontSizes.body, color: colors.muted },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },
  screenTitle: { fontSize: fontSizes.headline, fontWeight: '600', color: colors.text, marginBottom: spacing.lg },
  card: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  label: { fontSize: fontSizes.small, color: colors.muted, marginBottom: spacing.xs },
  positioning: { fontSize: fontSizes.body, color: colors.text, lineHeight: 24 },
  sectionTitle: { fontSize: fontSizes.large, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  pillarCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pillarText: { fontSize: fontSizes.body, color: colors.text },
  checkItem: { marginBottom: spacing.xs },
  checkText: { fontSize: fontSizes.body, color: colors.text },
});
