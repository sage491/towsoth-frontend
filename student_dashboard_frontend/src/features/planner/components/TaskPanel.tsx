import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export type TaskType = 'study' | 'practice' | 'revision' | 'test' | 'deadline';

export interface DailyTask {
  id: string;
  title: string;
  type: TaskType;
  subject?: string;
  time: number; // in minutes
  xp: number;
  rankImpact: number;
  dueToday: boolean;
  completed: boolean;
  createdAt: string;
}

interface TaskPanelProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<DailyTask, 'id' | 'createdAt'>) => void;
  editingTask: DailyTask | null;
}

const TASK_TYPE_CONFIG = {
  study: { label: 'Study', xpRange: '150-200', rankImpact: 8, color: '#3b82f6' },
  practice: { label: 'Practice', xpRange: '200-300', rankImpact: 12, color: '#10b981' },
  revision: { label: 'Revision', xpRange: '100-150', rankImpact: 6, color: '#f59e0b' },
  test: { label: 'Test', xpRange: '300-500', rankImpact: 20, color: '#ef4444' },
  deadline: { label: 'Deadline', xpRange: '50-100', rankImpact: 3, color: '#8b5cf6' },
};

export function TaskPanel({ open, onClose, onSave, editingTask }: TaskPanelProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>('study');
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState(40);
  const [dueToday, setDueToday] = useState(true);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setType(editingTask.type);
      setSubject(editingTask.subject || '');
      setTime(editingTask.time);
      setDueToday(editingTask.dueToday);
    } else {
      setTitle('');
      setType('study');
      setSubject('');
      setTime(40);
      setDueToday(true);
    }
  }, [editingTask, open]);

  const calculateXP = (taskType: TaskType, minutes: number): number => {
    const baseXP = {
      study: 150,
      practice: 250,
      revision: 120,
      test: 400,
      deadline: 80,
    };
    
    // XP scales with time
    const timeMultiplier = Math.min(minutes / 40, 2); // Cap at 2x
    return Math.round(baseXP[taskType] * timeMultiplier);
  };

  const calculateRankImpact = (taskType: TaskType, minutes: number): number => {
    const base = TASK_TYPE_CONFIG[taskType].rankImpact;
    const timeMultiplier = Math.min(minutes / 40, 1.5);
    return Math.round(base * timeMultiplier);
  };

  const previewXP = calculateXP(type, time);
  const previewRank = calculateRankImpact(type, time);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      type,
      subject: subject || undefined,
      time,
      xp: previewXP,
      rankImpact: previewRank,
      dueToday,
      completed: false,
    });

    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="border-b pb-4 mb-6" style={{ borderColor: 'var(--border-soft)' }}>
          <SheetTitle className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {editingTask ? 'Edit Task' : 'Add Daily Task'}
          </SheetTitle>
          <SheetDescription className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Add or edit a task to your daily planner.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Complete EM Induction Practice Set"
              className="w-full px-4 py-3 text-sm border-2 focus:outline-none transition-colors"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)',
              }}
              required
              autoFocus
            />
          </div>

          {/* Task Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>
              Task Type * {editingTask && <span className="text-[10px] font-normal opacity-60">(cannot change)</span>}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(TASK_TYPE_CONFIG) as TaskType[]).map((taskType) => {
                const config = TASK_TYPE_CONFIG[taskType];
                const isSelected = type === taskType;
                const isDisabled = !!editingTask; // Disable if editing

                return (
                  <button
                    key={taskType}
                    type="button"
                    onClick={() => !isDisabled && setType(taskType)}
                    disabled={isDisabled}
                    className="p-3 text-left border-2 transition-all"
                    style={{
                      background: isSelected ? 'var(--bg-secondary)' : 'var(--bg-card)',
                      borderColor: isSelected ? config.color : 'var(--border-soft)',
                      opacity: isDisabled ? 0.5 : 1,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {config.label}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                      {config.xpRange} XP
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>
              Subject (Optional)
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 focus:outline-none transition-colors"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">No subject</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Time Estimate */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>
              Time Estimate *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
              {[20, 40, 60, 90].map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setTime(minutes)}
                  className="px-3 py-2 text-xs font-bold border-2 transition-all"
                  style={{
                    background: time === minutes ? 'var(--accent-primary)' : 'var(--bg-card)',
                    borderColor: time === minutes ? 'var(--accent-primary)' : 'var(--border-soft)',
                    color: time === minutes ? '#ffffff' : 'var(--text-primary)',
                  }}
                >
                  {minutes} min
                </button>
              ))}
            </div>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Math.max(5, parseInt(e.target.value) || 0))}
              min="5"
              max="180"
              className="w-full px-4 py-2 text-sm border-2 focus:outline-none"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Due Today Toggle */}
          <div className="flex items-center justify-between p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-soft)' }}>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Due Today
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                Show due badge if enabled
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDueToday(!dueToday)}
              className="relative w-12 h-6 rounded-full transition-colors"
              style={{ background: dueToday ? 'var(--accent-primary)' : 'var(--border-medium)' }}
            >
              <div
                className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                style={{ transform: dueToday ? 'translateX(26px)' : 'translateX(2px)' }}
              />
            </button>
          </div>

          {/* XP Preview */}
          <div className="p-4 border-l-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)' }}>
            <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Task Preview
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  XP to earn: +{previewXP}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Rank impact: +{previewRank}
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                +{previewXP}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: 'var(--border-soft)' }}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wide border-2 transition-colors"
              style={{
                background: 'transparent',
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-opacity disabled:opacity-50"
              style={{
                background: 'var(--accent-primary)',
                color: '#ffffff',
              }}
            >
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}