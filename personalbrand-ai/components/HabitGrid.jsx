import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const COLS = 7;
const ROWS = 4;
const CELL_SIZE = 10;
const GAP = 4;

export function HabitGrid({ completedDates = [], label = 'Your consistency' }) {
  const days = getLast28Days();
  const set = new Set(completedDates);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.grid}>
        {Array.from({ length: ROWS }).map((_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: COLS }).map((_, col) => {
              const idx = row * COLS + col;
              const dateStr = days[idx];
              const filled = dateStr && set.has(dateStr);
              return (
                <View
                  key={idx}
                  style={[
                    styles.cell,
                    filled ? styles.filled : styles.empty,
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

function getLast28Days() {
  const out = [];
  const d = new Date();
  for (let i = 27; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(x.getDate() - i);
    out.push(x.toISOString().split('T')[0]);
  }
  return out;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    marginBottom: GAP,
    gap: GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
  },
  filled: {
    backgroundColor: colors.habitFill,
  },
  empty: {
    backgroundColor: colors.habitEmpty,
  },
});
