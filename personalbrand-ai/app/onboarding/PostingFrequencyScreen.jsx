import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { Button } from '../../components/Button';

const OPTIONS = [
  { key: 'barely', label: '😴 I barely post' },
  { key: 'sometimes', label: '📱 I post sometimes' },
  { key: 'regularly', label: '🔥 I post regularly' },
];

export default function PostingFrequencyScreen() {
  const router = useRouter();
  const { niche, platforms, goal, age } = useLocalSearchParams();
  const [selected, setSelected] = React.useState(null);

  return (
    <View style={styles.screen}>
      <Text style={styles.question}>How active are you right now?</Text>

      <View style={{ marginTop: 18, gap: 12 }}>
        {OPTIONS.map((o) => {
          const active = selected === o.key;
          return (
            <TouchableOpacity
              key={o.key}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => setSelected(o.key)}
              activeOpacity={0.85}
            >
              <Text style={styles.cardText}>{o.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.bottom}>
        <Button
          title="Get Started"
          variant="accent"
          disabled={!selected}
          onPress={() =>
            router.push({
              pathname: '/onboarding/BrandIdentityResultScreen',
              params: { niche, platforms, goal, age, activityLevel: selected },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 56,
  },
  question: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  card: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 22,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: colors.accent,
  },
  cardText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
});

