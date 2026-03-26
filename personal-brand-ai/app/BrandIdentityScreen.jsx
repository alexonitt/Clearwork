import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getBrandIdentity, setBrandIdentity, getUserProfile } from '../utils/storage';
import { regenerateBrandIdentity } from '../utils/gemini';
import { colors } from '../constants/colors';
import { fontSizes } from '../constants/fonts';
import { spacing } from '../constants/spacing';
import { Button } from '../components/Button';

export function BrandIdentityScreen() {
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const load = useCallback(async () => {
    const data = await getBrandIdentity();
    setIdentity(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleRegenerate = async () => {
    const profile = await getUserProfile();
    if (!profile) return;
    setRegenerating(true);
    try {
      const newIdentity = await regenerateBrandIdentity(profile, identity);
      await setBrandIdentity(newIdentity);
      setIdentity(newIdentity);
    } catch (e) {
      console.warn(e);
    }
    setRegenerating(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  if (!identity) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No brand identity yet. Complete onboarding first.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Brand Identity</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Positioning</Text>
          <Text style={styles.positioning}>{identity.positioning}</Text>
        </View>
        <Text style={styles.sectionTitle}>Content pillars</Text>
        {(identity.pillars ?? []).map((p, i) => (
          <View key={i} style={styles.pillarCard}>
            <Text style={styles.pillarText}>{p}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>Profile checklist</Text>
        {(identity.checklist ?? []).map((item, i) => (
          <View key={i} style={styles.checkItem}>
            <Text style={styles.checkText}>• {item}</Text>
          </View>
        ))}
      </ScrollView>
      <Button title="Regenerate my brand identity" onPress={handleRegenerate} loading={regenerating} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  loading: { padding: spacing.lg, fontSize: fontSizes.body, color: colors.muted },
  empty: { padding: spacing.lg, fontSize: fontSizes.body, color: colors.muted },
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
  button: { marginTop: spacing.md },
});
