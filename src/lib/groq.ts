// Groq API integration client for LearningOS Workspace

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "llama-3.3-70b-versatile";

export interface GroqTelemetry {
  latencyMs: number;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  finishReason: string;
}

export interface GroqRoadmapResult {
  domain: string;
  difficulty: number;
  durationWeeks: number;
  weeklyHours: number;
  successProbability: number;
  skills: string[];
  milestones: {
    week: number;
    title: string;
    tasks: string[];
  }[];
  telemetry: GroqTelemetry;
}

export interface GroqTutorResult {
  text: string;
  type: 'text' | 'quiz' | 'flashcard';
  quizContent?: { q: string; options: string[]; ansIdx: number }[];
  flashcardContent?: { term: string; definition: string }[];
  telemetry: GroqTelemetry;
}

// Fetch helper with API key retrieval
function getApiKey(): string | null {
  const envKey = import.meta.env.VITE_GROQ_API_KEY;
  if (envKey && envKey !== "gsk_xxxxxxxxxxxxxxxxx" && envKey.trim() !== "") {
    return envKey;
  }
  return null;
}

export function isApiKeyConfigured(): boolean {
  return getApiKey() !== null;
}

async function callGroq(prompt: string, jsonMode: boolean = true): Promise<{ content: string; telemetry: GroqTelemetry }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Groq API Key not configured in .env file");
  }

  const startTime = performance.now();

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: jsonMode ? { type: "json_object" } : undefined,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API returned error status ${response.status}: ${errText}`);
  }

  const endTime = performance.now();
  const latencyMs = Math.round(endTime - startTime);

  const resJson = await response.json();
  const content = resJson.choices[0]?.message?.content || "";
  const usage = resJson.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  const finishReason = resJson.choices[0]?.finish_reason || "stop";

  return {
    content,
    telemetry: {
      latencyMs,
      model: MODEL_NAME,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      finishReason
    }
  };
}

// 1. Generate Full Curriculum Roadmap
export async function generateAILearningRoadmap(goal: string): Promise<GroqRoadmapResult> {
  const prompt = `You are the LearningOS Agent Orchestrator. 
Your job is to parse the user's learning goal and generate a structured 3-week study roadmap in JSON format.

Goal: "${goal}"

Return ONLY a valid JSON object matching this schema:
{
  "domain": "string (broad category e.g. Cloud Computing, Frontend Development)",
  "difficulty": number (difficulty index from 1 to 10),
  "durationWeeks": number (suggested total timeline weeks),
  "weeklyHours": number (suggested study hours commitment per week),
  "successProbability": number (success percentage based on goal complexity),
  "skills": ["skill1", "skill2", "skill3", "skill4"],
  "milestones": [
    {
      "week": 1,
      "title": "string (Week 1 theme)",
      "tasks": ["task1", "task2", "task3"]
    },
    {
      "week": 2,
      "title": "string (Week 2 theme)",
      "tasks": ["task1", "task2", "task3"]
    },
    {
      "week": 3,
      "title": "string (Week 3 theme)",
      "tasks": ["task1", "task2", "task3"]
    }
  ]
}

Ensure all JSON properties are closed and valid. Return ONLY the JSON object. Do not include markdown wraps or explanations.`;

  const { content, telemetry } = await callGroq(prompt, true);
  const parsed = JSON.parse(content);

  return {
    domain: parsed.domain || "General Domain",
    difficulty: parsed.difficulty || 5,
    durationWeeks: parsed.durationWeeks || 12,
    weeklyHours: parsed.weeklyHours || 8,
    successProbability: parsed.successProbability || 80,
    skills: parsed.skills || ["Foundational concepts"],
    milestones: parsed.milestones || [],
    telemetry
  };
}

// 2. Query Tutor Chat / Execute Actions
export async function queryAITutor(actionName: string, activeGoal: string): Promise<GroqTutorResult> {
  const prompt = `You are the LearningOS Tutor Agent. Respond to the action request: "${actionName}" for a student currently learning "${activeGoal}".

Depending on the action request, format your output:

- If action is "Quiz Me", return a JSON object with 1 multiple choice question:
{
  "text": "Here is your check-in challenge:",
  "type": "quiz",
  "quizContent": [
    {
      "q": "question text",
      "options": ["A) opt1", "B) opt2", "C) opt3", "D) opt4"],
      "ansIdx": number (0-3 correct option index)
    }
  ]
}

- If action is "Flashcards", return a JSON object with 3 key definitions:
{
  "text": "Generated 3 flashcards for review:",
  "type": "flashcard",
  "flashcardContent": [
    { "term": "term1", "definition": "definition1" },
    { "term": "term2", "definition": "definition2" },
    { "term": "term3", "definition": "definition3" }
  ]
}

- For any other action (Explain, Summarize, Create Project, etc.), return a JSON object with text response:
{
  "text": "detailed markdown summary or explanation here",
  "type": "text"
}

Return ONLY valid JSON matching these formats. Do not wrap in markdown code blocks.`;

  const { content, telemetry } = await callGroq(prompt, true);
  const parsed = JSON.parse(content);

  return {
    text: parsed.text || "I've processed your query.",
    type: parsed.type || "text",
    quizContent: parsed.quizContent || undefined,
    flashcardContent: parsed.flashcardContent || undefined,
    telemetry
  };
}

// 3. Evaluate AI Skill Assessment
export interface GroqAssessmentResult {
  assessedLevel: string;
  strengths: string[];
  weaknesses: string[];
  learningStyle: string;
  estimatedWeeks: number;
  successProbability: number;
  roadmapRecommendation: string;
  telemetry: GroqTelemetry;
}

export async function evaluateSkillAssessment(
  name: string,
  style: string,
  goal: string,
  answer: string
): Promise<GroqAssessmentResult> {
  const prompt = `You are the LearningOS Skill Assessment Agent.
The user is onboarding with these parameters:
Name: ${name}
Preferred Style: ${style}
Goal: ${goal}
Assessment Challenge Question: "Explain variable scope in Python and write a simple example"
User Answer: "${answer}"

Evaluate the user's answer and profile details. Return a JSON object with:
{
  "assessedLevel": "Beginner" | "Intermediate" | "Advanced",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "learningStyle": "Projects" | "Video" | "Reading" | "Mixed",
  "estimatedWeeks": number (weeks to reach goal),
  "successProbability": number (success percentage),
  "roadmapRecommendation": "string (roadmaps name, e.g. AI Engineer, React Architect)"
}
Return ONLY the JSON object. Do not include markdown or explanations.`;

  const { content, telemetry } = await callGroq(prompt, true);
  const parsed = JSON.parse(content);

  return {
    assessedLevel: parsed.assessedLevel || "Intermediate",
    strengths: parsed.strengths || ["Syntax comprehension"],
    weaknesses: parsed.weaknesses || ["Scope bindings"],
    learningStyle: parsed.learningStyle || style || "Projects",
    estimatedWeeks: parsed.estimatedWeeks || 12,
    successProbability: parsed.successProbability || 85,
    roadmapRecommendation: parsed.roadmapRecommendation || goal,
    telemetry
  };
}

