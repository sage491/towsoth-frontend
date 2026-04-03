import { X, CheckCircle2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Task } from '@/types/Planner';

interface FocusModeProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onExit: () => void;
}

export function FocusMode({ tasks, onComplete, onExit }: FocusModeProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const currentTask = pendingTasks[currentTaskIndex];

  const handleComplete = () => {
    if (currentTask) {
      onComplete(currentTask.id);
      if (currentTaskIndex < pendingTasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentTaskIndex < pendingTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'study':
        return '📚';
      case 'assignment':
        return '📝';
      case 'test':
        return '🧪';
      case 'deadline':
        return '⏰';
      case 'personal':
        return '🎯';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Minimalist Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Focus Session
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">{formatTime(timeElapsed)}</span>
          </div>
        </div>
        <button
          onClick={onExit}
          className="p-2 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {pendingTasks.length === 0 ? (
          <div className="text-center">
            <div className="text-6xl mb-6">✓</div>
            <div className="text-2xl font-bold text-white mb-3">
              All tasks completed!
            </div>
            <div className="text-slate-400 mb-8">
              Great work. You've finished everything for today.
            </div>
            <button
              onClick={onExit}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase tracking-wide transition-colors"
            >
              Exit Focus Mode
            </button>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Task Counter */}
            <div className="text-center mb-8">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
                Task {currentTaskIndex + 1} of {pendingTasks.length}
              </div>
              <div className="w-full bg-slate-800 h-1">
                <div
                  className="bg-blue-600 h-1 transition-all duration-300"
                  style={{
                    width: `${((currentTaskIndex + 1) / pendingTasks.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Current Task */}
            {currentTask && (
              <div className="bg-slate-800 border-2 border-slate-700 p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{getTaskIcon(currentTask.type)}</div>
                  <div className="flex-1">
                    {currentTask.subject && (
                      <div className="text-sm font-bold text-blue-400 uppercase tracking-wide mb-2">
                        {currentTask.subject}
                      </div>
                    )}
                    <div className="text-2xl font-bold text-white mb-3">
                      {currentTask.title}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      {currentTask.dueTime && (
                        <span>Due: {currentTask.dueTime}</span>
                      )}
                      {currentTask.estimatedTime && (
                        <span>Est: {currentTask.estimatedTime} min</span>
                      )}
                      <span
                        className={`px-2 py-1 text-xs font-bold uppercase tracking-wide ${
                          currentTask.priority === 'high'
                            ? 'bg-red-900 text-red-300'
                            : currentTask.priority === 'medium'
                            ? 'bg-orange-900 text-orange-300'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {currentTask.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {currentTask.notes && (
                  <div className="bg-slate-900 border-l-2 border-blue-600 p-4 mb-6">
                    <div className="text-sm text-slate-300 leading-relaxed">
                      {currentTask.notes}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleComplete}
                    className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Mark Complete
                  </button>
                  {currentTaskIndex < pendingTasks.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="px-6 py-4 border-2 border-slate-600 hover:bg-slate-700 text-slate-300 text-sm font-bold uppercase tracking-wide transition-colors"
                    >
                      Skip
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Motivational Line */}
            <div className="text-center">
              <div className="text-slate-400 text-sm italic">
                Finish one task. Momentum will follow.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Remaining Tasks Preview */}
      {pendingTasks.length > 1 && (
        <div className="border-t border-slate-700 px-8 py-4 bg-slate-800/50">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">
            Remaining Tasks ({pendingTasks.length - currentTaskIndex - 1})
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {pendingTasks.slice(currentTaskIndex + 1, currentTaskIndex + 5).map((task, _idx) => (
              <div
                key={task.id}
                className="flex-shrink-0 px-4 py-2 bg-slate-700 border border-slate-600 text-xs text-slate-300"
              >
                <div className="font-semibold">
                  {task.subject && `${task.subject} – `}
                  {task.title}
                </div>
              </div>
            ))}
            {pendingTasks.length - currentTaskIndex - 1 > 4 && (
              <div className="flex-shrink-0 px-4 py-2 text-xs text-slate-500">
                +{pendingTasks.length - currentTaskIndex - 5} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
