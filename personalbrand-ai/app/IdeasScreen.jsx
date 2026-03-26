import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../constants/colors';
import { Button } from '../components/Button';
import { IdeaCard } from '../components/IdeaCard';
import { ChatSheet } from '../components/ChatSheet';
import { FloatingChatButton } from '../components/FloatingChatButton';
import { generatePostIdeas } from '../utils/gemini';
import { getUserProfile } from '../utils/storage';

export default function IdeasScreen() {
  const [profile, setProfile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await getUserProfile();
      setProfile(p);
    })();
  }, []);

  const generate = async () => {
    if (!profile?.niche) return;
    setLoading(true);
    try {
      const res = await generatePostIdeas(profile.niche, profile.platforms || []);
      setIdeas(res || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingTop: 56, paddingHorizontal: 18, paddingBottom: 140 }}>
        <Text style={styles.h1}>Content Ideas</Text>
        <View style={{ marginTop: 16 }}>
          <Button title="Generate Ideas" variant="accent" loading={loading} onPress={generate} />
        </View>

        <View style={{ marginTop: 18 }}>
          {ideas.map((i, idx) => (
            <IdeaCard key={idx} hook={i.hook} caption={i.caption} platform={i.platform} />
          ))}
        </View>

        {!!ideas.length && (
          <View style={{ marginTop: 8 }}>
            <Button title="Get New Ideas" variant="primary" loading={loading} onPress={generate} />
          </View>
        )}

        {!ideas.length && !loading && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Your next 3 posts are one tap away.</Text>
            <Text style={styles.emptySub}>Hit “Generate Ideas” to get hooks and captions.</Text>
          </View>
        )}
      </ScrollView>

      <FloatingChatButton onPress={() => setChatOpen(true)} />
      <ChatSheet visible={chatOpen} onClose={() => setChatOpen(false)} niche={profile?.niche} goal={profile?.goal} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  h1: { color: colors.text, fontSize: 30, fontWeight: '900' },
  empty: { marginTop: 20, backgroundColor: colors.cardElevated, borderRadius: 16, padding: 18 },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '800', lineHeight: 22 },
  emptySub: { marginTop: 10, color: colors.textSecondary, fontWeight: '600', lineHeight: 20 },
});

