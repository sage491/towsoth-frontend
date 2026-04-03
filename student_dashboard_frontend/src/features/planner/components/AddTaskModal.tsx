import { X, ChevronDown, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Task, TaskType, TaskPriority } from '@/types/Planner';
import { getTaskTypePointRange } from '@/features/planner/services';
import { getPlannerClassHours } from '@/services/plannerUiService';
import { TimetableDrawer } from './TimetableDrawer';

interface AddTaskModalProps {
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export function AddTaskModal({ onAdd, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState<TaskType>('study');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTimetable, setShowTimetable] = useState(false);
  const [classHours, setClassHours] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    getPlannerClassHours().then((hours) => {
      if (!isMounted) return;
      setClassHours(hours);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      subject: subject || undefined,
      type,
      dueDate,
      dueTime: dueTime || undefined,
      priority,
      status: 'pending',
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const handleTimetableSlotSelect = (time: string) => {
    setDueTime(time);
  };

  // Check if selected time conflicts with class schedule
  const hasTimeConflict = () => {
    if (!dueTime) return false;
    return classHours.includes(dueTime);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl border-2 border-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Add Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Task Name */}
          <div>
            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2 block">
              Task Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Practice 20 Numericals"
              className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-600 text-sm transition-colors"
              required
              autoFocus
            />
          </div>

          {/* Task Type */}
          <div>
            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2 block">
              Task Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {[
                { value: 'study', label: 'Study Task', icon: '📚' },
                { value: 'assignment', label: 'Assignment', icon: '📝' },
                { value: 'test', label: 'Test/Quiz', icon: '🧪' },
                { value: 'deadline', label: 'Deadline', icon: '⏰' },
                { value: 'personal', label: 'Personal Goal', icon: '🎯' },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value as TaskType)}
                  className={`p-3 border-2 text-left transition-all ${
                    type === t.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-xs font-semibold text-slate-900 mb-1">
                    {t.label}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Earn {getTaskTypePointRange(t.value as TaskType)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subject (Optional) */}
          <div>
            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2 block">
              Subject (Optional)
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-600 text-sm transition-colors"
            >
              <option value="">No subject</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2 block">
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-600 text-sm transition-colors"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                  Due Time (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowTimetable(true)}
                  className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Calendar className="w-3 h-3" />
                  View Timetable
                </button>
              </div>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-600 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Time Conflict Warning */}
          {hasTimeConflict() && (
            <div className="bg-orange-50 border-l-4 border-orange-600 p-4 flex items-start gap-3">
              <div className="text-orange-600 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-orange-900 mb-1">
                  Time Conflict Detected
                </div>
                <div className="text-xs text-orange-800">
                  This time overlaps with your scheduled class. Consider choosing a free slot.
                </div>
              </div>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2 block">
              Priority
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { value: 'low', label: 'Low', color: 'slate' },
                { value: 'medium', label: 'Medium', color: 'orange' },
                { value: 'high', label: 'High', color: 'red' },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value as TaskPriority)}
                  className={`px-4 py-3 border-2 text-xs font-bold uppercase tracking-wide transition-all ${
                    priority === p.value
                      ? `border-${p.color}-600 bg-${p.color}-50 text-${p.color}-900`
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAdvanced ? 'rotate-180' : ''
              }`}
            />
            Advanced Options
          </button>

          {showAdvanced && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2 block">
                  Estimated Time (minutes)
                </label>
                <input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="30"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-600 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2 block">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-600 text-sm transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wide transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Timetable Drawer */}
      {showTimetable && (
        <TimetableDrawer
          onClose={() => setShowTimetable(false)}
          onSelectSlot={handleTimetableSlotSelect}
          currentTaskTime={dueTime}
        />
      )}
    </div>
  );
}