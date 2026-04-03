export interface WeeklyProgressItem {
  week: string;
  score: number;
  hours: number;
}

export interface SubjectMasteryItem {
  subject: string;
  mastery: number;
  trend: string;
  delta: string;
}

export interface ActivityDistributionItem {
  name: string;
  value: number;
  hours: number;
  color: string;
}

export interface DailyActivityItem {
  day: string;
  hours: number;
  accuracy: number;
}

export interface ConceptProgressItem {
  topic: string;
  progress: number;
  status: 'strong' | 'good' | 'weak';
}
