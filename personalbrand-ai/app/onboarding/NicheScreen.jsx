import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { Button } from '../../components/Button';

const OPTIONS = [
  { label: 'Fitness', emoji: '💪' },
  { label: 'Food', emoji: '🍕' },
  { label: 'Fashion', emoji: '👗' },
  { label: 'Music', emoji: '🎵' },
  { label: 'Business', emoji: '💼' },
  { label: 'Gaming', emoji: '🎮' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Beauty', emoji: '💄' },
  { label: 'Crypto', emoji: '💰' },
  { label: 'Lifestyle', emoji: '🌿' },
  { label: 'Art', emoji: '🎨' },
  { label: 'Sports', emoji: '⚽' },
];

export default function NicheScreen() {
  const router = useRouter();
  const [selected, setSelected] = React.useState(null);

  return (
    <View style={styles.screen}>
      <Text style={styles.question}>What do you want to be known for?</Text>
      <FlatList
        data={OPTIONS}
        numColumns={2}
        keyExtractor={(item) => item.label}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 24, gap: 12 }}
        renderItem={({ item }) => {
          const active = selected === item.label;
          return (
            <TouchableOpacity
              style={[styles.card, active && styles.cardActive]}
              onPress={() => setSelected(item.label)}
              activeOpacity={0.85}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />
      {selected && (
        <View style={styles.bottom}>
          <Button
            title="Next"
            variant="primary"
            onPress={() => router.push({ pathname: '/onboarding/PlatformScreen', params: { niche: selected } })}
          />
        </View>
      )}
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
    flex: 1,
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 120,
  },
  cardActive: {
    borderColor: colors.accent,
  },
  emoji: {
    fontSize: 34,
    marginBottom: 10,
  },
  cardLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  bottom: {
    paddingBottom: 24,
  },
});

