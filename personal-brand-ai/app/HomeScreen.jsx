import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { TaskCard } from '../components/TaskCard';
import { getUserProfile, getStreak, getLastOpenDate, setStreak, setLastOpenDate, getCompletedTasks, setCompletedTasks, getTotalTasksCompleted, setTotalTasksCompleted, getDaysActiveThisWeek, setDaysActiveThisWeek, getTodayDateStr, getWeekStart, getCompletedTaskDates, addCompletedTaskDate, getUserName } from '../utils/storage';
import { generateDailyMotivation, generateDailyTasks } from '../utils/gemini';
import { colors } from '../constants/colors';
import { fontSizes } from '../constants/fonts';
import { spacing } from '../constants/spacing';

const STORAGE_DAY_KEY = '@personalbrand/home_day';
const STORAGE_TASKS_KEY = '@personalbrand/home_tasks';
const STORAGE_MOTIVATION_KEY = '@personalbrand/home_motivation';

import AsyncStorage from '@react-native-async-storage/async-storage';

async function getDailyState() {
  const today = getTodayDateStr();
  const storedDay = await AsyncStorage.getItem(STORAGE_DAY_KEY);
  const storedTasks = await AsyncStorage.getItem(STORAGE_TASKS_KEY);
  const storedMotivation = await AsyncStorage.getItem(STORAGE_MOTIVATION_KEY);

  if (storedDay === today && storedTasks) {
    return {
      day: today,
      tasks: JSON.parse(storedTasks),
      motivation: storedMotivation || '',
    };
  }
  return { day: today, tasks: null, motivation: null };
}

async function setDailyState(day, tasks, motivation) {
  await AsyncStorage.setItem(STORAGE_DAY_KEY, day);
  if (tasks) await AsyncStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
  if (motivation != null) await AsyncStorage.setItem(STORAGE_MOTIVATION_KEY, motivation);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen() {
  const [profile, setProfile] = useState(null);
  const [streak, setStreakState] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [motivation, setMotivation] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  const load = useCallback(async () => {
    const profileData = await getUserProfile();
    setProfile(profileData);
    const name = await getUserName();
    setUserName(name || '');

    const today = getTodayDateStr();
    let currentStreak = await getStreak();
    const lastOpen = await getLastOpenDate();

    if (lastOpen !== today) {
      const last = lastOpen ? new Date(lastOpen + 'T12:00:00') : null;
      const now = new Date(today + 'T12:00:00');
      const diffDays = last ? Math.round((now - last) / (1000 * 60 * 60 * 24)) : 1;
      const completedDates = await getCompletedTaskDates();
      if (diffDays === 1 && lastOpen && completedDates.includes(lastOpen)) {
        currentStreak += 1;
        await setStreak(currentStreak);
      } else if (diffDays > 1 || !lastOpen) {
        currentStreak = lastOpen ? 1 : 0;
        await setStreak(currentStreak);
      }
      await setLastOpenDate(today);

      const weekDates = await getDaysActiveThisWeek();
      const weekStart = getWeekStart(today);
      const existing = Array.isArray(weekDates) ? weekDates : [];
      if (!existing.includes(today)) {
        const updated = [...existing.filter((d) => d >= weekStart), today].slice(-7);
        await setDaysActiveThisWeek(updated);
      }
    }
    setStreakState(currentStreak);

    const daily = await getDailyState();
    let taskList = daily.tasks;
    let motiv = daily.motivation;

    if (!taskList && profileData) {
      try {
        taskList = await generateDailyTasks(profileData);
        motiv = await generateDailyMotivation(profileData);
        await setDailyState(today, taskList, motiv);
      } catch (e) {
        taskList = [];
        motiv = 'Stay consistent. Small steps lead to big results.';
      }
    }
    if (!taskList) taskList = [];
    setTasks(taskList);
    setMotivation(motiv || 'Stay consistent.');

    const completed = await getCompletedTasks();
    const todayIds = taskList.map((t) => t.id);
    const completedToday = Array.isArray(completed) ? completed.filter((id) => todayIds.includes(id)) : [];
    setCompletedIds(completedToday);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const toggleTask = async (taskId) => {
    const newCompleted = completedIds.includes(taskId)
      ? completedIds.filter((id) => id !== taskId)
      : [...completedIds, taskId];
    setCompletedIds(newCompleted);
    await setCompletedTasks(newCompleted);
    if (!completedIds.includes(taskId)) {
      const total = await getTotalTasksCompleted();
      await setTotalTasksCompleted(total + 1);
      await addCompletedTaskDate(getTodayDateStr());
    }
  };

  const greeting = getGreeting();
  const displayName = userName ? `, ${userName}` : '';

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <Text style={styles.greeting}>{greeting}{displayName}</Text>
      <View style={styles.streakBox}>
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.streakLabel}>day streak</Text>
      </View>
      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>{motivation}</Text>
      </View>
      <Text style={styles.sectionTitle}>Today's tasks</Text>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          completed={completedIds.includes(task.id)}
          onToggle={toggleTask}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  loading: { padding: spacing.lg, fontSize: fontSizes.body, color: colors.muted },
  greeting: { fontSize: fontSizes.headline, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  streakBox: {
    alignSelf: 'flex-start',
    backgroundColor: colors.grey,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  streakNumber: { fontSize: fontSizes.title, fontWeight: '700', color: colors.accent },
  streakLabel: { fontSize: fontSizes.small, color: colors.muted },
  motivationCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  motivationText: { fontSize: fontSizes.body, color: colors.text, fontStyle: 'italic' },
  sectionTitle: { fontSize: fontSizes.large, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
});
