import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { Button } from '../../components/Button';

// Minimal iOS-style wheel using native Picker (works on both iOS/Android via platform select)
import { Picker } from '@react-native-picker/picker';

export default function AgeScreen() {
  const router = useRouter();
  const { niche, platforms, goal } = useLocalSearchParams();
  const [age, setAge] = React.useState(18);

  const ages = React.useMemo(() => Array.from({ length: 60 - 13 + 1 }, (_, i) => 13 + i), []);

  return (
    <View style={styles.screen}>
      <Text style={styles.question}>How old are you?</Text>

      <View style={styles.wheelWrap}>
        <Picker
          selectedValue={age}
          onValueChange={(v) => setAge(v)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {ages.map((a) => (
            <Picker.Item key={a} label={String(a)} value={a} />
          ))}
        </Picker>
      </View>

      <View style={styles.bottom}>
        <Button
          title="Confirm"
          variant="primary"
          onPress={() =>
            router.push({
              pathname: '/onboarding/PostingFrequencyScreen',
              params: { niche, platforms, goal, age: String(age) },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 56,
  },
  question: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  wheelWrap: {
    marginTop: 18,
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
  },
  picker: {
    height: 220,
  },
  pickerItem: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
});

