import { Brain, Play, Zap, TrendingUp, Clock, ChevronRight, Target, BookOpen, Award, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getLearningHubData } from '@/services/subjectService';
import type { LearningHubData } from '@/services/subjectService';
import type { NavigateToRoute } from '@/shared/config/routes';

interface LearningHubPageProps {
  onNavigate: NavigateToRoute;
}

export function LearningHubPage({ onNavigate }: LearningHubPageProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [hubData, setHubData] = useState<LearningHubData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const handleQuickAction = (action: string) => {
    setLoadingAction(action);
    setTimeout(() => {
      setLoadingAction(null);
      if (action === 'study') onNavigate?.('my-subjects');
      if (action === 'practice') onNavigate?.('tests-guidelines');
      if (action === 'revision') onNavigate?.('revision-plan');
      if (action === 'mock') onNavigate?.('tests-guidelines');
    }, 800);
  };

  const handleContinue = (_courseId: number) => {
    onNavigate?.('my-subjects');
  };

  const handleStartCourse = (_courseId: number) => {
    onNavigate?.('my-subjects');
  };

  const continueRef = useRef<HTMLDivElement>(null);
  const recommendedRef = useRef<HTMLDivElement>(null);
  const revisionRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    getLearningHubData()
      .then((data) => {
        if (!isMounted) return;
        setHubData(data);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoadingData(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const aiSuggestion = hubData?.aiSuggestion;
  const continueLearning = hubData?.continueLearning ?? [];
  const recommendedForYou = hubData?.recommendedForYou ?? [];
  const revisionBoost = hubData?.revisionBoost ?? [];
  const practiceNow = hubData?.practiceNow ?? [];
  const quickResources = hubData?.quickResources ?? [];

  if (isLoadingData || !aiSuggestion) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1600px] mx-auto">
        {/* AI Decision Header - PRIMARY FOCUS */}
        <div 
          className="p-8"
          style={{ 
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-hover) 100%)',
          }}
        >
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-6 h-6 text-white" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-white/80">
                AI Study Suggestion
              </h2>
            </div>
            
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {aiSuggestion.title}
                </h1>
                <p className="text-base text-white/90 mb-1">
                  {aiSuggestion.subtitle}
                </p>
                <p className="text-sm text-white/70">
                  {aiSuggestion.reason}
                </p>
              </div>
              
              <button
                onClick={() => handleContinue(3)}
                className="px-8 py-4 text-base font-bold uppercase tracking-wide transition-all duration-200 flex items-center gap-3"
                style={{
                  background: '#ffffff',
                  color: 'var(--accent-primary)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
              >
                <Play className="w-5 h-5" />
                {aiSuggestion.action}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="px-8 py-6" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-soft)' }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleQuickAction('study')}
                disabled={loadingAction === 'study'}
                className="p-4 flex flex-col items-center gap-2 transition-all duration-200"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-medium)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.background = 'var(--accent-soft)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
              >
                <Clock className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {loadingAction === 'study' ? 'Loading...' : 'Start 30min Study'}
                </span>
              </button>

              <button
                onClick={() => handleQuickAction('practice')}
                disabled={loadingAction === 'practice'}
                className="p-4 flex flex-col items-center gap-2 transition-all duration-200"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-medium)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.background = 'var(--accent-soft)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
              >
                <Target className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {loadingAction === 'practice' ? 'Loading...' : 'Practice Weak Topics'}
                </span>
              </button>

              <button
                onClick={() => handleQuickAction('revision')}
                disabled={loadingAction === 'revision'}
                className="p-4 flex flex-col items-center gap-2 transition-all duration-200"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-medium)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.background = 'var(--accent-soft)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
              >
                <RefreshCw className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {loadingAction === 'revision' ? 'Loading...' : 'Quick Revision'}
                </span>
              </button>

              <button
                onClick={() => handleQuickAction('mock')}
                disabled={loadingAction === 'mock'}
                className="p-4 flex flex-col items-center gap-2 transition-all duration-200"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-medium)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.background = 'var(--accent-soft)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
              >
                <Award className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {loadingAction === 'mock' ? 'Loading...' : 'Mock Test'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Horizontal Zones */}
        <div className="p-8 space-y-8">
          {/* Continue Learning */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Continue Learning
                </h2>
              </div>
              <button
                onClick={() => onNavigate?.('my-subjects')}
                className="text-sm font-semibold flex items-center gap-1"
                style={{ color: 'var(--accent-primary)' }}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div 
              ref={continueRef}
              className="flex gap-4 overflow-x-auto pb-4"
              style={{ scrollbarWidth: 'none' }}
            >
              {continueLearning.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 w-[280px] p-5 cursor-pointer transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                  }}
                  onClick={() => handleContinue(course.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-border)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-1"
                      style={{ 
                        background: 'var(--accent-soft)', 
                        color: 'var(--accent-primary)' 
                      }}
                    >
                      {course.subject}
                    </span>
                    <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
                      {course.progress}%
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {course.title}
                  </h3>
                  
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Last: {course.lastTopic}
                  </p>

                  <div 
                    className="w-full h-1.5 mb-3"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <div
                      className="h-1.5 transition-all"
                      style={{ 
                        width: `${course.progress}%`,
                        background: 'var(--accent-primary)',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--text-tertiary)' }}>
                      {course.timeLeft} remaining
                    </span>
                    <ChevronRight className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended For You */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Recommended For You
                </h2>
              </div>
            </div>

            <div 
              ref={recommendedRef}
              className="flex gap-4 overflow-x-auto pb-4"
              style={{ scrollbarWidth: 'none' }}
            >
              {recommendedForYou.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 w-[280px] p-5 cursor-pointer transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                  }}
                  onClick={() => handleStartCourse(course.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-border)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-1"
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        color: 'var(--text-tertiary)' 
                      }}
                    >
                      {course.subject}
                    </span>
                    <span 
                      className="text-[10px] font-bold uppercase px-2 py-1"
                      style={{
                        background: course.difficulty === 'Advanced' ? '#FEE2E2' : '#FED7AA',
                        color: course.difficulty === 'Advanced' ? '#991B1B' : '#9A3412',
                      }}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {course.title}
                  </h3>
                  
                  <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {course.reason}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {course.duration}
                    </span>
                    <span 
                      className="text-xs font-bold"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Start Course →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revision Boost */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Revision Boost
                </h2>
              </div>
            </div>

            <div 
              ref={revisionRef}
              className="flex gap-4 overflow-x-auto pb-4"
              style={{ scrollbarWidth: 'none' }}
            >
              {revisionBoost.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[280px] p-5 cursor-pointer transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '2px solid',
                    borderColor: item.urgency === 'High' ? '#EF4444' : 
                                 item.urgency === 'Medium' ? '#F59E0B' : 'var(--border-soft)',
                  }}
                  onClick={() => onNavigate?.('revision-plan')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-1"
                      style={{ 
                        background: item.urgency === 'High' ? '#FEE2E2' : 
                                   item.urgency === 'Medium' ? '#FED7AA' : '#D1FAE5',
                        color: item.urgency === 'High' ? '#991B1B' : 
                               item.urgency === 'Medium' ? '#9A3412' : '#065F46',
                      }}
                    >
                      {item.urgency} Priority
                    </span>
                    <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>
                      {item.accuracy}%
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Last studied: {item.lastStudied}
                  </p>

                  <button
                    className="w-full py-2 text-xs font-bold uppercase tracking-wide"
                    style={{
                      background: 'var(--accent-primary)',
                      color: '#ffffff',
                    }}
                  >
                    Revise Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Now */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Practice Now
                </h2>
              </div>
            </div>

            <div 
              ref={practiceRef}
              className="flex gap-4 overflow-x-auto pb-4"
              style={{ scrollbarWidth: 'none' }}
            >
              {practiceNow.map((practice) => (
                <div
                  key={practice.id}
                  className="flex-shrink-0 w-[280px] p-5 cursor-pointer transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                  }}
                  onClick={() => onNavigate?.('tests-guidelines')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-border)';
                    e.currentTarget.style.background = 'var(--accent-soft)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-1"
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        color: 'var(--text-tertiary)' 
                      }}
                    >
                      {practice.questions} Questions
                    </span>
                    <Clock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  
                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {practice.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {practice.difficulty} • {practice.duration}
                    </span>
                    <span 
                      className="font-bold"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Start →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Resources */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Quick Resources
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickResources.map((resource) => (
                <div
                  key={resource.id}
                  className="p-4 cursor-pointer transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-border)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                  }}
                >
                  <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {resource.title}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {resource.type} • {resource.size || resource.duration}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
