import { useState, useEffect } from 'react';
import { Play, Pause, Target, ChevronDown, ChevronRight, CheckCircle, Brain, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getLearningPathContent, type LearningPathInsight, type LearningPathModule } from '@/services/subjectResourceService';

interface LearningPathProps {
  courseTitle: string;
  courseCode: string;
}

export function LearningPath({ courseTitle, courseCode: _courseCode }: LearningPathProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [currentModuleExpanded, setCurrentModuleExpanded] = useState(true);
  const [modules, setModules] = useState<LearningPathModule[]>([]);
  const [aiInsight, setAiInsight] = useState<LearningPathInsight | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);

  // Study session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    let isMounted = true;

    getLearningPathContent()
      .then((data) => {
        if (!isMounted) return;
        setModules(data.modules);
        setAiInsight(data.aiInsight);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsContentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentModule = modules.find(m => m.status === 'current');
  const nextModule = modules.find(m => m.status === 'locked');

  if (isContentLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-[360px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{ 
        background: focusMode ? '#FAFAFA' : 'var(--bg-secondary)',
      }}
    >
      {/* Persistent Study Panel - Sticky */}
      <div 
        className="sticky top-0 z-30 px-6 py-4"
        style={{ 
          background: focusMode ? '#FFFFFF' : 'var(--bg-card)',
          borderBottom: `1px solid ${focusMode ? '#E5E7EB' : 'var(--border-soft)'}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between">
            {/* Course Info */}
            <div>
              <div className="text-xs uppercase tracking-wide font-semibold mb-1" 
                style={{ color: focusMode ? '#9CA3AF' : 'var(--text-tertiary)' }}>
                Learning Path
              </div>
              <h1 className="text-xl font-bold" 
                style={{ color: focusMode ? '#111827' : 'var(--text-primary)' }}>
                {courseTitle}
              </h1>
            </div>

            {/* Study Timer */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" 
                  style={{ color: focusMode ? '#9CA3AF' : 'var(--text-tertiary)' }}>
                  Session Time
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold" 
                    style={{ 
                      color: focusMode ? '#111827' : 'var(--text-primary)',
                      fontFamily: 'monospace'
                    }}>
                    {formatTime(studyTimer)}
                  </div>
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="p-2 transition-all duration-200"
                    style={{
                      background: timerActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      border: '1px solid',
                      borderColor: timerActive ? 'var(--accent-primary)' : 'var(--border-medium)',
                    }}
                  >
                    {timerActive ? (
                      <Pause className="w-4 h-4" style={{ color: '#ffffff' }} />
                    ) : (
                      <Play className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" 
                  style={{ color: focusMode ? '#9CA3AF' : 'var(--text-tertiary)' }}>
                  Progress
                </div>
                <div className="text-2xl font-bold" 
                  style={{ color: focusMode ? '#111827' : 'var(--accent-primary)' }}>
                  {currentModule?.progress}%
                </div>
              </div>

              {/* Focus Mode Toggle */}
              <button
                onClick={() => setFocusMode(!focusMode)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-all duration-200"
                style={{
                  background: focusMode ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: focusMode ? '#ffffff' : 'var(--text-primary)',
                  border: '1px solid',
                  borderColor: focusMode ? 'var(--accent-primary)' : 'var(--border-medium)',
                }}
              >
                <Target className="w-4 h-4" />
                Focus {focusMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div 
              className="w-full h-2"
              style={{ background: focusMode ? '#E5E7EB' : 'var(--bg-secondary)' }}
            >
              <div
                className="h-2 transition-all duration-300"
                style={{ 
                  width: `${currentModule?.progress}%`,
                  background: 'var(--accent-primary)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Single Column, Linear */}
      <div className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
        {/* Session Intelligence - Only show if not focus mode */}
        {!focusMode && aiInsight && (
          <div 
            className="px-4 py-3 flex items-start gap-3"
            style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
            }}
          >
            <Brain className="w-5 h-5 flex-shrink-0" style={{ color: '#3B82F6' }} />
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#1E40AF' }}>
                AI Study Insight
              </div>
              <p className="text-sm" style={{ color: '#1E3A8A' }}>
                {aiInsight.message}
              </p>
            </div>
          </div>
        )}

        {/* Current Module - Expanded */}
        {currentModule && (
          <div 
            style={{ 
              background: focusMode ? '#FFFFFF' : 'var(--bg-card)',
              border: '2px solid',
              borderColor: focusMode ? '#D1D5DB' : 'var(--accent-primary)',
            }}
          >
            {/* Module Header */}
            <div 
              className="px-6 py-4"
              style={{ 
                borderBottom: `1px solid ${focusMode ? '#E5E7EB' : 'var(--border-soft)'}`,
                background: focusMode ? '#F9FAFB' : 'var(--accent-soft)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-1"
                      style={{ 
                        background: 'var(--accent-primary)', 
                        color: '#ffffff' 
                      }}
                    >
                      Current Module
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {currentModule.lessons} lessons • {currentModule.duration}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mb-1" 
                    style={{ color: focusMode ? '#111827' : 'var(--text-primary)' }}>
                    {currentModule.title}
                  </h2>
                  <p className="text-sm" 
                    style={{ color: focusMode ? '#6B7280' : 'var(--text-secondary)' }}>
                    Module {currentModule.id} of {modules.length}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentModuleExpanded(!currentModuleExpanded)}
                  className="p-2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {currentModuleExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Current Lesson Info */}
              {currentModuleExpanded && (
                <div 
                  className="p-4 flex items-center justify-between"
                  style={{
                    background: focusMode ? '#FFFFFF' : 'var(--bg-card)',
                    border: '1px solid',
                    borderColor: focusMode ? '#D1D5DB' : 'var(--border-medium)',
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Play className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                      <span className="text-xs font-semibold uppercase tracking-wide" 
                        style={{ color: 'var(--text-tertiary)' }}>
                        Now Playing
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-1" 
                      style={{ color: focusMode ? '#111827' : 'var(--text-primary)' }}>
                      {currentModule.currentLesson}
                    </h3>
                    <div className="flex items-center gap-3 text-xs" 
                      style={{ color: focusMode ? '#6B7280' : 'var(--text-secondary)' }}>
                      <span>{currentModule.currentLessonDuration}</span>
                      <span>•</span>
                      <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                        {currentModule.remainingTime}
                      </span>
                    </div>
                  </div>
                  <button
                    className="px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-200"
                    style={{
                      background: 'var(--accent-primary)',
                      color: '#ffffff',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Continue Learning
                  </button>
                </div>
              )}
            </div>

            {/* Module Progress Details - Only if expanded */}
            {currentModuleExpanded && (
              <div className="px-6 py-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    className="p-4 text-center"
                    style={{ 
                      background: focusMode ? '#F9FAFB' : 'var(--bg-secondary)',
                      border: '1px solid',
                      borderColor: focusMode ? '#E5E7EB' : 'var(--border-soft)',
                    }}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" 
                      style={{ color: focusMode ? '#9CA3AF' : 'var(--text-tertiary)' }}>
                      Completed
                    </div>
                    <div className="text-2xl font-bold" 
                      style={{ color: focusMode ? '#111827' : 'var(--text-primary)' }}>
                      3/7
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      lessons
                    </div>
                  </div>

                  <div 
                    className="p-4 text-center"
                    style={{ 
                      background: focusMode ? '#F9FAFB' : 'var(--bg-secondary)',
                      border: '1px solid',
                      borderColor: focusMode ? '#E5E7EB' : 'var(--border-soft)',
                    }}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" 
                      style={{ color: focusMode ? '#9CA3AF' : 'var(--text-tertiary)' }}>
                      Time Spent
                    </div>
                    <div className="text-2xl font-bold" 
                      style={{ color: focusMode ? '#111827' : 'var(--text-primary)' }}>
                      1h 42m
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      this module
                    </div>
                  </div>

                  <div 
                    className="p-4 text-center"
                    style={{ 
                      background: focusMode ? '#F9FAFB' : 'var(--bg-secondary)',
                      border: '1px solid',
                      borderColor: focusMode ? '#E5E7EB' : 'var(--border-soft)',
                    }}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" 
                      style={{ color: focusMode ? '#9CA3AF' : 'var(--text-tertiary)' }}>
                      Remaining
                    </div>
                    <div className="text-2xl font-bold" 
                      style={{ color: 'var(--accent-primary)' }}>
                      2h 3m
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      estimated
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next Module - Collapsed Preview */}
        {nextModule && !focusMode && (
          <div 
            style={{ 
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              opacity: 0.7,
            }}
          >
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wide px-2 py-1"
                    style={{ 
                      background: 'var(--bg-secondary)', 
                      color: 'var(--text-tertiary)' 
                    }}
                  >
                    Next Module
                  </span>
                </div>
                <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {nextModule.title}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {nextModule.prerequisite}
                </p>
              </div>
              <div 
                className="px-3 py-1.5 text-xs font-semibold"
                style={{ 
                  background: '#FEE2E2', 
                  color: '#991B1B' 
                }}
              >
                Locked
              </div>
            </div>
          </div>
        )}

        {/* Completed Module - Collapsed */}
        {!focusMode && modules[0].status === 'completed' && (
          <div 
            style={{ 
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              opacity: 0.6,
            }}
          >
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
                  <span className="text-xs font-semibold uppercase tracking-wide" 
                    style={{ color: '#10B981' }}>
                    Completed
                  </span>
                </div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  {modules[0].title}
                </h3>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
            </div>
          </div>
        )}

        {/* Study Tips - Only show if not focus mode */}
        {!focusMode && (
          <div 
            className="px-6 py-4"
            style={{
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
            }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#D97706' }} />
              <div>
                <div className="text-xs font-bold mb-1" style={{ color: '#92400E' }}>
                  Study Tip
                </div>
                <p className="text-sm" style={{ color: '#78350F' }}>
                  Focus Mode removes all distractions and shows only your current lesson. Toggle it when you're ready for deep work.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
