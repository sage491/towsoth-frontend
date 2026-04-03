import { useState, useEffect } from 'react';

export interface StudentProgress {
  dailyTasks: { completed: number; total: number };
  assignments: { completed: number; total: number };
  studyStreak: number;
  consecutiveFullDays: number;
  lastActivityDate: string | null;
  unlockedFeatures: string[];
}

const INITIAL_PROGRESS: StudentProgress = {
  dailyTasks: { completed: 0, total: 5 },
  assignments: { completed: 0, total: 1 },
  studyStreak: 0,
  consecutiveFullDays: 0,
  lastActivityDate: null,
  unlockedFeatures: [
    'Full Subject Materials',
    'Test Schedule',
    'Basic Analytics',
    'PYQ Solver (Basic)',
  ],
};

const STORAGE_KEY = 'towsoth_student_progress';

export function useStudentProgress() {
  const [progress, setProgress] = useState<StudentProgress>(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if it's from today, otherwise reset daily tasks
        const today = new Date().toDateString();
        if (parsed.lastActivityDate !== today) {
          return {
            ...parsed,
            dailyTasks: { ...parsed.dailyTasks, completed: 0 },
            lastActivityDate: today,
          };
        }
        return parsed;
      } catch {
        return INITIAL_PROGRESS;
      }
    }
    return INITIAL_PROGRESS;
  });

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Check unlock conditions and auto-unlock features
  useEffect(() => {
    const newUnlocks: string[] = [];

    // Advanced Analytics: All daily tasks complete
    if (
      progress.dailyTasks.completed >= progress.dailyTasks.total &&
      !progress.unlockedFeatures.includes('Advanced Analytics')
    ) {
      newUnlocks.push('Advanced Analytics');
    }

    // Full PYQ Solver: 7-day streak
    if (
      progress.studyStreak >= 7 &&
      !progress.unlockedFeatures.includes('Full PYQ Solver')
    ) {
      newUnlocks.push('Full PYQ Solver');
    }

    // Global Leaderboard: All assignments submitted
    if (
      progress.assignments.completed >= progress.assignments.total &&
      progress.assignments.total > 0 &&
      !progress.unlockedFeatures.includes('Global Leaderboard')
    ) {
      newUnlocks.push('Global Leaderboard');
    }

    // AI Deep-Analysis: 3 consecutive full days
    if (
      progress.consecutiveFullDays >= 3 &&
      !progress.unlockedFeatures.includes('AI Deep-Analysis')
    ) {
      newUnlocks.push('AI Deep-Analysis');
    }

    // Add newly unlocked features
    if (newUnlocks.length > 0) {
      setProgress((prev) => ({
        ...prev,
        unlockedFeatures: [...prev.unlockedFeatures, ...newUnlocks],
      }));
    }
  }, [
    progress.dailyTasks.completed,
    progress.studyStreak,
    progress.assignments.completed,
    progress.consecutiveFullDays,
  ]);

  // Complete a daily task
  const completeTask = () => {
    setProgress((prev) => {
      const newCompleted = Math.min(
        prev.dailyTasks.completed + 1,
        prev.dailyTasks.total
      );
      
      // Update activity tracking
      const today = new Date().toDateString();
      const isFirstActivityToday = prev.lastActivityDate !== today;
      
      let newStreak = prev.studyStreak;
      let newConsecutiveDays = prev.consecutiveFullDays;

      if (isFirstActivityToday) {
        newStreak = prev.studyStreak + 1;
      }

      // Check if this completes the day
      if (newCompleted === prev.dailyTasks.total) {
        newConsecutiveDays = prev.consecutiveFullDays + 1;
      }

      return {
        ...prev,
        dailyTasks: { ...prev.dailyTasks, completed: newCompleted },
        studyStreak: newStreak,
        consecutiveFullDays: newConsecutiveDays,
        lastActivityDate: today,
      };
    });
  };

  // Submit assignment
  const submitAssignment = () => {
    setProgress((prev) => {
      const newCompleted = Math.min(
        prev.assignments.completed + 1,
        prev.assignments.total
      );

      // Update activity tracking
      const today = new Date().toDateString();
      const isFirstActivityToday = prev.lastActivityDate !== today;
      
      let newStreak = prev.studyStreak;

      if (isFirstActivityToday) {
        newStreak = prev.studyStreak + 1;
      }

      return {
        ...prev,
        assignments: { ...prev.assignments, completed: newCompleted },
        studyStreak: newStreak,
        lastActivityDate: today,
      };
    });
  };

  // Register any learning activity (quiz, module, etc.)
  const registerActivity = () => {
    setProgress((prev) => {
      const today = new Date().toDateString();
      const isFirstActivityToday = prev.lastActivityDate !== today;

      if (!isFirstActivityToday) {
        return prev; // Already counted today
      }

      return {
        ...prev,
        studyStreak: prev.studyStreak + 1,
        lastActivityDate: today,
      };
    });
  };

  // Reset daily progress (for testing/demo)
  const resetDailyProgress = () => {
    setProgress((prev) => ({
      ...prev,
      dailyTasks: { ...prev.dailyTasks, completed: 0 },
      assignments: { ...prev.assignments, completed: 0 },
    }));
  };

  // Calculate progress percentage
  const dailyProgressPercent = Math.round(
    (progress.dailyTasks.completed / progress.dailyTasks.total) * 100
  );

  // Get locked features with unlock conditions
  const getLockedFeatures = () => {
    const locked = [];

    if (!progress.unlockedFeatures.includes('Advanced Analytics')) {
      const tasksRemaining = progress.dailyTasks.total - progress.dailyTasks.completed;
      locked.push({
        name: 'Advanced Analytics',
        requirement:
          tasksRemaining > 0
            ? `Complete today's remaining ${tasksRemaining} task${tasksRemaining > 1 ? 's' : ''}`
            : 'Complete all daily tasks',
        tasksNeeded: tasksRemaining,
      });
    }

    if (!progress.unlockedFeatures.includes('Full PYQ Solver')) {
      const daysRemaining = Math.max(0, 7 - progress.studyStreak);
      locked.push({
        name: 'Full PYQ Solver',
        requirement: `Maintain ${daysRemaining > 0 ? `${daysRemaining} more day${daysRemaining > 1 ? 's' : ''} for` : ''} 7-day study streak`,
        tasksNeeded: daysRemaining,
      });
    }

    if (!progress.unlockedFeatures.includes('Global Leaderboard')) {
      const assignmentsRemaining =
        progress.assignments.total - progress.assignments.completed;
      locked.push({
        name: 'Global Leaderboard',
        requirement:
          assignmentsRemaining > 0
            ? `Submit ${assignmentsRemaining} more assignment${assignmentsRemaining > 1 ? 's' : ''}`
            : 'Submit all weekly assignments',
        tasksNeeded: assignmentsRemaining,
      });
    }

    if (!progress.unlockedFeatures.includes('AI Deep-Analysis')) {
      const daysRemaining = Math.max(0, 3 - progress.consecutiveFullDays);
      locked.push({
        name: 'AI Deep-Analysis',
        requirement: `Complete all daily tasks for ${daysRemaining > 0 ? `${daysRemaining} more` : '3 consecutive'} day${daysRemaining !== 1 ? 's' : ''}`,
        tasksNeeded: daysRemaining,
      });
    }

    return locked;
  };

  // Get motivational message
  const getMotivationalMessage = () => {
    const remaining = progress.dailyTasks.total - progress.dailyTasks.completed;

    if (remaining === 0) {
      return 'All tasks complete. Full system access enabled.';
    } else if (remaining === 1) {
      return 'One more task unlocks deeper insights.';
    } else {
      return 'Complete today\'s goals to unlock more study tools.';
    }
  };

  return {
    progress,
    dailyProgressPercent,
    completeTask,
    submitAssignment,
    registerActivity,
    resetDailyProgress,
    getLockedFeatures,
    getMotivationalMessage,
  };
}