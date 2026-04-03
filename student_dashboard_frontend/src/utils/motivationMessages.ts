import type { MotivationTone } from '../contexts/MotivationToneContext';

/**
 * Message keys for different parts of the system
 * Each key maps to three variants based on motivation tone
 */
type MessageKey =
  // Greetings
  | 'greeting'
  
  // Task Completion
  | 'task_completed'
  | 'points_earned'
  | 'session_complete'
  | 'streak_increment'
  
  // Focus Mode
  | 'focus_enter'
  | 'focus_exit_early'
  | 'focus_pause'
  | 'focus_completion'
  
  // Task Reminders
  | 'task_due_soon'
  | 'task_overdue'
  | 'no_tasks_today'
  
  // Progress
  | 'daily_progress_good'
  | 'daily_progress_behind'
  | 'weekly_summary'
  
  // Empty States
  | 'no_tasks_found'
  | 'no_upcoming_tasks'
  | 'no_overdue_tasks'
  
  // AI Coach
  | 'weak_area_detected'
  | 'improvement_detected'
  | 'consistency_building'
  
  // Unlock Messages
  | 'feature_unlocked'
  | 'milestone_reached';

type MessageData = {
  [key in MessageKey]: {
    calm: string;
    competitive: string;
    supportive: string;
  };
};

const messages: MessageData = {
  // Greetings
  greeting: {
    calm: 'Good day!',
    competitive: 'Hello, competitor!',
    supportive: 'Hi there!',
  },
  
  // Task Completion
  task_completed: {
    calm: 'Task complete. Moving forward steadily.',
    competitive: 'Task complete. Keep this pace to stay ahead.',
    supportive: 'Great work! Task completed successfully.',
  },
  
  points_earned: {
    calm: 'Effort recognized',
    competitive: 'Points earned - rank impact',
    supportive: 'Points earned - nice job!',
  },
  
  session_complete: {
    calm: 'Focused session completed',
    competitive: 'Session complete - consistency building',
    supportive: 'Focused session completed. Streak +1',
  },
  
  streak_increment: {
    calm: 'Consistency credit awarded',
    competitive: 'Streak +1 - stay consistent to climb',
    supportive: 'Streak +1 - you\'re building momentum!',
  },
  
  // Focus Mode
  focus_enter: {
    calm: 'Take your time. Focus on understanding.',
    competitive: 'This session counts. Make it effective.',
    supportive: 'You\'ve got this. Let\'s make progress together.',
  },
  
  focus_exit_early: {
    calm: 'You\'re building focus consistency.',
    competitive: 'Early exit affects your focus score.',
    supportive: 'You\'re building focus consistency.',
  },
  
  focus_pause: {
    calm: 'Take a moment, then get back to it',
    competitive: 'Paused. Resume quickly to maintain momentum.',
    supportive: 'Take a breath. Resume when ready.',
  },
  
  focus_completion: {
    calm: 'One focused session builds momentum for the next.',
    competitive: 'Session complete. Top performers average 3/day.',
    supportive: 'Excellent focus! You\'re doing great.',
  },
  
  // Task Reminders
  task_due_soon: {
    calm: 'A short session today will keep things smooth.',
    competitive: 'Task due in 2 hours. Complete now to avoid rank drop.',
    supportive: 'Friendly reminder: task due soon. You can do this!',
  },
  
  task_overdue: {
    calm: 'This task is pending. No rush - just revisit when ready.',
    competitive: 'Overdue task detected. Complete today to recover.',
    supportive: 'This task needs attention. Let\'s tackle it together.',
  },
  
  no_tasks_today: {
    calm: 'No tasks scheduled. A good day to review or rest.',
    competitive: 'No scheduled tasks. Use this time to get ahead.',
    supportive: 'All clear for today! Great job staying on top of things.',
  },
  
  // Progress
  daily_progress_good: {
    calm: 'You\'re making steady progress.',
    competitive: 'Strong daily performance. Keep pushing.',
    supportive: 'Nice work today! You\'re doing great.',
  },
  
  daily_progress_behind: {
    calm: 'A few tasks remain. Work at your own pace.',
    competitive: 'You\'re 2 tasks behind target. Close the gap today.',
    supportive: 'A couple more tasks will close the day strong.',
  },
  
  weekly_summary: {
    calm: 'Consistency matters more than speed.',
    competitive: 'This week: avg rank movement +3. Target: +5.',
    supportive: 'You\'re improving - keep the rhythm going!',
  },
  
  // Empty States
  no_tasks_found: {
    calm: 'No tasks match your filters. Adjust or add new ones.',
    competitive: 'No tasks found. Add high-priority items to stay ahead.',
    supportive: 'No tasks here yet. Ready to add your first one?',
  },
  
  no_upcoming_tasks: {
    calm: 'No upcoming tasks. You\'re organized.',
    competitive: 'No upcoming tasks. Plan ahead to maximize output.',
    supportive: 'All caught up! Nice planning.',
  },
  
  no_overdue_tasks: {
    calm: 'Great! No overdue tasks.',
    competitive: 'Zero overdue tasks. Maintain this standard.',
    supportive: 'Amazing! No overdue tasks.',
  },
  
  // AI Coach
  weak_area_detected: {
    calm: 'This topic needs attention. Revisit when ready.',
    competitive: 'Weak area: Electrostatics. Address this to improve rank.',
    supportive: 'Let\'s work on this together. Small steps add up.',
  },
  
  improvement_detected: {
    calm: 'Your understanding is improving gradually.',
    competitive: 'Accuracy up 12%. Keep this trajectory.',
    supportive: 'Great improvement! You\'re getting stronger.',
  },
  
  consistency_building: {
    calm: 'You\'re showing up regularly. That\'s what matters.',
    competitive: 'Consistency score: 78%. Target: 85% for rank boost.',
    supportive: 'You\'re building great habits. Keep it up!',
  },
  
  // Unlock Messages
  feature_unlocked: {
    calm: 'New feature available. Explore when you\'re ready.',
    competitive: 'Feature unlocked. Use it to gain advantage.',
    supportive: 'Congrats! You\'ve unlocked a new feature.',
  },
  
  milestone_reached: {
    calm: 'Milestone reached. Steady progress continues.',
    competitive: 'Milestone hit. You\'re in the top 15%.',
    supportive: 'Milestone reached! Well done!',
  },
};

/**
 * Get a message based on key and motivation tone
 * This is the ONLY way system messages should be rendered
 */
export function getMessage(key: MessageKey, tone: MotivationTone): string {
  return messages[key][tone];
}

/**
 * Get motivational message - exported for backward compatibility
 */
export function getMotivationMessage(key: MessageKey, tone: MotivationTone): string {
  return getMessage(key, tone);
}