import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { colors } from '../../constants/colors';

function TabIcon({ focused, label }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          marginBottom: 6,
          backgroundColor: focused ? colors.accent : 'transparent',
        }}
      />
      <View
        style={{
          width: 34,
          height: 20,
          borderRadius: 10,
          backgroundColor: focused ? colors.cardElevated : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View>
          {/* minimalist "icon" with letters to keep it premium/clean */}
        </View>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.card,
          height: 78,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="H" />,
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: 'Analyze',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="A" />,
        }}
      />
      <Tabs.Screen
        name="ideas"
        options={{
          title: 'Ideas',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="I" />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="P" />,
        }}
      />
    </Tabs>
  );
}

