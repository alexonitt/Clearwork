import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';

const SIZE = 160;
const STROKE = 12;

export function ScoreRing({ score = 0, label = 'Your Brand Score', animate = true }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const numAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) {
      scaleAnim.setValue(1);
      numAnim.setValue(score);
      return;
    }
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(numAnim, {
        toValue: score,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [score, animate]);

  const [displayScore, setDisplayScore] = React.useState(0);
  useEffect(() => {
    const id = numAnim.addListener(({ value }) => setDisplayScore(Math.round(value)));
    return () => numAnim.removeListener(id);
  }, [numAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.ringWrapper}>
        <View style={styles.ringBg} />
        <Animated.View style={[styles.ring, { transform: [{ scale: scaleAnim }] }]} />
        <View style={styles.center}>
          <Text style={styles.score}>{displayScore}</Text>
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  ringWrapper: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBg: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: STROKE,
    borderColor: colors.cardElevated,
  },
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: STROKE,
    borderColor: colors.accent,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.text,
  },
  label: {
    marginTop: 12,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
