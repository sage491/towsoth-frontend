export type TaskType = 'study' | 'assignment' | 'test' | 'deadline' | 'personal';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  subject?: string;
  dueDate: string;
  dueTime?: string;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  estimatedTime?: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  pointsEarned?: number;
}
