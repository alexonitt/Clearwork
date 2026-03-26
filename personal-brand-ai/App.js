import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';

import { NicheScreen } from './app/onboarding/NicheScreen';
import { PlatformScreen } from './app/onboarding/PlatformScreen';
import { GoalScreen } from './app/onboarding/GoalScreen';
import { PostingFrequencyScreen } from './app/onboarding/PostingFrequencyScreen';
import { DescribeScreen } from './app/onboarding/DescribeScreen';
import { BrandIdentityResultScreen } from './app/onboarding/BrandIdentityResultScreen';

import { HomeScreen } from './app/HomeScreen';
import { BrandIdentityScreen } from './app/BrandIdentityScreen';
import { ContentIdeasScreen } from './app/ContentIdeasScreen';
import { ProgressScreen } from './app/ProgressScreen';
import { MonetizationScreen } from './app/MonetizationScreen';

import { colors } from './constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Niche" component={NicheScreen} />
      <Stack.Screen name="Platform" component={PlatformScreen} />
      <Stack.Screen name="Goal" component={GoalScreen} />
      <Stack.Screen name="PostingFrequency" component={PostingFrequencyScreen} />
      <Stack.Screen name="Describe" component={DescribeScreen} />
      <Stack.Screen name="BrandIdentityResult" component={BrandIdentityResultScreen} />
    </Stack.Navigator>
  );
}

function ProgressStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ProgressHome" component={ProgressScreen} />
      <Stack.Screen name="Monetization" component={MonetizationScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.cardBorder },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Brand" component={BrandIdentityScreen} options={{ tabBarLabel: 'Brand' }} />
      <Tab.Screen name="Ideas" component={ContentIdeasScreen} options={{ tabBarLabel: 'Ideas' }} />
      <Tab.Screen name="Progress" component={ProgressStack} options={{ tabBarLabel: 'Progress' }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { onboardingComplete } = useOnboarding();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {onboardingComplete ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <OnboardingProvider>
        <AppContent />
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return <RootNavigator />;
}

