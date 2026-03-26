const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-2.0-flash';
const MAX_OUTPUT_TOKENS = 1000;

function getApiKey() {
  return process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
}

async function callGemini(systemPrompt, userMessage) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY in .env');

  const url = `${API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return text.trim();
}

export async function generateBrandIdentity(niche, platforms, goal, age, activityLevel) {
  const systemPrompt = `You are a personal brand mentor. From the user's answers, create their Brand Identity. Use simple everyday language, no jargon. Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "positioning": "One sentence positioning statement.",
  "pillars": ["Content pillar 1", "Content pillar 2", "Content pillar 3"],
  "profileChecklist": ["Checklist item 1", "Checklist item 2", "Checklist item 3", "Checklist item 4", "Checklist item 5"]
}`;
  const userMessage = `Niche: ${niche}. Platforms: ${platforms.join(', ')}. Goal: ${goal}. Age: ${age}. Activity: ${activityLevel}.`;
  const text = await callGemini(systemPrompt, userMessage);
  const cleaned = text.replace(/```json?|```/g, '').trim();
  return JSON.parse(cleaned);
}

export async function generateDailyMotivation(niche) {
  const systemPrompt = `You are a personal brand mentor. Return one short punchy motivational line under 15 words for someone in the ${niche} space. No quotes, no attribution.`;
  return await callGemini(systemPrompt, `Niche: ${niche}`);
}

export async function generateDailyMissions(niche, platforms) {
  const systemPrompt = `You are a personal brand mentor. Return exactly 3 daily missions. Each mission has "title" (short action) and "reason" (one sentence why it matters). Use simple language. Return ONLY valid JSON array:
[{"title": "...", "reason": "..."}, {"title": "...", "reason": "..."}, {"title": "...", "reason": "..."}]`;
  const userMessage = `Niche: ${niche}. Platforms: ${platforms.join(', ')}.`;
  const text = await callGemini(systemPrompt, userMessage);
  const cleaned = text.replace(/```json?|```/g, '').trim();
  const arr = JSON.parse(cleaned);
  return Array.isArray(arr) ? arr.slice(0, 3) : [];
}

export async function generatePostIdeas(niche, platforms) {
  const systemPrompt = `You are a personal brand mentor. Return exactly 3 post ideas. Each has "hook" (attention-grabbing opening line), "caption" (short outline or bullet points), and "platform" (one of: ${(platforms || ['Instagram']).join(', ')}). Use simple language. Return ONLY valid JSON array:
[{"hook": "...", "caption": "...", "platform": "..."}, ...]`;
  const userMessage = `Niche: ${niche}. Platforms: ${(platforms || []).join(', ')}.`;
  const text = await callGemini(systemPrompt, userMessage);
  const cleaned = text.replace(/```json?|```/g, '').trim();
  const arr = JSON.parse(cleaned);
  return Array.isArray(arr) ? arr.slice(0, 3) : [];
}

export async function analyzeProfile(platform, input, inputType) {
  const systemPrompt = `You are a personal brand analyst. Analyze the profile and return ONLY valid JSON (no markdown):
{
  "score": 0-100,
  "profileSetup": 0-100,
  "contentQuality": 0-100,
  "postingConsistency": 0-100,
  "audienceClarity": 0-100,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "actionSteps": ["step 1", "step 2", "step 3"],
  "bioSuggestion": "Improved bio text here."
}
Use simple beginner language.`;
  const userMessage = `Platform: ${platform}. Input type: ${inputType}. Content: ${input}`;
  const text = await callGemini(systemPrompt, userMessage);
  const cleaned = text.replace(/```json?|```/g, '').trim();
  return JSON.parse(cleaned);
}

export async function generateBioRewrite(currentBio, niche, goal) {
  const systemPrompt = `You are a personal brand mentor. Rewrite this bio to be stronger and clearer. Keep it short. Return only the new bio text, nothing else.`;
  const userMessage = `Current bio: ${currentBio}. Niche: ${niche}. Goal: ${goal}.`;
  return await callGemini(systemPrompt, userMessage);
}

export async function generateMonetizationPlan(niche, method) {
  const systemPrompt = `You are a personal brand mentor. Give a step-by-step guide for "${method}" tailored to someone in the ${niche} space. Use simple beginner language. Return a JSON array of strings: ["Step 1...", "Step 2...", ...]`;
  const text = await callGemini(systemPrompt, `Niche: ${niche}. Method: ${method}.`);
  const cleaned = text.replace(/```json?|```/g, '').trim();
  try {
    const arr = JSON.parse(cleaned);
    return Array.isArray(arr) ? arr : [cleaned];
  } catch {
    return text.split(/\n/).map((s) => s.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
  }
}

export async function chatWithMentor(niche, goal, message, history) {
  const systemPrompt = `You are a friendly personal brand coach. The user's niche is ${niche} and goal is ${goal}. Reply in short, simple sentences like texting. Be supportive and actionable. Keep responses under 3 sentences.`;
  const historyText = (history || []).slice(-6).map((m) => `${m.role}: ${m.content}`).join('\n');
  const userMessage = historyText ? `${historyText}\nuser: ${message}` : message;
  return await callGemini(systemPrompt, userMessage);
}
