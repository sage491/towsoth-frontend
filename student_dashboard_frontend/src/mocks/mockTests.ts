import type { TestResultData } from "@/types/Test";

export interface UpcomingTestItem {
  id: number;
  name: string;
  date: string;
  time: string;
  duration: string;
  priority: "critical" | "high" | "medium";
}

export interface TopicBreakdownItem {
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
  trend: "stable" | "dropping" | "rising";
}

export interface FixPlanStep {
  step: number;
  action: string;
  impact: "High" | "Medium" | "Low";
}

export interface CompletedTestItem {
  id: number;
  name: string;
  score: number;
  maxScore: number;
  rank: number;
  percentile: number;
  date: string;
  accuracy: number;
  speed: number;
  marksLostReason: string;
  topicBreakdown: TopicBreakdownItem[];
  weakConcepts: string[];
  aiFixPlan: FixPlanStep[];
}

export const mockUpcomingTests: UpcomingTestItem[] = [
  { id: 1, name: "JEE Mock Test 3", date: "Tomorrow", time: "10:00 AM", duration: "3h", priority: "critical" },
  { id: 2, name: "Physics Chapter Test", date: "Feb 5", time: "4:00 PM", duration: "1h", priority: "high" },
  { id: 3, name: "Chemistry Practice", date: "Feb 7", time: "2:00 PM", duration: "45m", priority: "medium" },
];

export const mockCompletedTests: CompletedTestItem[] = [
  {
    id: 1,
    name: "JEE Mock Test 2",
    score: 78,
    maxScore: 100,
    rank: 142,
    percentile: 89.3,
    date: "Jan 28",
    accuracy: 84,
    speed: 72,
    marksLostReason: "Silly mistakes (12%), Conceptual gaps (8%)",
    topicBreakdown: [
      { topic: "EM Induction", correct: 8, total: 10, accuracy: 80, trend: "stable" },
      { topic: "Thermodynamics", correct: 7, total: 10, accuracy: 70, trend: "dropping" },
      { topic: "Organic Chemistry", correct: 9, total: 10, accuracy: 90, trend: "rising" },
      { topic: "Calculus", correct: 8, total: 10, accuracy: 80, trend: "rising" },
    ],
    weakConcepts: ["Lenz Law Applications", "Carnot Cycle Efficiency", "Integration by Parts"],
    aiFixPlan: [
      { step: 1, action: "Watch: Lenz Law Visualization (12 min)", impact: "High" },
      { step: 2, action: "Practice: Carnot Cycle Problems (15Q)", impact: "Medium" },
      { step: 3, action: "Revise: Integration Techniques Notes", impact: "Medium" },
      { step: 4, action: "Retest: Adaptive Quiz on Weak Areas", impact: "High" },
    ],
  },
];

export const mockRecentTestResults: TestResultData[] = [
  { name: "Electromagnetic Induction - Recursive #3", date: "Jan 28, 2026", score: 85, percentile: 92, trend: "up", improvement: "+12%", type: "recursive", chapter: "EM Induction", attemptNumber: 3 },
  { name: "JEE Mock Test #5", date: "Jan 27, 2026", score: 78, percentile: 88, trend: "down", improvement: "-3%", type: "mock" },
  { name: "Thermodynamics Chapter Test", date: "Jan 25, 2026", score: 92, percentile: 95, trend: "up", improvement: "+5%", type: "chapter", chapter: "Thermodynamics" },
  { name: "Rotational Dynamics - Recursive #2", date: "Jan 24, 2026", score: 88, percentile: 90, trend: "up", improvement: "+8%", type: "recursive", chapter: "Rotational Dynamics", attemptNumber: 2 },
  { name: "NEET Mock Test #3", date: "Jan 22, 2026", score: 81, percentile: 89, trend: "up", improvement: "+2%", type: "mock" },
  { name: "Optics Chapter Test", date: "Jan 20, 2026", score: 76, percentile: 85, trend: "down", improvement: "-4%", type: "chapter", chapter: "Optics" },
  { name: "Waves - Recursive #4", date: "Jan 18, 2026", score: 94, percentile: 96, trend: "up", improvement: "+15%", type: "recursive", chapter: "Waves", attemptNumber: 4 },
  { name: "Modern Physics Chapter Test", date: "Jan 15, 2026", score: 83, percentile: 87, trend: "up", improvement: "+3%", type: "chapter", chapter: "Modern Physics" },
];
