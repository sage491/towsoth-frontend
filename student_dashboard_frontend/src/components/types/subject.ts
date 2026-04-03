import type { LucideIcon } from 'lucide-react';

export type ComprehensionLevel = 'High' | 'Medium' | 'Low';
export type RetentionTrend = 'Improving' | 'Stable' | 'Dropping';

export interface SubjectDomain {
  name: string;
  icon: LucideIcon;
  chapter: string;
  topic: string;
  mastery: number;
  comprehension: ComprehensionLevel;
  weaknessSeverity: number;
  retention: RetentionTrend;
  rankContribution: string;
  color: string;
  aiInsight?: string;
}
