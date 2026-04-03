import type { LucideIcon } from 'lucide-react';

export interface StaffSummaryStat {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  description: string;
}

export interface StaffOperationalMetric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
}

export interface DepartmentPerformanceRow {
  dept: string;
  staff: number;
  completion: number;
  attendance: number;
}

export interface StaffActivityItem {
  activity: string;
  time: string;
  type: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  subject: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'Published' | 'Draft' | 'Archived';
  aiScore: number | null;
  visibility: string;
}

export interface AssessmentItem {
  id: string;
  title: string;
  type: string;
  subject: string;
  batch: string;
  date: string;
  dueDate: string;
  duration: string;
  totalMarks: number;
  questions: number;
  status: 'Published' | 'Draft' | 'Completed';
  gradingState: string;
  completed: number;
  total: number;
}
