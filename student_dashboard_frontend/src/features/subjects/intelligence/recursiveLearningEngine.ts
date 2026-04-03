import { SubjectsPageSubject } from "@/features/student/subjects/types";

type ErrorCategory = "conceptual" | "procedural" | "retention" | "careless";
type Priority = "Critical" | "High" | "Medium";

export interface ClassifiedError {
  subject: string;
  topic: string;
  category: ErrorCategory;
  confidence: number;
}

export interface WeaknessPropagation {
  blockedTopic: string;
  dependsOn: string;
  impactScore: number;
}

export interface PersonalizedPlanItem {
  subject: string;
  title: string;
  contentType: "micro-lesson" | "targeted-practice" | "active-recall" | "checkpoint-test";
  minutes: number;
  reason: string;
}

export interface RecursiveLearningReport {
  focusSubject: string;
  overallKnowledgeScore: number;
  errors: ClassifiedError[];
  propagatedWeaknesses: WeaknessPropagation[];
  personalizedPlan: PersonalizedPlanItem[];
  coachingText: string;
}

const DEPENDENCY_MAP: Record<string, string[]> = {
  "Lenz Law Applications": ["AC Circuit Phasors", "Transformer Efficiency"],
  "AC Circuit Phasors": ["AC Power Factor", "RLC Resonance"],
  "DNA Replication Enzymes": ["Transcription Factors", "Post-transcriptional Modification"],
  "Integration by Parts": ["Reduction Formulas", "Definite Integration"],
  "SN1 vs SN2 Selectivity": ["Reaction Mechanisms"],
};

function ratio(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, current / total));
}

function classifyTopicError(topic: string, retention: number): ErrorCategory {
  const key = topic.toLowerCase();
  if (key.includes("application") || key.includes("phasor") || key.includes("mechanism")) {
    return "procedural";
  }
  if (key.includes("formula") || key.includes("factor") || retention < 70) {
    return "retention";
  }
  if (key.includes("efficiency") || key.includes("selectivity")) {
    return "careless";
  }
  return "conceptual";
}

function getPriority(score: number): Priority {
  if (score < 60) return "Critical";
  if (score < 75) return "High";
  return "Medium";
}

function propagateWeaknesses(errors: ClassifiedError[]): WeaknessPropagation[] {
  return errors.flatMap((error) => {
    const dependents = DEPENDENCY_MAP[error.topic] ?? [];
    return dependents.map((blockedTopic) => ({
      dependsOn: error.topic,
      blockedTopic,
      impactScore: Math.round(error.confidence * 100),
    }));
  });
}

function rankSubjectNeed(subject: SubjectsPageSubject): number {
  const practice = ratio(subject.learningLoop.practiced.current, subject.learningLoop.practiced.total);
  const revision = ratio(subject.learningLoop.revised.current, subject.learningLoop.revised.total);
  const test = ratio(subject.learningLoop.tested.current, subject.learningLoop.tested.total);
  const loopHealth = (practice + revision + test) / 3;
  const weaknessPenalty = Math.min(25, subject.weakClusters.length * 5);
  return Math.round(subject.mastery * 0.45 + subject.retention * 0.35 + loopHealth * 100 * 0.2 - weaknessPenalty);
}

function generatePlan(subjects: SubjectsPageSubject[], errors: ClassifiedError[]): PersonalizedPlanItem[] {
  const byPriority = [...subjects].sort((a, b) => rankSubjectNeed(a) - rankSubjectNeed(b));
  return byPriority.slice(0, 3).map((subject, idx) => {
    const topError = errors.find((error) => error.subject === subject.name);
    const weakTopic = topError?.topic ?? subject.currentFocus;
    const mode = idx === 0 ? "micro-lesson" : idx === 1 ? "targeted-practice" : "checkpoint-test";

    return {
      subject: subject.name,
      title: `${weakTopic} recovery sprint`,
      contentType: mode,
      minutes: idx === 0 ? 20 : idx === 1 ? 25 : 15,
      reason: `${topError?.category ?? "conceptual"} gap detected with ${getPriority(
        rankSubjectNeed(subject)
      )} priority`,
    };
  });
}

export function buildRecursiveLearningReport(subjects: SubjectsPageSubject[]): RecursiveLearningReport {
  if (subjects.length === 0) {
    return {
      focusSubject: "No subjects available",
      overallKnowledgeScore: 0,
      errors: [],
      propagatedWeaknesses: [],
      personalizedPlan: [],
      coachingText: "Add subjects to start adaptive coaching.",
    };
  }

  const scored = subjects.map((subject) => ({ subject, score: rankSubjectNeed(subject) }));
  const focus = scored.reduce((lowest, current) => (current.score < lowest.score ? current : lowest), scored[0]);

  const errors: ClassifiedError[] = subjects.flatMap((subject) =>
    subject.weakClusters.map((topic) => {
      const category = classifyTopicError(topic, subject.retention);
      const confidenceBase = 1 - ratio(subject.mastery, 100);
      const confidence = Math.max(0.55, Math.min(0.95, confidenceBase + 0.2));
      return {
        subject: subject.name,
        topic,
        category,
        confidence,
      };
    })
  );

  const propagatedWeaknesses = propagateWeaknesses(errors).sort((a, b) => b.impactScore - a.impactScore);
  const personalizedPlan = generatePlan(subjects, errors);
  const overallKnowledgeScore = Math.round(
    subjects.reduce((sum, item) => sum + rankSubjectNeed(item), 0) / subjects.length
  );

  const coachingText = `Focus on ${focus.subject.name}: low readiness from weak-topic depth and incomplete loop progress. Complete the first two plan items today to improve predicted retention.`;

  return {
    focusSubject: focus.subject.name,
    overallKnowledgeScore,
    errors,
    propagatedWeaknesses,
    personalizedPlan,
    coachingText,
  };
}
