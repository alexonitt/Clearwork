import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { Button } from '../../components/Button';

const GOALS = [
  { key: 'followers', label: '🚀 Get more followers' },
  { key: 'professional', label: '💼 Look professional online' },
  { key: 'money', label: '💰 Make money from my content' },
];

export default function GoalScreen() {
  const router = useRouter();
  const { niche, platforms } = useLocalSearchParams();
  const [selected, setSelected] = React.useState(null);

  return (
    <View style={styles.screen}>
      <Text style={styles.question}>What is your main goal?</Text>

      <View style={{ marginTop: 18, gap: 12 }}>
        {GOALS.map((g) => {
          const active = selected === g.key;
          return (
            <TouchableOpacity
              key={g.key}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => setSelected(g.key)}
              activeOpacity={0.85}
            >
              <Text style={styles.cardText}>{g.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.bottom}>
        <Button
          title="Next"
          variant="primary"
          disabled={!selected}
          onPress={() =>
            router.push({
              pathname: '/onboarding/AgeScreen',
              params: { niche, platforms, goal: selected },
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

