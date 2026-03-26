import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { colors } from '../constants/colors';

export function FloatingChatButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.btn}>
      <View style={styles.inner}>
        <Text style={styles.icon}>💬</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 18,
    bottom: 96,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.background,
    shadowColor: colors.accent,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  inner: {
    flex: 1,
    borderRadius: 29,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors.text,
    fontSize: 20,
  },
});

