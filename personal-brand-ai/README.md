# PersonalBrand.ai

A React Native (Expo) mobile app that acts as an AI personal brand mentor. Users go through three stages: building their brand, growing it, and monetizing it. AI is powered by the Google Gemini API (gemini-2.0-flash).

## Setup

1. **Install dependencies**
   ```bash
   cd personal-brand-ai && npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - Add your Google Gemini API key: `EXPO_PUBLIC_GEMINI_API_KEY=your_key_here`

3. **Assets (optional for dev)**
   - For a full build, add `assets/icon.png` (1024×1024) and `assets/splash-icon.png` for app icon and splash screen. You can use placeholder images until you have final assets.

4. **Run**
   ```bash
   npx expo start
   ```
   Then press `i` for iOS simulator or scan the QR code with Expo Go.

   If you see a Node error about "Stripping types" in node_modules, use Node 20 LTS (e.g. `nvm use 20`) — Node 22+ can trigger this with some Expo packages.

## Features

- **Onboarding**: 5 questions (niche, platform, goal, posting frequency, one-sentence description). Gemini generates a Brand Identity Card (positioning, 3 content pillars, 5-item profile checklist).
- **Home**: Greeting, streak (increments when you open the app and complete at least one task that day), daily motivation and 3–5 tasks from Gemini. Tasks reset at midnight; streak saved with AsyncStorage.
- **Brand Identity**: View and regenerate your Brand Identity Card.
- **Content Ideas**: “Generate 3 Post Ideas” returns topic, hook, caption outline, and best time to post; copy caption to clipboard.
- **Monetization Hub**: Locked until 30 days completed (days with at least one task done). Then 4 expandable methods (Affiliate, Brand Deals, Digital Products, Services) with Gemini-generated action plans.
- **Progress**: Streak, total tasks completed, 7-day activity circles, weekly summary, and link to Monetization Hub.

## Tech stack

- React Native with Expo
- Google Gemini API (`gemini-2.0-flash`)
- AsyncStorage
- React Navigation (stack + bottom tabs)
- No backend for MVP

## Publishing to the iOS App Store

Use EAS Build and Submit:

```bash
npm install -g eas-cli
eas login
eas build --platform ios --profile production
eas submit --platform ios --latest
```

Configure `app.json` / `eas.json` with your Apple Developer account and bundle ID (`ai.personalbrand.app`).
