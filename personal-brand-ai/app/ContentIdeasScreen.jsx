import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getUserProfile } from '../utils/storage';
import { generatePostIdeas } from '../utils/gemini';
import { IdeaCard } from '../components/IdeaCard';
import { Button } from '../components/Button';
import { colors } from '../constants/colors';
import { fontSizes } from '../constants/fonts';
import { spacing } from '../constants/spacing';

export function ContentIdeasScreen() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const profile = await getUserProfile();
    if (!profile) return;
    setLoading(true);
    try {
      const result = await generatePostIdeas(profile);
      setIdeas(result);
    } catch (e) {
      console.warn(e);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Content Ideas</Text>
      <Text style={styles.subtitle}>Get 3 post ideas tailored to your niche and platform.</Text>
      <Button title="Generate 3 Post Ideas" onPress={handleGenerate} loading={loading} style={styles.generateButton} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {ideas.map((idea, i) => (
          <IdeaCard key={i} idea={idea} index={i} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { fontSize: fontSizes.headline, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: fontSizes.body, color: colors.muted, marginBottom: spacing.lg },
  generateButton: { marginBottom: spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl },
});
