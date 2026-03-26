import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { generateBrandIdentity } from '../../utils/gemini';
import { setOnboardingComplete, setUserProfile, setBrandIdentity } from '../../utils/storage';
import { Button } from '../../components/Button';

export default function BrandIdentityResultScreen() {
  const router = useRouter();
  const { niche, platforms, goal, age, activityLevel } = useLocalSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [identity, setIdentity] = React.useState(null);
  const [error, setError] = React.useState('');

  const dots = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(dots, { toValue: 1, duration: 900, useNativeDriver: true })
    ).start();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const parsedPlatforms = safeParsePlatforms(platforms);
        const profile = {
          niche: String(niche || ''),
          platforms: parsedPlatforms,
          goal: String(goal || ''),
          age: Number(age || 0),
          activityLevel: String(activityLevel || ''),
        };

        await setUserProfile(profile);
        const id = await generateBrandIdentity(profile.niche, profile.platforms, profile.goal, profile.age, profile.activityLevel);
        await setBrandIdentity(id);
        await setOnboardingComplete(true);
        setIdentity(id);
      } catch (e) {
        setError(e?.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    const opacity = dots.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 1, 0.3] });
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingTitle}>Building your brand identity</Text>
        <Animated.Text style={[styles.dots, { opacity }]}>•••</Animated.Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingTitle}>Couldn’t finish that</Text>
        <Text style={styles.error}>{error}</Text>
        <View style={{ marginTop: 18, width: '100%' }}>
          <Button title="Try again" variant="primary" onPress={() => router.replace('/onboarding/BrandIdentityResultScreen')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.h1}>You’re officially started.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Positioning</Text>
        <Text style={styles.positioning}>{identity?.positioning}</Text>
        <Text style={[styles.cardTitle, { marginTop: 16 }]}>Content pillars</Text>
        <View style={styles.pillsRow}>
          {(identity?.pillars || []).slice(0, 3).map((p) => (
            <View key={p} style={styles.pill}>
              <Text style={styles.pillText}>{p}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flex: 1 }} />
      <Button title="Go to Home" variant="accent" onPress={() => router.replace('/(tabs)/home')} />
      <View style={{ height: 24 }} />
    </View>
  );
}

function safeParsePlatforms(value) {
  try {
    const arr = JSON.parse(String(value || '[]'));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  loadingTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  dots: {
    color: colors.accent,
    fontSize: 28,
    marginTop: 10,
    letterSpacing: 6,
  },
  error: {
    marginTop: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 56,
    paddingHorizontal: 18,
  },
  h1: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  positioning: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  pill: {
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
});

