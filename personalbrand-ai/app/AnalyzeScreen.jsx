import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../constants/colors';
import { Button } from '../components/Button';
import { ScoreRing } from '../components/ScoreRing';
import { ChatSheet } from '../components/ChatSheet';
import { FloatingChatButton } from '../components/FloatingChatButton';
import { analyzeProfile, generateBioRewrite } from '../utils/gemini';
import { getUserProfile } from '../utils/storage';

const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'Snapchat'];

export default function AnalyzeScreen() {
  const [profile, setProfile] = React.useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState(null);
  const [inputType, setInputType] = useState(null); // 'link' | 'screenshot'
  const [link, setLink] = useState('');
  const [shotUri, setShotUri] = useState('');
  const [shotDesc, setShotDesc] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [bioModal, setBioModal] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [bio, setBio] = useState('');

  React.useEffect(() => {
    (async () => {
      const p = await getUserProfile();
      setProfile(p);
    })();
  }, []);

  const canSubmit =
    platform &&
    inputType &&
    (inputType === 'link' ? link.trim().length > 8 : shotUri && shotDesc.trim().length >= 8);

  const bars = useMemo(() => {
    if (!result) return [];
    return [
      { label: 'Profile Setup', value: result.profileSetup },
      { label: 'Content Quality', value: result.contentQuality },
      { label: 'Posting Consistency', value: result.postingConsistency },
      { label: 'Audience Clarity', value: result.audienceClarity },
    ];
  }, [result]);

  const pickScreenshot = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (res.canceled) return;
    setShotUri(res.assets?.[0]?.uri || '');
  };

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);
    try {
      const input =
        inputType === 'link'
          ? link.trim()
          : `Screenshot URI: ${shotUri}\nDescription: ${shotDesc.trim()}`;
      const r = await analyzeProfile(platform, input, inputType);
      setResult(r);
      setStep(3);
    } catch (e) {
      setResult({
        score: 0,
        profileSetup: 0,
        contentQuality: 0,
        postingConsistency: 0,
        audienceClarity: 0,
        strengths: ['Could not analyze right now'],
        improvements: ['Try again in a moment'],
        actionSteps: ['Double-check your input', 'Try a different platform', 'Try again'],
        bioSuggestion: '',
      });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const rewriteBio = async () => {
    setBioModal(true);
    setBioLoading(true);
    try {
      const current = result?.bioSuggestion || '';
      const improved = await generateBioRewrite(current, profile?.niche || 'personal brand', profile?.goal || 'grow');
      setBio(improved);
    } catch {
      setBio('Could not rewrite right now. Try again.');
    } finally {
      setBioLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingTop: 56, paddingHorizontal: 18, paddingBottom: 140 }}>
        <Text style={styles.h1}>Analyze Your Brand</Text>

        {step < 3 && (
          <View style={styles.heroCard}>
            <Button
              title="Scan My Profile"
              variant="accent"
              onPress={() => setStep(1)}
              style={{ marginTop: 4 }}
            />
            <Text style={styles.heroSub}>Two quick steps. Then you’ll get a score + fixes.</Text>
          </View>
        )}

        {step === 1 && (
          <View style={{ marginTop: 18 }}>
            <Text style={styles.stepTitle}>Step 1 — Choose platform</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
              {PLATFORMS.map((p) => {
                const active = platform === p;
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => {
                      setPlatform(p);
                      setStep(2);
                    }}
                    activeOpacity={0.85}
                    style={[styles.choice, active && styles.choiceActive]}
                  >
                    <Text style={styles.choiceText}>{p}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={{ marginTop: 18 }}>
            <Text style={styles.stepTitle}>Step 2 — Choose input</Text>

            <TouchableOpacity
              style={[styles.optionCard, inputType === 'link' && styles.choiceActive]}
              onPress={() => setInputType('link')}
              activeOpacity={0.85}
            >
              <Text style={styles.optionTitle}>Paste Profile Link</Text>
              {inputType === 'link' && (
                <TextInput
                  value={link}
                  onChangeText={setLink}
                  placeholder="https://..."
                  placeholderTextColor={colors.textSecondary}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, inputType === 'screenshot' && styles.choiceActive]}
              onPress={() => setInputType('screenshot')}
              activeOpacity={0.85}
            >
              <Text style={styles.optionTitle}>Upload Screenshot</Text>
              {inputType === 'screenshot' && (
                <View style={{ marginTop: 12, gap: 10 }}>
                  <Button title={shotUri ? 'Change screenshot' : 'Pick from camera roll'} variant="primary" onPress={pickScreenshot} />
                  <TextInput
                    value={shotDesc}
                    onChangeText={setShotDesc}
                    placeholder="Quickly describe what’s in the screenshot..."
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { minHeight: 56 }]}
                    multiline
                  />
                </View>
              )}
            </TouchableOpacity>

            <View style={{ marginTop: 14 }}>
              <Button title="Submit" variant="accent" disabled={!canSubmit || loading} loading={loading} onPress={submit} />
              {loading && <Text style={styles.loadingText}>AI is analyzing your profile...</Text>}
            </View>
          </View>
        )}

        {step === 3 && result && (
          <View style={{ marginTop: 10 }}>
            <ScoreRing score={Number(result.score || 0)} label="Your Brand Score" />

            <View style={{ marginTop: 6, gap: 12 }}>
              {bars.map((b) => (
                <View key={b.label} style={styles.barRow}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.barLabel}>{b.label}</Text>
                    <Text style={styles.barValue}>{Number(b.value || 0)}</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${Math.min(100, Math.max(0, Number(b.value || 0)))}%` }]} />
                  </View>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 18, gap: 12 }}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>What is working</Text>
                {(result.strengths || []).slice(0, 3).map((s) => (
                  <View key={s} style={styles.bulletRow}>
                    <View style={[styles.dot, { backgroundColor: colors.success }]} />
                    <Text style={styles.bulletText}>{s}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>What to improve</Text>
                {(result.improvements || []).slice(0, 3).map((s) => (
                  <View key={s} style={styles.bulletRow}>
                    <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                    <Text style={styles.bulletText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 18 }}>
              <Text style={styles.stepTitle}>Top 3 action steps</Text>
              <View style={{ marginTop: 12, gap: 12 }}>
                {(result.actionSteps || []).slice(0, 3).map((s, idx) => (
                  <View key={s} style={styles.numberCard}>
                    <Text style={styles.bigNum}>{idx + 1}</Text>
                    <Text style={styles.numberText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 18 }}>
              <Button title="Rewrite My Bio" variant="accent" onPress={rewriteBio} />
            </View>
          </View>
        )}
      </ScrollView>

      <FloatingChatButton onPress={() => setChatOpen(true)} />
      <ChatSheet visible={chatOpen} onClose={() => setChatOpen(false)} niche={profile?.niche} goal={profile?.goal} />

      <Modal visible={bioModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Bio rewrite</Text>
            {bioLoading ? (
              <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                <ActivityIndicator color={colors.accent} />
                <Text style={styles.loadingText}>Rewriting…</Text>
              </View>
            ) : (
              <Text style={styles.modalBio}>{bio}</Text>
            )}
            <View style={{ marginTop: 18 }}>
              <Button title="Close" variant="primary" onPress={() => setBioModal(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  h1: { color: colors.text, fontSize: 30, fontWeight: '900' },
  heroCard: {
    marginTop: 16,
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 18,
  },
  heroSub: {
    marginTop: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    lineHeight: 20,
  },
  stepTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  choice: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: '47%',
  },
  choiceActive: { borderColor: colors.accent },
  choiceText: { color: colors.text, fontSize: 15, fontWeight: '700' },
  optionCard: {
    marginTop: 12,
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  input: {
    marginTop: 12,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  loadingText: { marginTop: 10, color: colors.textSecondary, fontWeight: '600' },
  barRow: { backgroundColor: colors.cardElevated, borderRadius: 16, padding: 14 },
  barLabel: { color: colors.text, fontWeight: '700' },
  barValue: { color: colors.textSecondary, fontWeight: '800' },
  barTrack: {
    marginTop: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  barFill: { height: 10, borderRadius: 999, backgroundColor: colors.accent },
  card: { backgroundColor: colors.cardElevated, borderRadius: 16, padding: 16 },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 10 },
  bulletText: { color: colors.text, fontWeight: '600', flex: 1, lineHeight: 20 },
  numberCard: { backgroundColor: colors.cardElevated, borderRadius: 16, padding: 18, flexDirection: 'row', gap: 12 },
  bigNum: { color: colors.text, fontSize: 28, fontWeight: '900' },
  numberText: { color: colors.text, fontSize: 15, fontWeight: '700', flex: 1, lineHeight: 20, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18 },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  modalBio: { marginTop: 12, color: colors.text, fontSize: 15, fontWeight: '600', lineHeight: 22 },
});

