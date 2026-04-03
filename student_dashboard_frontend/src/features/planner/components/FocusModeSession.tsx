import { X, CheckCircle2, Clock, Pause, Play, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Task } from '@/types/Planner';
import { useMotivationTone } from '@/contexts/MotivationToneContext';
import { getMessage } from '@/utils/motivationMessages';

interface FocusModeSessionProps {
  task: Task;
  onComplete: (id: string) => void;
  onExit: () => void;
}

export function FocusModeSession({ task, onComplete, onExit }: FocusModeSessionProps) {
  const { tone } = useMotivationTone();
  const sessionDuration = task.type === 'test' || task.type === 'assignment' ? 45 : 25;
  
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60); // seconds
  const [isPaused, setIsPaused] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [focusStreak, setFocusStreak] = useState(0);

  // Load focus streak from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('towsoth_focus_streak');
    if (stored) {
      setFocusStreak(parseInt(stored));
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isPaused || sessionCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, sessionCompleted]);

  // 5-minute warning
  useEffect(() => {
    if (timeRemaining === 300) {
      // 5 minutes = 300 seconds
      // Show subtle notification (already visible on screen, no popup needed)
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    if (pauseCount < 2) {
      setIsPaused(true);
      setPauseCount(pauseCount + 1);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleSessionComplete = () => {
    setSessionCompleted(true);
    
    // Update focus streak
    const newStreak = focusStreak + 1;
    setFocusStreak(newStreak);
    localStorage.setItem('towsoth_focus_streak', newStreak.toString());

    // Save consistency credit
    const consistencyData = localStorage.getItem('towsoth_consistency_score') || '0';
    const newConsistency = parseInt(consistencyData) + 1;
    localStorage.setItem('towsoth_consistency_score', newConsistency.toString());
  };

  const handleTaskComplete = () => {
    if (!sessionCompleted) {
      handleSessionComplete();
    }
    onComplete(task.id);
    setTimeout(() => {
      onExit();
    }, 2000);
  };

  const handleExit = () => {
    if (sessionCompleted || timeRemaining === 0) {
      onExit();
    } else {
      setShowExitModal(true);
    }
  };

  const confirmExit = () => {
    onExit();
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'study': return '📚';
      case 'assignment': return '📝';
      case 'test': return '🧪';
      case 'deadline': return '⏰';
      case 'personal': return '🎯';
    }
  };

  const timePercent = ((sessionDuration * 60 - timeRemaining) / (sessionDuration * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col">
      {/* Minimalist Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-700">
        <div className="flex items-center gap-6">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Focus Session
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className={`text-lg font-bold ${
              timeRemaining <= 300 ? 'text-orange-400' : 'text-slate-300'
            }`}>
              {formatTime(timeRemaining)}
            </span>
            {timeRemaining <= 300 && timeRemaining > 0 && (
              <span className="text-xs text-orange-400 font-semibold">5 min left</span>
            )}
          </div>
        </div>
        <button
          onClick={handleExit}
          className="p-2 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {sessionCompleted ? (
          <div className="text-center max-w-xl">
            <div className="text-6xl mb-6">✓</div>
            <div className="text-2xl font-bold text-white mb-3">
              Focused session completed
            </div>
            <div className="text-slate-400 mb-2">
              Streak +1
            </div>
            <div className="text-sm text-slate-500 mb-8">
              Consistency credit awarded
            </div>
            <button
              onClick={handleTaskComplete}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-wide transition-colors"
            >
              Mark Task Complete & Exit
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="w-full bg-slate-800 h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 transition-all duration-1000"
                  style={{ width: `${timePercent}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-500 text-right">
                {Math.round(timePercent)}% complete
              </div>
            </div>

            {/* Current Task */}
            <div className="bg-slate-800 border-2 border-slate-700 p-10 mb-8">
              <div className="flex items-start gap-6 mb-8">
                <div className="text-6xl">{getTaskIcon(task.type)}</div>
                <div className="flex-1">
                  {task.subject && (
                    <div className="text-base font-bold text-blue-400 uppercase tracking-wide mb-3">
                      {task.subject}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-white mb-4 leading-tight">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    {task.dueTime && (
                      <span>Due: {task.dueTime}</span>
                    )}
                    {task.estimatedTime && (
                      <span>Est: {task.estimatedTime} min</span>
                    )}
                  </div>
                </div>
              </div>

              {task.notes && (
                <div className="bg-slate-900 border-l-2 border-blue-600 p-5 mb-8">
                  <div className="text-base text-slate-300 leading-relaxed">
                    {task.notes}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleTaskComplete}
                  className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Mark Complete
                </button>
                
                {pauseCount < 2 && (
                  <button
                    onClick={isPaused ? handleResume : handlePause}
                    className="px-6 py-4 border-2 border-slate-600 hover:bg-slate-700 text-slate-300 text-sm font-bold uppercase tracking-wide transition-colors flex items-center gap-2"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause ({2 - pauseCount} left)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Calm Motivational Line */}
            <div className="text-center">
              <div className="text-slate-400 text-base italic">
                {getMessage('focus_completion', tone)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Streak (Bottom Left) */}
      {!sessionCompleted && (
        <div className="absolute bottom-8 left-8 px-4 py-3 bg-slate-800 border border-slate-700">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            Focus Streak
          </div>
          <div className="text-2xl font-bold text-slate-300">
            {focusStreak}
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border-2 border-slate-600 max-w-md w-full p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <div className="text-xl font-bold text-white mb-2">
                  You're building focus consistency
                </div>
                <div className="text-sm text-slate-300 leading-relaxed">
                  Exit now or continue for {Math.ceil(timeRemaining / 60)} more minutes?
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={confirmExit}
                className="flex-1 px-6 py-3 border-2 border-slate-600 hover:bg-slate-700 text-slate-300 text-sm font-bold uppercase tracking-wide transition-colors"
              >
                Exit Now
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase tracking-wide transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-slate-800 border-2 border-slate-600 p-8 text-center">
            <Pause className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <div className="text-xl font-bold text-white mb-2">Session Paused</div>
            <div className="text-sm text-slate-400 mb-6">
              Take a moment, then get back to it
            </div>
            <button
              onClick={handleResume}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase tracking-wide transition-colors"
            >
              Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}