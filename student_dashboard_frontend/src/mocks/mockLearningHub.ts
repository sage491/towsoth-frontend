export interface LearningSuggestion {
  type: string;
  title: string;
  subtitle: string;
  action: string;
  reason: string;
}

export interface ContinueLearningItem {
  id: number;
  title: string;
  progress: number;
  lastTopic: string;
  subject: string;
  timeLeft: string;
}

export interface RecommendedCourseItem {
  id: number;
  title: string;
  reason: string;
  difficulty: string;
  duration: string;
  subject: string;
}

export interface RevisionBoostItem {
  id: number;
  title: string;
  urgency: "High" | "Medium" | "Low";
  lastStudied: string;
  accuracy: number;
  subject: string;
}

export interface PracticeNowItem {
  id: number;
  title: string;
  difficulty: string;
  duration: string;
  questions: number;
}

export interface QuickResourceItem {
  id: number;
  title: string;
  type: string;
  size?: string;
  duration?: string;
}

export interface LearningHubData {
  aiSuggestion: LearningSuggestion;
  continueLearning: ContinueLearningItem[];
  recommendedForYou: RecommendedCourseItem[];
  revisionBoost: RevisionBoostItem[];
  practiceNow: PracticeNowItem[];
  quickResources: QuickResourceItem[];
}

export const mockLearningHubData: LearningHubData = {
  aiSuggestion: {
    type: "continue",
    title: "Rotational Dynamics",
    subtitle: "Module 3: Angular Momentum • 15 minutes left",
    action: "Resume Learning",
    reason: "You were making good progress yesterday",
  },
  continueLearning: [
    { id: 1, title: "Organic Chemistry", progress: 65, lastTopic: "Stereochemistry", subject: "Chemistry", timeLeft: "2h 15m" },
    { id: 2, title: "Calculus Mastery", progress: 42, lastTopic: "Integration Techniques", subject: "Math", timeLeft: "4h 30m" },
    { id: 3, title: "Rotational Dynamics", progress: 78, lastTopic: "Angular Momentum", subject: "Physics", timeLeft: "45m" },
    { id: 4, title: "Cell Biology", progress: 88, lastTopic: "Genetics", subject: "Biology", timeLeft: "30m" },
  ],
  recommendedForYou: [
    { id: 5, title: "Electromagnetism Deep Dive", reason: "Based on your Physics progress", difficulty: "Advanced", duration: "38h", subject: "Physics" },
    { id: 6, title: "Organic Chemistry Practice", reason: "Strengthen weak areas", difficulty: "Intermediate", duration: "12h", subject: "Chemistry" },
    { id: 7, title: "Differential Equations", reason: "Next in your Math path", difficulty: "Advanced", duration: "24h", subject: "Math" },
    { id: 8, title: "Thermodynamics", reason: "Popular with top performers", difficulty: "Intermediate", duration: "20h", subject: "Physics" },
  ],
  revisionBoost: [
    { id: 9, title: "Lenz Law Review", urgency: "High", lastStudied: "2 weeks ago", accuracy: 62, subject: "Physics" },
    { id: 10, title: "Organic Reactions Quick Revision", urgency: "Medium", lastStudied: "1 week ago", accuracy: 75, subject: "Chemistry" },
    { id: 11, title: "Limits & Continuity Flashcards", urgency: "Low", lastStudied: "3 days ago", accuracy: 88, subject: "Math" },
  ],
  practiceNow: [
    { id: 12, title: "20 Quick MCQs - Physics", difficulty: "Mixed", duration: "15m", questions: 20 },
    { id: 13, title: "Organic Chemistry Problem Set", difficulty: "Hard", duration: "30m", questions: 15 },
    { id: 14, title: "Integration Practice", difficulty: "Medium", duration: "25m", questions: 18 },
  ],
  quickResources: [
    { id: 15, title: "Physics Formula Sheet", type: "PDF", size: "1.8 MB" },
    { id: 16, title: "Math Shortcuts Guide", type: "PDF", size: "2.4 MB" },
    { id: 17, title: "Chemistry Lecture Notes", type: "Video", duration: "45m" },
    { id: 18, title: "JEE 2024 Paper Analysis", type: "PDF", size: "3.1 MB" },
  ],
};
