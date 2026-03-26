const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-2.0-flash';
const MAX_OUTPUT_TOKENS = 1000;

function getApiKey() {
  return process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
}

function getDevFallback(systemPrompt, userMessage) {
  const lower = `${systemPrompt}\n${userMessage}`.toLowerCase();

  if (lower.includes('brand identity card') || lower.includes('positioning:')) {
    return `POSITIONING:
Build a clear, trustworthy personal brand by sharing practical wins in your niche.

CONTENT PILLARS:
1. Quick wins and tutorials you can apply today
2. Behind-the-scenes: process, tools, and lessons learned
3. Proof and credibility: results, case studies, and mistakes avoided

PROFILE CHECKLIST:
1. Use a niche + outcome headline in your bio
2. Add a clear CTA (follow, DM, link) and what to expect
3. Pin 3 posts that show value, proof, and your story
4. Update profile photo/banner for clarity and consistency
5. Add highlights/featured posts that answer FAQs`;
  }

  if (lower.includes('motivational') || lower.includes('motivational sentence')) {
    return 'Consistency beats intensity—show up today and ship something small.';
  }

  if (lower.includes('daily tasks') && lower.includes('numbered list')) {
    return `1. Draft one post idea and outline it in 5 bullets
2. Engage: leave 5 thoughtful comments on niche accounts
3. Improve your profile: update one line to clarify who you help`;
  }

  if (lower.includes('post ideas') && lower.includes('idea 1')) {
    return `IDEA 1
TOPIC: The “one mistake” beginners make in your niche
HOOK: If you’re struggling with results, this is probably why.
CAPTION:
- What the mistake is
- Why it happens
- The fix (3 steps)
BEST TIME: Weekday mornings

IDEA 2
TOPIC: My simple framework for consistent progress
HOOK: Here’s the checklist I wish I had when I started.
CAPTION:
- Step 1: define the outcome
- Step 2: pick the smallest habit
- Step 3: review weekly
BEST TIME: Sunday afternoon

IDEA 3
TOPIC: A quick win you can do in 10 minutes
HOOK: Do this today and you’ll feel momentum immediately.
CAPTION:
- The 10-minute action
- Common pitfall to avoid
- How to level it up
BEST TIME: Weekday evenings`;
  }

  if (lower.includes('monetization') && lower.includes('numbered list')) {
    return `1. Pick one offer (service/product) tied to your strongest content pillar
2. Validate it: ask 10 followers what they struggle with
3. Create a simple landing page or DM script with one clear CTA
4. Publish 3 proof-building posts (before/after, process, results)
5. Reach out to 10 warm leads with a short, specific pitch
6. Deliver, collect testimonials, and refine pricing/positioning`;
  }

  return '1. Share one helpful tip.\n2. Engage with your niche.\n3. Improve one part of your profile.';
}

export async function callGemini(systemPrompt, userMessage) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return getDevFallback(systemPrompt, userMessage);
  }

  const url = `${API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`;
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
    });
  } catch (e) {
    return getDevFallback(systemPrompt, userMessage);
  }

  if (!response.ok) {
    return getDevFallback(systemPrompt, userMessage);
  }

  try {
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const trimmed = text.trim();
    return trimmed ? trimmed : getDevFallback(systemPrompt, userMessage);
  } catch {
    return getDevFallback(systemPrompt, userMessage);
  }
}

export async function generateBrandIdentity(profile) {
  const systemPrompt = `You are a personal brand mentor. Based on the user's answers, generate their Brand Identity Card. Include:
1. A one sentence positioning statement.
2. Three content pillars they should post about.
3. A profile checklist with 5 items to optimize their profile.

Format your response as follows (use these exact labels):
POSITIONING:
[one sentence]

CONTENT PILLARS:
1. [pillar one]
2. [pillar two]
3. [pillar three]

PROFILE CHECKLIST:
1. [item one]
2. [item two]
3. [item three]
4. [item four]
5. [item five]`;

  const userMessage = `Niche: ${profile.niche}
Platform: ${profile.platform}
Goal: ${profile.goal}
Posting frequency: ${profile.postingFrequency}
About them: ${profile.about}`;

  const text = await callGemini(systemPrompt, userMessage);
  return parseBrandIdentityResponse(text);
}

function parseBrandIdentityResponse(text) {
  const positioning = text.match(/POSITIONING:\s*([\s\S]*?)(?=CONTENT PILLARS:|$)/)?.[1]?.trim() ?? '';
  const pillarsMatch = text.match(/CONTENT PILLARS:([\s\S]*?)(?=PROFILE CHECKLIST:|$)/)?.[1]?.trim() ?? '';
  const checklistMatch = text.match(/PROFILE CHECKLIST:([\s\S]*?)$/)?.[1]?.trim() ?? '';

  const pillars = pillarsMatch.split(/\d+\./).map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const checklist = checklistMatch.split(/\d+\./).map((s) => s.trim()).filter(Boolean).slice(0, 5);

  return { positioning, pillars, checklist, raw: text };
}

export async function generateDailyMotivation(profile) {
  const systemPrompt = `You are a personal brand mentor. Generate a single short, motivational sentence (under 15 words) to inspire the user for the day. Reference their niche or goal if relevant. No quotes, no attribution.`;
  const userMessage = `Niche: ${profile.niche}, Platform: ${profile.platform}, Goal: ${profile.goal}.`;
  return await callGemini(systemPrompt, userMessage);
}

export async function generateDailyTasks(profile) {
  const systemPrompt = `You are a personal brand mentor. Generate 3 to 5 specific, actionable daily tasks for the user. Each task should be one short sentence, suitable for a checkbox. Base tasks on their niche and platform. Examples: "Post a 30 second video explaining one thing you know", "Leave 5 comments on accounts in your niche". Return ONLY a numbered list, one task per line, no other text.`;
  const userMessage = `Niche: ${profile.niche}, Platform: ${profile.platform}, Goal: ${profile.goal}.`;
  const text = await callGemini(systemPrompt, userMessage);
  const tasks = text.split(/\n/).map((line) => line.replace(/^\d+\.\s*/, '').trim()).filter(Boolean).slice(0, 5);
  return tasks.map((title, i) => ({ id: `task-${Date.now()}-${i}`, title }));
}

export async function regenerateBrandIdentity(profile, currentIdentity) {
  const systemPrompt = `You are a personal brand mentor. The user wants to regenerate their Brand Identity Card. Based on their profile and optionally their current identity, generate a fresh Brand Identity Card. Include:
1. A one sentence positioning statement.
2. Three content pillars they should post about.
3. A profile checklist with 5 items to optimize their profile.

Format your response as follows (use these exact labels):
POSITIONING:
[one sentence]

CONTENT PILLARS:
1. [pillar one]
2. [pillar two]
3. [pillar three]

PROFILE CHECKLIST:
1. [item one]
2. [item two]
3. [item three]
4. [item four]
5. [item five]`;

  const userMessage = `Niche: ${profile.niche}, Platform: ${profile.platform}, Goal: ${profile.goal}, Posting: ${profile.postingFrequency}, About: ${profile.about}.${currentIdentity ? ` Current positioning: ${currentIdentity.positioning}` : ''}`;
  const text = await callGemini(systemPrompt, userMessage);
  return parseBrandIdentityResponse(text);
}

export async function generatePostIdeas(profile) {
  const systemPrompt = `You are a personal brand mentor. Generate exactly 3 post ideas for the user. For each idea provide:
- Post topic (short title)
- Hook (opening line that grabs attention)
- Caption outline (2-4 bullet points for the caption)
- Best time to post (e.g. "Tuesday 9am" or "Weekday mornings")

Format your response as follows for each idea (use these exact labels for each of the 3 ideas):
IDEA 1
TOPIC: [topic]
HOOK: [hook]
CAPTION: [bullet points]
BEST TIME: [time]

IDEA 2
...

IDEA 3
...`;

  const userMessage = `Niche: ${profile.niche}, Platform: ${profile.platform}.`;
  const text = await callGemini(systemPrompt, userMessage);
  return parsePostIdeasResponse(text);
}

function parsePostIdeasResponse(text) {
  const ideas = [];
  const blocks = text.split(/(?=IDEA \d+)/i).filter(Boolean);
  for (const block of blocks) {
    const topic = block.match(/TOPIC:\s*([^\n]+)/)?.[1]?.trim() ?? '';
    const hook = block.match(/HOOK:\s*([^\n]+)/)?.[1]?.trim() ?? '';
    const caption = block.match(/CAPTION:\s*([\s\S]*?)(?=BEST TIME:|$)/)?.[1]?.trim() ?? '';
    const bestTime = block.match(/BEST TIME:\s*([^\n]+)/)?.[1]?.trim() ?? '';
    if (topic) ideas.push({ topic, hook, caption, bestTime });
  }
  return ideas.slice(0, 3);
}

export async function generateMonetizationPlan(profile, method) {
  const systemPrompt = `You are a personal brand mentor specializing in monetization. The user wants a step-by-step action plan for: ${method}. Generate 5-7 concrete steps they can take, tailored to their niche and platform. Return a numbered list only, one step per line.`;
  const userMessage = `Niche: ${profile.niche}, Platform: ${profile.platform}, Goal: ${profile.goal}.`;
  const text = await callGemini(systemPrompt, userMessage);
  return text.split(/\n/).map((line) => line.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
}
