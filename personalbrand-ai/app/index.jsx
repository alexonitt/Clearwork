import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { colors } from '../constants/colors';
import { getOnboardingComplete } from '../utils/storage';

export default function Index() {
  const [ready, setReady] = React.useState(false);
  const [onboarded, setOnboarded] = React.useState(false);

  useEffect(() => {
    (async () => {
      try {
        const done = await getOnboardingComplete();
        setOnboarded(done);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (onboarded) return <Redirect href="/(tabs)/home" />;
  return <Redirect href="/onboarding/NicheScreen" />;
}

