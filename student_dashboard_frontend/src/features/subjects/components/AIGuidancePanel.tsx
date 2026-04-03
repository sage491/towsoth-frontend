import { Brain, TrendingUp, Target, Zap, Clock, Award, AlertCircle, BookOpen, FileQuestion } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAIGuidanceRecommendations, type AIGuidanceRecommendation } from '@/services/subjectResourceService';

interface AIGuidanceStudentData {
  recentAccuracy: number;
  studyStreak: number;
  weakTopicsCount: number;
  upcomingTests: number;
  completedToday: number;
}

interface AIGuidancePanelProps {
  studentData: AIGuidanceStudentData;
  onActionClick: (action: string) => void;
}

export function AIGuidancePanel({ studentData, onActionClick }: AIGuidancePanelProps) {
  const [smartRecommendations, setSmartRecommendations] = useState<AIGuidanceRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  // AI determines the most important next action based on student data
  const determineNextAction = () => {
    if (studentData.weakTopicsCount > 2) {
      return {
        type: 'urgent',
        icon: AlertCircle,
        title: 'Fix Weak Topics First',
        description: `You have ${studentData.weakTopicsCount} topics with low accuracy. Addressing these now will significantly boost your performance.`,
        action: 'fix-weak-topics',
        actionLabel: 'Fix Now',
        color: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', icon: '#EF4444' }
      };
    }

    if (studentData.upcomingTests > 0 && studentData.upcomingTests <= 3) {
      return {
        type: 'important',
        icon: Target,
        title: 'Test Preparation Required',
        description: `You have ${studentData.upcomingTests} test${studentData.upcomingTests > 1 ? 's' : ''} coming up. Start focused revision now.`,
        action: 'start-test-prep',
        actionLabel: 'Prepare Now',
        color: { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74', icon: '#F97316' }
      };
    }

    if (studentData.recentAccuracy < 60) {
      return {
        type: 'important',
        icon: TrendingUp,
        title: 'Practice More Problems',
        description: `Your recent accuracy is ${studentData.recentAccuracy}%. Practice sessions will help solidify concepts.`,
        action: 'start-practice',
        actionLabel: 'Practice Now',
        color: { bg: '#DBEAFE', text: '#1E3A8A', border: '#BFDBFE', icon: '#3B82F6' }
      };
    }

    if (studentData.completedToday === 0) {
      return {
        type: 'reminder',
        icon: Brain,
        title: 'Start Your Learning Session',
        description: 'Begin with a focused 25-minute learning session. Consistency builds mastery.',
        action: 'start-learning',
        actionLabel: 'Start Learning',
        color: { bg: '#E9D5FF', text: '#6B21A8', border: '#D8B4FE', icon: '#9333EA' }
      };
    }

    return {
      type: 'motivational',
      icon: Award,
      title: 'You\'re On Track!',
      description: 'Great progress today. Continue with revision to maintain your streak.',
      action: 'continue-revision',
      actionLabel: 'Continue',
      color: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0', icon: '#10B981' }
    };
  };

  const nextAction = determineNextAction();
  const Icon = nextAction.icon;

  useEffect(() => {
    let isMounted = true;
    setIsLoadingRecommendations(true);

    getAIGuidanceRecommendations(studentData.weakTopicsCount)
      .then((data) => {
        if (!isMounted) return;
        setSmartRecommendations(data);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoadingRecommendations(false);
      });

    return () => {
      isMounted = false;
    };
  }, [studentData.weakTopicsCount]);

  const recommendationIconMap = {
    AlertCircle,
    BookOpen,
    FileQuestion,
  } as const;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      case 'medium': return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' };
      case 'low': return { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Main AI Recommendation */}
      <div
        className="p-6 border-2"
        style={{
          background: nextAction.color.bg,
          borderColor: nextAction.color.border
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.5)' }}
            >
              <Icon className="w-6 h-6" style={{ color: nextAction.color.icon }} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" style={{ color: nextAction.color.icon }} />
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: nextAction.color.text }}>
                AI Recommended Next Action
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: nextAction.color.text }}>
              {nextAction.title}
            </h3>
            <p className="text-sm mb-4" style={{ color: nextAction.color.text }}>
              {nextAction.description}
            </p>
            <button
              onClick={() => onActionClick(nextAction.action)}
              className="px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-all"
              style={{
                background: nextAction.color.icon,
                color: '#ffffff'
              }}
            >
              {nextAction.actionLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Smart Recommendations List */}
      <div>
        <div className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>
          Other Recommendations
        </div>
        {isLoadingRecommendations ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
        <div className="space-y-3">
          {smartRecommendations.map((rec) => {
            const priorityColors = getPriorityColor(rec.priority);
            const RecIcon = recommendationIconMap[rec.iconName];
            return (
              <button
                key={rec.id}
                onClick={() => onActionClick(rec.action)}
                className="w-full p-4 border text-left hover:border-blue-400 transition-all"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${rec.color}20` }}
                  >
                    <RecIcon className="w-5 h-5" style={{ color: rec.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {rec.title}
                      </h4>
                      <span
                        className="px-2 py-0.5 text-xs font-bold uppercase"
                        style={{
                          background: priorityColors.bg,
                          color: priorityColors.text,
                          border: `1px solid ${priorityColors.border}`
                        }}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <Clock className="w-3 h-3" />
                      <span>{rec.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        )}
      </div>

      {/* Learning Insights */}
      <div className="p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Today's Learning Insights
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3" style={{ background: 'var(--bg-secondary)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {studentData.studyStreak}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Day Streak
            </div>
          </div>
          <div className="text-center p-3" style={{ background: 'var(--bg-secondary)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {studentData.completedToday}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Completed Today
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
