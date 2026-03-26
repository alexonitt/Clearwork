import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';
import { HabitGrid } from '../components/HabitGrid';
import { MissionCard } from '../components/MissionCard';
import { ChatSheet } from '../components/ChatSheet';
import { FloatingChatButton } from '../components/FloatingChatButton';
import { generateDailyMissions, generateDailyMotivation } from '../utils/gemini';
import {
  getTodayDateStr,
  getUserProfile,
  getDailyMissions,
  setDailyMissions,
  getCompletedMissionIndices,
  setCompletedMissionIndices,
  getCompletedMissionDates,
  addCompletedMissionDate,
  getStreak,
  setStreak,
} from '../utils/storage';

export default function HomeScreen() {
  const [profile, setProfile] = React.useState(null);
  const [missions, setMissions] = React.useState([]);
  const [completed, setCompleted] = React.useState([]);
  const [completedDates, setCompletedDates] = React.useState([]);
  const [streak, setStreakState] = React.useState(0);
  const [motivation, setMotivation] = React.useState('');
  const [chatOpen, setChatOpen] = React.useState(false);

  const slide = React.useRef(new Animated.Value(0)).current;

  const today = getTodayDateStr();

  useEffect(() => {
    (async () => {
      const p = await getUserProfile();
      setProfile(p);
      const s = await getStreak();
      setStreakState(s);
      const dates = await getCompletedMissionDates();
      setCompletedDates(dates);

      const done = await getCompletedMissionIndices(today);
      setCompleted(done);

      let dayMissions = await getDailyMissions(today);
      if (!dayMissions && p?.niche && p?.platforms?.length) {
        dayMissions = await generateDailyMissions(p.niche, p.platforms);
        await setDailyMissions(today, dayMissions);
      }
      setMissions(dayMissions || []);

      if (p?.niche) {
        try {
          const m = await generateDailyMotivation(p.niche);
          setMotivation(m);
        } catch {
          setMotivation('');
        }
      }
    })();
  }, []);

  const greeting = getGreeting();
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  const currentIndex = firstIncompleteIndex(missions, completed);
  const current = missions[currentIndex] || missions[0];
  const progressText = missions.length ? `${Math.min(currentIndex + 1, missions.length)} of ${missions.length}` : '';

  const completeCurrent = async () => {
    if (!missions.length) return;
    const idx = currentIndex;
    if (completed.includes(idx)) return;

    Animated.timing(slide, { toValue: 1, duration: 220, useNativeDriver: true }).start(async () => {
      slide.setValue(0);
      const next = [...completed, idx].sort((a, b) => a - b);
      setCompleted(next);
      await setCompletedMissionIndices(today, next);

      // streak: +1 if first mission completed today
      if (next.length === 1) {
        await addCompletedMissionDate(today);
        setCompletedDates((prev) => (prev.includes(today) ? prev : [...prev, today]));
        const newStreak = streak + 1;
        setStreakState(newStreak);
        await setStreak(newStreak);
      }
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.greeting}>{greeting}</Text>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>🔥 {streak} day streak</Text>
        </View>
        {!!motivation && <Text style={styles.motivation}>{motivation}</Text>}
      </View>

      <HabitGrid completedDates={completedDates} label="Your consistency" />

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Today’s Mission</Text>
        <Text style={styles.sectionMeta}>{progressText}</Text>
      </View>

      {current ? (
        <Animated.View
          style={{
            transform: [
              {
                translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }),
              },
            ],
            opacity: slide.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          }}
        >
          <MissionCard title={current.title} reason={current.reason} onComplete={completeCurrent} />
        </Animated.View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No missions yet</Text>
          <Text style={styles.emptySub}>Finish onboarding to get personalized missions.</Text>
        </View>
      )}

      <FloatingChatButton onPress={() => setChatOpen(true)} />
      <ChatSheet
        visible={chatOpen}
        onClose={() => setChatOpen(false)}
        niche={profile?.niche}
        goal={profile?.goal}
      />
    </View>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : 'Good evening';
}

function firstIncompleteIndex(missions, completed) {
  for (let i = 0; i < missions.length; i++) if (!completed.includes(i)) return i;
  return Math.max(0, missions.length - 1);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 56,
    paddingHorizontal: 18,
  },
  header: {
    marginBottom: 8,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  greeting: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 8,
  },
  streakPill: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  streakText: {
    color: colors.accentText,
    fontSize: 13,
    fontWeight: '800',
  },
  motivation: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  emptySub: { color: colors.textSecondary, marginTop: 8, lineHeight: 20 },
});

