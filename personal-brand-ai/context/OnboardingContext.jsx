import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { getOnboardingComplete } from '../utils/storage';
import { colors } from '../constants/colors';
import { fontSizes } from '../constants/fonts';
import { spacing } from '../constants/spacing';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const [onboardingComplete, setOnboardingComplete] = useState(null);

  useEffect(() => {
    getOnboardingComplete().then(setOnboardingComplete);
  }, []);

  const refresh = () => getOnboardingComplete().then(setOnboardingComplete);

  if (onboardingComplete === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <OnboardingContext.Provider value={{ onboardingComplete, setOnboardingComplete, refresh }}>
      {children}
    </OnboardingContext.Provider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: spacing.md, fontSize: fontSizes.body, color: colors.muted },
});

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
