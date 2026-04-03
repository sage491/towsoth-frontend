import type { LucideIcon } from 'lucide-react';

export interface AssessmentQuestion {
  id: string;
  category: 'aptitude' | 'interest' | 'personality' | 'workstyle' | 'learning';
  type: 'mcq' | 'rating' | 'multiselect';
  question: string;
  options: string[];
  timeLimit?: number;
}

export interface BehaviorMetrics {
  avgTimePerQuestion: number;
  questionsSkipped: number;
  questionsRevisited: number;
  decisionSpeed: 'fast' | 'medium' | 'slow';
  confidenceLevel: number;
  stressIndicators: number;
}

export interface DisciplineData {
  studyConsistency: number;
  goalCompletionRate: number;
  punctuality: number;
  regularPractice: number;
  revisionFrequency: number;
  mockTestParticipation: number;
}

export interface ScoreAnalysis {
  jeePerformance: number;
  physicsStrength: number;
  chemistryStrength: number;
  mathsStrength: number;
  improvementRate: number;
  consistency: number;
  peakPerformance: number;
}

export interface CareerRecommendation {
  career: string;
  matchScore: number;
  icon: LucideIcon;
  color: string;
  description: string;
  requiredSkills: string[];
  collegeSuggestions: string[];
  branchOptions: string[];
  skillGaps: string[];
  developmentPlan: string[];
  timelineYears: number;
  avgPackage: string;
  topColleges: string[];
}
