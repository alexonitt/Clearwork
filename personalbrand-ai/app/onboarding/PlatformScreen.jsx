import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { PlatformCard } from '../../components/PlatformCard';
import { Button } from '../../components/Button';

const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'Snapchat', 'YouTube', 'Twitter/X'];

export default function PlatformScreen() {
  const router = useRouter();
  const { niche } = useLocalSearchParams();
  const [selected, setSelected] = React.useState([]);

  const toggle = (p) => {
    setSelected((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.question}>Where do you want to grow?</Text>
      <FlatList
        data={PLATFORMS}
        numColumns={2}
        keyExtractor={(item) => item}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 24, gap: 12 }}
        renderItem={({ item }) => (
          <PlatformCard platform={item} selected={selected.includes(item)} onPress={() => toggle(item)} />
        )}
      />
      <View style={styles.bottom}>
        <Button
          title="Next"
          variant="primary"
          disabled={selected.length === 0}
          onPress={() =>
            router.push({
              pathname: '/onboarding/GoalScreen',
              params: { niche, platforms: JSON.stringify(selected) },
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
  bottom: {
    paddingBottom: 24,
  },
});

