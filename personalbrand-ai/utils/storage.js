import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@personalbrand/';

export async function getOnboardingComplete() {
  const v = await AsyncStorage.getItem(`${PREFIX}onboarding_complete`);
  return v === 'true';
}

export async function setOnboardingComplete(value) {
  await AsyncStorage.setItem(`${PREFIX}onboarding_complete`, value ? 'true' : 'false');
}

export async function getUserProfile() {
  const json = await AsyncStorage.getItem(`${PREFIX}user_profile`);
  return json ? JSON.parse(json) : null;
}

export async function setUserProfile(profile) {
  await AsyncStorage.setItem(`${PREFIX}user_profile`, JSON.stringify(profile));
}

export async function getBrandIdentity() {
  const json = await AsyncStorage.getItem(`${PREFIX}brand_identity`);
  return json ? JSON.parse(json) : null;
}

export async function setBrandIdentity(identity) {
  await AsyncStorage.setItem(`${PREFIX}brand_identity`, JSON.stringify(identity));
}

export async function getStreak() {
  const v = await AsyncStorage.getItem(`${PREFIX}streak`);
  return v != null ? parseInt(v, 10) : 0;
}

export async function setStreak(value) {
  await AsyncStorage.setItem(`${PREFIX}streak`, String(value));
}

export async function getLastOpenDate() {
  return await AsyncStorage.getItem(`${PREFIX}last_open_date`);
}

export async function setLastOpenDate(dateStr) {
  await AsyncStorage.setItem(`${PREFIX}last_open_date`, dateStr);
}

/** Array of date strings (YYYY-MM-DD) when user completed at least one mission */
export async function getCompletedMissionDates() {
  const json = await AsyncStorage.getItem(`${PREFIX}completed_mission_dates`);
  return json ? JSON.parse(json) : [];
}

export async function addCompletedMissionDate(dateStr) {
  const dates = await getCompletedMissionDates();
  if (!dates.includes(dateStr)) {
    dates.push(dateStr);
    await AsyncStorage.setItem(`${PREFIX}completed_mission_dates`, JSON.stringify(dates));
  }
}

/** Missions for today; keyed by date YYYY-MM-DD */
export async function getDailyMissions(dateStr) {
  const json = await AsyncStorage.getItem(`${PREFIX}daily_missions_${dateStr}`);
  return json ? JSON.parse(json) : null;
}

export async function setDailyMissions(dateStr, missions) {
  await AsyncStorage.setItem(`${PREFIX}daily_missions_${dateStr}`, JSON.stringify(missions));
}

/** Which mission indices (0,1,2) are completed today */
export async function getCompletedMissionIndices(dateStr) {
  const json = await AsyncStorage.getItem(`${PREFIX}completed_indices_${dateStr}`);
  return json ? JSON.parse(json) : [];
}

export async function setCompletedMissionIndices(dateStr, indices) {
  await AsyncStorage.setItem(`${PREFIX}completed_indices_${dateStr}`, JSON.stringify(indices));
}

export async function getMissionsCompletedThisWeek() {
  const v = await AsyncStorage.getItem(`${PREFIX}missions_this_week`);
  return v != null ? parseInt(v, 10) : 0;
}

export async function setMissionsCompletedThisWeek(value) {
  await AsyncStorage.setItem(`${PREFIX}missions_this_week`, String(value));
}

export async function getTotalDaysActive() {
  const v = await AsyncStorage.getItem(`${PREFIX}total_days_active`);
  return v != null ? parseInt(v, 10) : 0;
}

export async function setTotalDaysActive(value) {
  await AsyncStorage.setItem(`${PREFIX}total_days_active`, String(value));
}

export function getTodayDateStr() {
  return new Date().toISOString().split('T')[0];
}

export function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday.toISOString().split('T')[0];
}

/** Last 4 weeks of daily activity: array of 28 date strings (YYYY-MM-DD) where we have completion */
export async function getHabitGridDates() {
  const json = await AsyncStorage.getItem(`${PREFIX}habit_grid_dates`);
  return json ? JSON.parse(json) : [];
}

export async function setHabitGridDates(dates) {
  await AsyncStorage.setItem(`${PREFIX}habit_grid_dates`, JSON.stringify(dates));
}
