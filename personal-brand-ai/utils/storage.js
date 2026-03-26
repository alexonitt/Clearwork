import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ONBOARDING_COMPLETE: '@personalbrand/onboarding_complete',
  USER_PROFILE: '@personalbrand/user_profile',
  BRAND_IDENTITY: '@personalbrand/brand_identity',
  STREAK: '@personalbrand/streak',
  LAST_OPEN_DATE: '@personalbrand/last_open_date',
  COMPLETED_TASKS: '@personalbrand/completed_tasks',
  TOTAL_TASKS_COMPLETED: '@personalbrand/total_tasks_completed',
  DAYS_ACTIVE_THIS_WEEK: '@personalbrand/days_active_this_week',
  USER_NAME: '@personalbrand/user_name',
};

export async function getOnboardingComplete() {
  const value = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
  return value === 'true';
}

export async function setOnboardingComplete(value) {
  await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, value ? 'true' : 'false');
}

export async function getUserProfile() {
  const json = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  return json ? JSON.parse(json) : null;
}

export async function setUserProfile(profile) {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
}

export async function getBrandIdentity() {
  const json = await AsyncStorage.getItem(KEYS.BRAND_IDENTITY);
  return json ? JSON.parse(json) : null;
}

export async function setBrandIdentity(identity) {
  await AsyncStorage.setItem(KEYS.BRAND_IDENTITY, JSON.stringify(identity));
}

export async function getStreak() {
  const value = await AsyncStorage.getItem(KEYS.STREAK);
  return value != null ? parseInt(value, 10) : 0;
}

export async function setStreak(value) {
  await AsyncStorage.setItem(KEYS.STREAK, String(value));
}

export async function getLastOpenDate() {
  return await AsyncStorage.getItem(KEYS.LAST_OPEN_DATE);
}

export async function setLastOpenDate(dateStr) {
  await AsyncStorage.setItem(KEYS.LAST_OPEN_DATE, dateStr);
}

export async function getCompletedTasks() {
  const json = await AsyncStorage.getItem(KEYS.COMPLETED_TASKS);
  return json ? JSON.parse(json) : [];
}

export async function setCompletedTasks(taskIds) {
  await AsyncStorage.setItem(KEYS.COMPLETED_TASKS, JSON.stringify(taskIds));
}

export async function getTotalTasksCompleted() {
  const value = await AsyncStorage.getItem(KEYS.TOTAL_TASKS_COMPLETED);
  return value != null ? parseInt(value, 10) : 0;
}

export async function setTotalTasksCompleted(value) {
  await AsyncStorage.setItem(KEYS.TOTAL_TASKS_COMPLETED, String(value));
}

export async function getDaysActiveThisWeek() {
  const json = await AsyncStorage.getItem(KEYS.DAYS_ACTIVE_THIS_WEEK);
  return json ? JSON.parse(json) : [];
}

export async function setDaysActiveThisWeek(dates) {
  await AsyncStorage.setItem(KEYS.DAYS_ACTIVE_THIS_WEEK, JSON.stringify(dates));
}

const COMPLETED_TASK_DATES = '@personalbrand/completed_task_dates';

export async function getCompletedTaskDates() {
  const json = await AsyncStorage.getItem(COMPLETED_TASK_DATES);
  return json ? JSON.parse(json) : [];
}

export async function addCompletedTaskDate(dateStr) {
  const dates = await getCompletedTaskDates();
  if (!dates.includes(dateStr)) {
    dates.push(dateStr);
    await AsyncStorage.setItem(COMPLETED_TASK_DATES, JSON.stringify(dates));
  }
}

export async function getUserName() {
  return await AsyncStorage.getItem(KEYS.USER_NAME);
}

export async function setUserName(name) {
  if (name) await AsyncStorage.setItem(KEYS.USER_NAME, name);
}

export function getTodayDateStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getWeekStart(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday.toISOString().split('T')[0];
}
