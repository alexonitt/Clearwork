import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { getCompletedTaskDates, getUserProfile } from '../utils/storage';
import { generateMonetizationPlan } from '../utils/gemini';
import { colors } from '../constants/colors';
import { fontSizes } from '../constants/fonts';
import { spacing } from '../constants/spacing';

const MONETIZATION_METHODS = [
  'Affiliate Marketing',
  'Brand Deals',
  'Digital Products',
  'Services and Coaching',
];

async function getDaysCompleted() {
  const dates = await getCompletedTaskDates();
  const unique = [...new Set(dates)];
  return Math.min(30, unique.length);
}

export function MonetizationScreen() {
  const [daysCompleted, setDaysCompleted] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [steps, setSteps] = useState({});
  const [loadingMethod, setLoadingMethod] = useState(null);

  const load = useCallback(async () => {
    const completed = await getDaysCompleted();
    setDaysCompleted(completed);
    setUnlocked(completed >= 30);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const toggleExpand = async (method) => {
    if (expanded === method) {
      setExpanded(null);
      return;
    }
    setExpanded(method);
    if (!steps[method]) {
      setLoadingMethod(method);
      try {
        const profile = await getUserProfile();
        const plan = await generateMonetizationPlan(profile, method);
        setSteps((s) => ({ ...s, [method]: plan }));
      } catch (e) {
        setSteps((s) => ({ ...s, [method]: ['Failed to load. Try again.'] }));
      }
      setLoadingMethod(null);
    }
  };

  if (!unlocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.lockedTitle}>Monetization Hub</Text>
        <Text style={styles.lockedMessage}>Complete 30 days to unlock monetization coaching</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(daysCompleted / 30) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{daysCompleted} out of 30 days completed</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Monetization Hub</Text>
        <Text style={styles.subtitle}>Tap a method for a step-by-step plan.</Text>
        {MONETIZATION_METHODS.map((method) => (
          <TouchableOpacity
            key={method}
            style={styles.methodCard}
            onPress={() => toggleExpand(method)}
            activeOpacity={0.7}
          >
            <Text style={styles.methodTitle}>{method}</Text>
            {expanded === method && (
              <View style={styles.steps}>
                {loadingMethod === method ? (
                  <Text style={styles.stepText}>Loading...</Text>
                ) : (
                  (steps[method] || []).map((step, i) => (
                    <Text key={i} style={styles.stepText}>{i + 1}. {step}</Text>
                  ))
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  lockedTitle: { fontSize: fontSizes.headline, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  lockedMessage: { fontSize: fontSizes.body, color: colors.muted, marginBottom: spacing.lg },
  progressBarBg: { height: 12, backgroundColor: colors.grey, borderRadius: 6, overflow: 'hidden', marginBottom: spacing.sm },
  progressBarFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 6 },
  progressText: { fontSize: fontSizes.body, color: colors.text },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl },
  title: { fontSize: fontSizes.headline, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: fontSizes.body, color: colors.muted, marginBottom: spacing.lg },
  methodCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  methodTitle: { fontSize: fontSizes.large, fontWeight: '600', color: colors.text },
  steps: { marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  stepText: { fontSize: fontSizes.small, color: colors.text, marginBottom: spacing.xs, lineHeight: 20 },
});
