import { API_BASE_URL } from "@/shared/config/env";
import { RecursiveLearningReport } from "@/features/subjects/intelligence/recursiveLearningEngine";

interface LlmNarrativeResponse {
  message?: string;
}

export function buildLearningCoachPrompt(report: RecursiveLearningReport): string {
  const topErrors = report.errors
    .slice(0, 3)
    .map((error) => `${error.topic} (${error.category}, ${Math.round(error.confidence * 100)}%)`)
    .join(", ");

  const plan = report.personalizedPlan
    .slice(0, 3)
    .map((item) => `${item.subject}: ${item.contentType} for ${item.minutes}m on ${item.title}`)
    .join(" | ");

  return [
    "You are an adaptive tutor for exam preparation.",
    `Focus subject: ${report.focusSubject}`,
    `Knowledge score: ${report.overallKnowledgeScore}%`,
    `Top error profile: ${topErrors || "none"}`,
    `Planned actions: ${plan || "none"}`,
    "Task: produce a short motivational coaching message (max 2 sentences) with one clear next action.",
  ].join("\n");
}

export function getFallbackNarrative(report: RecursiveLearningReport): string {
  const first = report.personalizedPlan[0];
  if (!first) return "Start with one weak topic review session to improve retention.";
  return `Focus on ${report.focusSubject}. Next action: complete ${first.minutes} minutes of ${first.contentType} for ${first.subject} to close your highest-impact gap.`;
}

export async function generateLearningNarrative(report: RecursiveLearningReport): Promise<string> {
  const endpoint = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}/ai/learning-coach` : "";
  const fallback = getFallbackNarrative(report);

  if (!endpoint) return fallback;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: buildLearningCoachPrompt(report) }),
    });

    if (!response.ok) return fallback;
    const data = (await response.json()) as LlmNarrativeResponse;
    return data.message?.trim() || fallback;
  } catch {
    return fallback;
  }
}
