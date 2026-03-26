import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';
import { ChatSheet } from '../components/ChatSheet';
import { FloatingChatButton } from '../components/FloatingChatButton';
import { Button } from '../components/Button';
import { generateMonetizationPlan } from '../utils/gemini';
import { getBrandIdentity, getCompletedMissionDates, getStreak, getUserProfile } from '../utils/storage';

const METHODS = ['Affiliate Marketing', 'Brand Deals', 'Digital Products', 'Services and Coaching'];

export default function ProgressScreen() {
  const [profile, setProfile] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [completedDates, setCompletedDates] = useState([]);
  const [streak, setStreakState] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  const [openMethod, setOpenMethod] = useState('');
  const [methodLoading, setMethodLoading] = useState(false);
  const [methodSteps, setMethodSteps] = useState([]);

  useEffect(() => {
    (async () => {
      const p = await getUserProfile();
      setProfile(p);
      const id = await getBrandIdentity();
      setIdentity(id);
      const dates = await getCompletedMissionDates();
      setCompletedDates(dates);
      const s = await getStreak();
      setStreakState(s);
    })();
  }, []);

  const last7 = useMemo(() => getLastNDates(7), []);
  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);

  const daysActive = completedDates.length;
  const unlocked = daysActive >= 30;
  const progressToUnlock = Math.min(30, daysActive);

  const toggleMethod = async (m) => {
    if (!unlocked) return;
    if (openMethod === m) {
      setOpenMethod('');
      return;
    }
    setOpenMethod(m);
    setMethodLoading(true);
    setMethodSteps([]);
    try {
      const steps = await generateMonetizationPlan(profile?.niche || 'personal brand', m);
      setMethodSteps((Array.isArray(steps) ? steps : []).slice(0, 10));
    } finally {
      setMethodLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingTop: 56, paddingHorizontal: 18, paddingBottom: 140 }}>
        <View style={styles.streakBlock}>
          <Text style={styles.bigStreak}>🔥 {streak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>

          <View style={styles.weekRow}>
            {last7.map((d) => {
              const filled = completedSet.has(d);
              return <View key={d} style={[styles.dayDot, filled ? styles.dayDotFill : styles.dayDotEmpty]} />;
            })}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{daysActive}</Text>
            <Text style={styles.statLabel}>Total days active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{Math.min(7, countInLastNDays(completedSet, 7))}</Text>
            <Text style={styles.statLabel}>Active last 7 days</Text>
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Brand Identity</Text>
          <View style={styles.card}>
            <Text style={styles.positioning}>{identity?.positioning || 'Your positioning will show here.'}</Text>
            <View style={styles.pillsRow}>
              {(identity?.pillars || []).slice(0, 3).map((p) => (
                <View key={p} style={styles.pill}>
                  <Text style={styles.pillText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Monetization Hub</Text>
          {!unlocked ? (
            <View style={styles.lockCard}>
              <Text style={styles.lockTitle}>🔒 Locked</Text>
              <Text style={styles.lockSub}>Complete 30 days to unlock monetization coaching</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(progressToUnlock / 30) * 100}%` }]} />
              </View>
              <Text style={styles.lockMeta}>{progressToUnlock} / 30 days</Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {METHODS.map((m) => (
                <View key={m} style={[styles.expandCard, openMethod === m && styles.expandActive]}>
                  <TouchableOpacity onPress={() => toggleMethod(m)} activeOpacity={0.85}>
                    <Text style={styles.expandTitle}>{m}</Text>
                    <Text style={styles.expandSub}>Tap to see the exact next steps.</Text>
                  </TouchableOpacity>

                  {openMethod === m && (
                    <View style={{ marginTop: 12 }}>
                      {methodLoading ? (
                        <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                          <ActivityIndicator color={colors.accent} />
                          <Text style={styles.loadingText}>Building your plan…</Text>
                        </View>
                      ) : (
                        <View style={{ gap: 10 }}>
                          {methodSteps.slice(0, 10).map((s, idx) => (
                            <View key={idx} style={styles.stepRow}>
                              <Text style={styles.stepNum}>{idx + 1}</Text>
                              <Text style={styles.stepText}>{s}</Text>
                            </View>
                          ))}
                          {!!methodSteps.length && (
                            <View style={{ marginTop: 8 }}>
                              <Button title="Regenerate" variant="primary" onPress={() => toggleMethod(m)} />
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <FloatingChatButton onPress={() => setChatOpen(true)} />
      <ChatSheet visible={chatOpen} onClose={() => setChatOpen(false)} niche={profile?.niche} goal={profile?.goal} />
    </View>
  );
}

function getLastNDates(n) {
  const out = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(x.getDate() - i);
    out.push(x.toISOString().split('T')[0]);
  }
  return out;
}

function countInLastNDays(set, n) {
  return getLastNDates(n).reduce((acc, d) => acc + (set.has(d) ? 1 : 0), 0);
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  streakBlock: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 18,
  },
  bigStreak: { color: colors.text, fontSize: 44, fontWeight: '900' },
  streakLabel: { color: colors.textSecondary, fontSize: 14, fontWeight: '700', marginTop: 4 },
  weekRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  dayDot: { width: 16, height: 16, borderRadius: 8 },
  dayDotFill: { backgroundColor: colors.accent },
  dayDotEmpty: { backgroundColor: colors.habitEmpty },

  statsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statCard: { flex: 1, backgroundColor: colors.cardElevated, borderRadius: 16, padding: 16 },
  statNum: { color: colors.text, fontSize: 28, fontWeight: '900' },
  statLabel: { marginTop: 6, color: colors.textSecondary, fontWeight: '700' },

  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginBottom: 12 },
  card: { backgroundColor: colors.cardElevated, borderRadius: 16, padding: 18 },
  positioning: { color: colors.text, fontSize: 16, fontWeight: '800', fontStyle: 'italic', lineHeight: 22 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  pill: { backgroundColor: colors.card, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  pillText: { color: colors.text, fontSize: 13, fontWeight: '800' },

  lockCard: { backgroundColor: colors.cardElevated, borderRadius: 16, padding: 18 },
  lockTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  lockSub: { marginTop: 8, color: colors.textSecondary, fontWeight: '600', lineHeight: 20 },
  progressTrack: { marginTop: 14, height: 10, borderRadius: 999, backgroundColor: colors.card, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: colors.accent, borderRadius: 999 },
  lockMeta: { marginTop: 10, color: colors.textSecondary, fontWeight: '700' },

  expandCard: { backgroundColor: colors.cardElevated, borderRadius: 16, padding: 18, borderWidth: 2, borderColor: 'transparent' },
  expandActive: { borderColor: colors.accent },
  expandTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  expandSub: { marginTop: 6, color: colors.textSecondary, fontWeight: '600' },
  loadingText: { marginTop: 10, color: colors.textSecondary, fontWeight: '600' },
  stepRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNum: { color: colors.accent, fontWeight: '900', fontSize: 16, width: 18 },
  stepText: { color: colors.text, fontWeight: '700', flex: 1, lineHeight: 20 },
});

