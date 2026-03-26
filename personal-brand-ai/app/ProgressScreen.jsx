import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getStreak, getTotalTasksCompleted, getDaysActiveThisWeek, getWeekStart, getTodayDateStr } from '../utils/storage';
import { colors } from '../constants/colors';
import { fontSizes } from '../constants/fonts';
import { spacing } from '../constants/spacing';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function ProgressScreen({ navigation }) {
  const [streak, setStreak] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [weekDays, setWeekDays] = useState([]);

  const load = useCallback(async () => {
    const s = await getStreak();
    const t = await getTotalTasksCompleted();
    const active = await getDaysActiveThisWeek();
    const today = getTodayDateStr();
    const weekStart = getWeekStart(today);
    const start = new Date(weekStart + 'T12:00:00');
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      days.push({ date: dStr, active: Array.isArray(active) && active.includes(dStr) });
    }
    setStreak(s);
    setTotalTasks(t);
    setWeekDays(days);
  }, []);

  React.useEffect(() => {
    load();
    const sub = navigation?.addListener?.('focus', load);
    return () => sub?.();
  }, [load, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      <View style={styles.card}>
        <Text style={styles.cardValue}>{streak}</Text>
        <Text style={styles.cardLabel}>Current streak (days)</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardValue}>{totalTasks}</Text>
        <Text style={styles.cardLabel}>Total tasks completed</Text>
      </View>
      <Text style={styles.sectionTitle}>Days active this week</Text>
      <View style={styles.weekRow}>
        {weekDays.map((day, i) => (
          <View key={day.date} style={styles.dayCell}>
            <View style={[styles.dayCircle, day.active && styles.dayCircleFilled]} />
            <Text style={styles.dayLabel}>{WEEKDAYS[i]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Weekly summary</Text>
        <Text style={styles.summaryText}>
          You've completed {totalTasks} tasks total. Keep going to build your personal brand.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.monetizationButton}
        onPress={() => navigation.navigate('Monetization')}
      >
        <Text style={styles.monetizationButtonText}>Monetization Hub</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { fontSize: fontSizes.headline, fontWeight: '600', color: colors.text, marginBottom: spacing.lg },
  card: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardValue: { fontSize: 28, fontWeight: '700', color: colors.accent },
  cardLabel: { fontSize: fontSizes.small, color: colors.muted, marginTop: spacing.xs },
  sectionTitle: { fontSize: fontSizes.large, fontWeight: '600', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  dayCell: { alignItems: 'center' },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey,
    marginBottom: spacing.xs,
  },
  dayCircleFilled: { backgroundColor: colors.accent },
  dayLabel: { fontSize: fontSizes.small, color: colors.muted },
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryTitle: { fontSize: fontSizes.large, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  summaryText: { fontSize: fontSizes.body, color: colors.muted, lineHeight: 22 },
  monetizationButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  monetizationButtonText: { color: '#FFFFFF', fontSize: fontSizes.body, fontWeight: '600' },
});
