import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Target, BookOpen, Brain, CheckCircle2, Circle, AlertCircle, ChevronRight, Plus, Edit3, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getRevisionPlannerContent,
  type RevisionCalendarEvent,
  type RevisionSession,
  type RevisionTopic,
} from '@/services/subjectResourceService';

interface RevisionPlannerPageProps {
  subject: string;
  onBack: () => void;
  onNavigateToSubject: () => void;
}

export function RevisionPlannerPage({ subject, onBack, onNavigateToSubject }: RevisionPlannerPageProps) {
  const [selectedTab, setSelectedTab] = useState<'schedule' | 'topics' | 'calendar'>('schedule');
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);
  const [revisionSchedule, setRevisionSchedule] = useState<RevisionSession[]>([]);
  const [topicsToRevise, setTopicsToRevise] = useState<RevisionTopic[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<RevisionCalendarEvent[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  const handleCompleteSession = (sessionId: string) => {
    setCompletedSessions(prev => [...prev, sessionId]);
    showMicroFeedback('✓ Revision session completed!');
  };

  useEffect(() => {
    let isMounted = true;

    getRevisionPlannerContent()
      .then((data) => {
        if (!isMounted) return;
        setRevisionSchedule(data.revisionSchedule);
        setTopicsToRevise(data.topicsToRevise);
        setCalendarEvents(data.calendarEvents);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsContentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const dueTodayCount = useMemo(
    () => revisionSchedule.filter((session) => session.scheduledDate.toLowerCase().includes('today')).length,
    [revisionSchedule]
  );
  const weeklyCount = revisionSchedule.length + topicsToRevise.filter((topic) => topic.needsRevision).length;
  const completedCount = completedSessions.length;

  if (isContentLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="p-6 space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      case 'Medium': return { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' };
      case 'Low': return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return { bg: '#D1FAE5', text: '#065F46' };
    if (confidence >= 50) return { bg: '#DBEAFE', text: '#1E3A8A' };
    return { bg: '#FEE2E2', text: '#991B1B' };
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 px-3 py-2 text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent-primary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onNavigateToSubject}
            className="text-sm font-medium hover:underline transition-all"
            style={{ color: 'var(--text-tertiary)' }}
          >
            My Subjects
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <button
            onClick={onNavigateToSubject}
            className="text-sm font-medium hover:underline transition-all"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {subject}
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Revision Planner
          </span>
        </div>

        {/* Title and Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Revision Planner
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Spaced repetition system for optimal retention
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Due Today
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {dueTodayCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                This Week
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {weeklyCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Completed
              </div>
              <div className="text-2xl font-bold" style={{ color: '#10B981' }}>
                {completedCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <div className="px-4 md:px-6 overflow-x-auto whitespace-nowrap">
          <div className="inline-flex min-w-max items-center gap-1">
          <button
            onClick={() => setSelectedTab('schedule')}
            className={`shrink-0 whitespace-nowrap px-4 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all ${
              selectedTab === 'schedule' ? '' : 'opacity-60'
            }`}
            style={{
              borderColor: selectedTab === 'schedule' ? 'var(--accent-primary)' : 'transparent',
              color: selectedTab === 'schedule' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Schedule
          </button>
          <button
            onClick={() => setSelectedTab('topics')}
            className={`shrink-0 whitespace-nowrap px-4 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all ${
              selectedTab === 'topics' ? '' : 'opacity-60'
            }`}
            style={{
              borderColor: selectedTab === 'topics' ? 'var(--accent-primary)' : 'transparent',
              color: selectedTab === 'topics' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Topics ({topicsToRevise.length})
          </button>
          <button
            onClick={() => setSelectedTab('calendar')}
            className={`shrink-0 whitespace-nowrap px-4 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all ${
              selectedTab === 'calendar' ? '' : 'opacity-60'
            }`}
            style={{
              borderColor: selectedTab === 'calendar' ? 'var(--accent-primary)' : 'transparent',
              color: selectedTab === 'calendar' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Calendar
          </button>
          </div>
        </div>
      </div>

      {/* Micro Feedback */}
      {showFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg animate-fadeIn" style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46' }}>
          <span className="text-sm font-semibold">{showFeedback}</span>
        </div>
      )}

      {/* Content */}
      <div className="px-4 md:px-6 py-6">
        {/* Schedule Tab */}
        {selectedTab === 'schedule' && (
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => showMicroFeedback('+ Creating new revision session...')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase hover:opacity-90"
                style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
              >
                <Plus className="w-4 h-4" />
                Add Topic to Revision
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase hover:opacity-90"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Revision Sessions */}
            {revisionSchedule.map((session) => {
              const priorityColors = getPriorityColor(session.priority);
              const confidenceColors = getConfidenceColor(session.confidence);
              const isCompleted = completedSessions.includes(session.id);

              return (
                <div
                  key={session.id}
                  className="p-6 border transition-all"
                  style={{
                    background: isCompleted ? '#F0FDF4' : 'var(--bg-card)',
                    borderColor: isCompleted ? '#10B981' : session.status === 'pending' ? 'var(--accent-primary)' : 'var(--border-soft)',
                    borderWidth: session.status === 'pending' ? '2px' : '1px',
                    opacity: isCompleted ? 0.7 : 1
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" style={{ color: '#10B981' }} />
                      ) : session.status === 'pending' ? (
                        <AlertCircle className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                      ) : (
                        <Circle className="w-6 h-6" style={{ color: 'var(--text-tertiary)' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            {session.topic}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap mb-3">
                            <div
                              className="px-2 py-1 text-xs font-bold uppercase"
                              style={{
                                background: priorityColors.bg,
                                color: priorityColors.text,
                                border: `1px solid ${priorityColors.border}`
                              }}
                            >
                              {session.priority} Priority
                            </div>
                            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <Calendar className="w-4 h-4" />
                              {session.scheduledDate}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <Clock className="w-4 h-4" />
                              {session.duration}
                            </div>
                            <div className="px-2 py-1 text-xs font-bold" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                              Revision #{session.revisionNumber}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-3" style={{ background: 'var(--bg-secondary)' }}>
                          <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                            Last Revised
                          </div>
                          <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {session.lastRevised}
                          </div>
                        </div>
                        <div className="p-3" style={{ background: 'var(--bg-secondary)' }}>
                          <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                            Next Revision
                          </div>
                          <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {session.nextRevision}
                          </div>
                        </div>
                        <div className="p-3" style={{ background: confidenceColors.bg, color: confidenceColors.text }}>
                          <div className="text-xs font-semibold uppercase tracking-wide mb-1">
                            Confidence Level
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.1)' }}>
                              <div
                                className="h-full transition-all duration-500"
                                style={{ width: `${session.confidence}%`, background: 'currentColor' }}
                              />
                            </div>
                            <span className="text-sm font-bold">{session.confidence}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {!isCompleted && (
                          <>
                            <button
                              onClick={() => handleCompleteSession(session.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase hover:opacity-90"
                              style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                            >
                              <Brain className="w-4 h-4" />
                              Start Revision
                            </button>
                            <button
                              onClick={() => showMicroFeedback('→ Rescheduling session...')}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold hover:opacity-90"
                              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                            >
                              <Edit3 className="w-4 h-4" />
                              Reschedule
                            </button>
                          </>
                        )}
                        {isCompleted && (
                          <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#10B981' }}>
                            <CheckCircle2 className="w-5 h-5" />
                            Completed!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Topics Tab */}
        {selectedTab === 'topics' && (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicsToRevise.map((topic) => (
                <div
                  key={topic.id}
                  className="p-5 border transition-all hover:border-blue-400 cursor-pointer"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                        <span>{topic.subtopics} subtopics</span>
                        <span>•</span>
                        <span>Last studied: {topic.lastStudied}</span>
                      </div>
                    </div>
                    {topic.needsRevision && (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#F59E0B' }} />
                    )}
                  </div>

                  {/* Mastery Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                        Mastery Level
                      </span>
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {topic.mastery}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${topic.mastery}%`,
                          background: topic.mastery >= 75 ? '#10B981' : topic.mastery >= 50 ? 'var(--accent-primary)' : '#EF4444'
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showMicroFeedback(`✓ ${topic.title} added to revision schedule`)}
                      className="flex-1 px-3 py-2 text-xs font-bold uppercase hover:opacity-90"
                      style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Add to Schedule
                    </button>
                    <button
                      className="px-3 py-2 text-xs font-bold uppercase hover:opacity-90"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                    >
                      View Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {selectedTab === 'calendar' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-3">
              {calendarEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="p-5 border hover:border-blue-400 transition-all"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 text-center">
                      <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                        {event.date}
                      </div>
                      <div className="text-2xl font-bold mt-1" style={{ color: 'var(--accent-primary)' }}>
                        {event.sessions}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        sessions
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Scheduled Topics
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.topics.map((topic, tidx) => (
                          <span
                            key={tidx}
                            className="px-3 py-1 text-xs font-semibold"
                            style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
