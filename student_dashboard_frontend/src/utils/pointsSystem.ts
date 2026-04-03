import type { Task, TaskType } from '@/types/Planner';

export interface PointsEarned {
  base: number;
  modifiers: { reason: string; points: number }[];
  total: number;
}

/**
 * Calculate points for a completed task
 * Points reflect cognitive effort, academic value, time commitment, and consistency
 */
export function calculateTaskPoints(
  task: Task,
  context?: {
    completedOnTime?: boolean;
    actualDuration?: number; // in minutes
    linkedToWeakArea?: boolean;
    accuracyImprovement?: boolean;
    timeManagementImprovement?: boolean;
    aiImprovementTag?: boolean;
    streakActive?: boolean;
    goalDuration?: number; // in days
    snoozeCount?: number;
  }
): PointsEarned {
  const modifiers: { reason: string; points: number }[] = [];
  let basePoints = 0;

  switch (task.type) {
    case 'study':
      basePoints = 5;
      
      if (context?.completedOnTime) {
        modifiers.push({ reason: 'Completed on time', points: 2 });
      }
      
      if (context?.actualDuration && task.estimatedTime && context.actualDuration >= task.estimatedTime) {
        modifiers.push({ reason: 'Full study duration', points: 3 });
      }
      
      if (context?.linkedToWeakArea) {
        modifiers.push({ reason: 'Targeted weak area', points: 5 });
      }
      break;

    case 'assignment':
      basePoints = 10;
      
      if (context?.completedOnTime) {
        modifiers.push({ reason: 'Submitted before deadline', points: 5 });
      }
      
      // Placeholder for plagiarism check - in real system would integrate with checker
      modifiers.push({ reason: 'Quality submission', points: 5 });
      
      // Would compare with previous assignments in real system
      if (context?.accuracyImprovement) {
        modifiers.push({ reason: 'Improved vs last assignment', points: 3 });
      }
      break;

    case 'test':
      basePoints = 15;
      
      if (context?.accuracyImprovement) {
        modifiers.push({ reason: 'Accuracy improved', points: 5 });
      }
      
      if (context?.timeManagementImprovement) {
        modifiers.push({ reason: 'Better time management', points: 5 });
      }
      
      if (context?.aiImprovementTag) {
        modifiers.push({ reason: 'AI improvement detected', points: 5 });
      }
      break;

    case 'deadline':
      basePoints = 3;
      
      if (context?.completedOnTime && (!context?.snoozeCount || context.snoozeCount <= 1)) {
        modifiers.push({ reason: 'No snooze abuse', points: 2 });
      }
      break;

    case 'personal':
      basePoints = 8;
      
      if (context?.streakActive) {
        modifiers.push({ reason: 'Streak-based completion', points: 4 });
      }
      
      if (context?.goalDuration && context.goalDuration >= 7) {
        modifiers.push({ reason: 'Long-term goal', points: 4 });
      }
      break;
  }

  const totalModifierPoints = modifiers.reduce((sum, m) => sum + m.points, 0);
  const total = basePoints + totalModifierPoints;

  return {
    base: basePoints,
    modifiers,
    total,
  };
}

/**
 * Get point range for a task type (for preview in UI)
 */
export function getTaskTypePointRange(type: TaskType): string {
  switch (type) {
    case 'study':
      return '5–10 pts';
    case 'assignment':
      return 'Up to 20 pts';
    case 'test':
      return 'Up to 30 pts';
    case 'deadline':
      return '3–5 pts';
    case 'personal':
      return '8–15 pts';
  }
}

/**
 * Get max possible points for a task type
 */
export function getMaxPoints(type: TaskType): number {
  switch (type) {
    case 'study':
      return 10;
    case 'assignment':
      return 20;
    case 'test':
      return 30;
    case 'deadline':
      return 5;
    case 'personal':
      return 15;
  }
}

/**
 * Calculate if task was completed on time
 */
export function isCompletedOnTime(task: Task, completedAt: Date): boolean {
  const dueDateTime = new Date(task.dueDate);
  if (task.dueTime) {
    const [hours, minutes] = task.dueTime.split(':');
    dueDateTime.setHours(parseInt(hours), parseInt(minutes));
  } else {
    // If no time specified, use end of day
    dueDateTime.setHours(23, 59, 59);
  }
  
  return completedAt <= dueDateTime;
}

/**
 * Daily points summary storage
 */
const POINTS_STORAGE_KEY = 'towsoth_planner_points';

export interface DailyPoints {
  date: string; // YYYY-MM-DD
  points: number;
  tasksCompleted: number;
}

export function saveDailyPoints(points: number, tasksCompleted: number) {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(POINTS_STORAGE_KEY);
  const allPoints: DailyPoints[] = stored ? JSON.parse(stored) : [];
  
  const todayIndex = allPoints.findIndex(p => p.date === today);
  if (todayIndex >= 0) {
    allPoints[todayIndex].points += points;
    allPoints[todayIndex].tasksCompleted += tasksCompleted;
  } else {
    allPoints.push({ date: today, points, tasksCompleted });
  }
  
  // Keep only last 30 days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);
  const filtered = allPoints.filter(p => new Date(p.date) >= cutoffDate);
  
  localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(filtered));
}

export function getTodayPoints(): DailyPoints | null {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(POINTS_STORAGE_KEY);
  if (!stored) return null;
  
  const allPoints: DailyPoints[] = JSON.parse(stored);
  return allPoints.find(p => p.date === today) || null;
}

export function getWeeklyPoints(): { total: number; average: number; days: DailyPoints[] } {
  const stored = localStorage.getItem(POINTS_STORAGE_KEY);
  if (!stored) return { total: 0, average: 0, days: [] };
  
  const allPoints: DailyPoints[] = JSON.parse(stored);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const weekPoints = allPoints.filter(p => new Date(p.date) >= weekAgo);
  const total = weekPoints.reduce((sum, p) => sum + p.points, 0);
  const average = weekPoints.length > 0 ? Math.round(total / weekPoints.length) : 0;
  
  return { total, average, days: weekPoints };
}
