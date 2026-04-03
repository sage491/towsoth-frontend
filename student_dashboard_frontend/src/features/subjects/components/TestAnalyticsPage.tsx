import { TestResults } from './EnterpriseTestWindow';
import { TrendingUp, Target, Clock, AlertCircle, Brain, Play, RotateCcw, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getTestAnalyticsResourcesForTopic, type TestAnalyticsNote, type TestAnalyticsVideo } from '@/services/subjectResourceService';

interface TestAnalyticsPageProps {
  results: TestResults;
  onBack: () => void;
  onRetakeTest: () => void;
  onReviewAnswers: () => void;
  onStartPractice: () => void;
}

export function TestAnalyticsPage({ results, onBack: _onBack, onRetakeTest, onReviewAnswers, onStartPractice }: TestAnalyticsPageProps) {
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [learningResources, setLearningResources] = useState<Array<{
    topic: string;
    percentage: number;
    isWeak: boolean;
    needsImprovement: boolean;
    videos: TestAnalyticsVideo[];
    notes: TestAnalyticsNote[];
  }>>([]);
  const [isResourceLoading, setIsResourceLoading] = useState(true);

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceLevel = (percentage: number): { level: string; color: string } => {
    if (percentage >= 90) return { level: 'EXCEPTIONAL', color: '#111827' };
    if (percentage >= 75) return { level: 'PROFICIENT', color: '#374151' };
    if (percentage >= 60) return { level: 'DEVELOPING', color: '#6B7280' };
    if (percentage >= 40) return { level: 'NEEDS WORK', color: '#9CA3AF' };
    return { level: 'CRITICAL', color: '#111827' };
  };

  const performance = getPerformanceLevel(results.percentage);

  const topicPerformance = results.questions.reduce((acc, question, index) => {
    const topic = question.topic;
    if (!acc[topic]) {
      acc[topic] = { total: 0, correct: 0, questions: [] };
    }
    acc[topic].total++;
    if (results.answers[index].selectedAnswer === question.correctAnswer) {
      acc[topic].correct++;
    }
    acc[topic].questions.push({ question, answer: results.answers[index], index });
    return acc;
  }, {} as Record<string, { total: number; correct: number; questions: any[] }>);

  const difficultyPerformance = results.questions.reduce((acc, question, index) => {
    const diff = question.difficulty;
    if (!acc[diff]) {
      acc[diff] = { total: 0, correct: 0 };
    }
    acc[diff].total++;
    if (results.answers[index].selectedAnswer === question.correctAnswer) {
      acc[diff].correct++;
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  const recommendations = [];
  const weakTopics = Object.entries(topicPerformance)
    .filter(([_, data]) => (data.correct / data.total) < 0.6)
    .map(([topic, _]) => topic);

  if (weakTopics.length > 0) {
    recommendations.push({
      id: 'weak-topics',
      icon: AlertCircle,
      priority: 'CRITICAL',
      title: 'Critical Knowledge Gaps',
      description: `Performance below threshold in ${weakTopics.length} topic${weakTopics.length > 1 ? 's' : ''}. Immediate intervention required.`,
      topics: weakTopics
    });
  }

  const hardQuestions = difficultyPerformance['Hard'];
  if (hardQuestions && (hardQuestions.correct / hardQuestions.total) < 0.5) {
    recommendations.push({
      id: 'hard-questions',
      icon: Brain,
      priority: 'HIGH',
      title: 'Advanced Problem Solving',
      description: `${Math.round((hardQuestions.correct / hardQuestions.total) * 100)}% accuracy on complex problems. Requires enhanced practice protocols.`,
      topics: []
    });
  }

  const avgTimePerQuestion = results.timeTaken / results.totalQuestions;
  if (avgTimePerQuestion > 120) {
    recommendations.push({
      id: 'time-management',
      icon: Clock,
      priority: 'MEDIUM',
      title: 'Execution Velocity',
      description: `Average response time: ${Math.round(avgTimePerQuestion)}s per question. Optimization required.`,
      topics: []
    });
  }

  if (results.percentage >= 80) {
    recommendations.push({
      id: 'advance',
      icon: TrendingUp,
      priority: 'ADVANCEMENT',
      title: 'Performance Threshold Exceeded',
      description: 'Qualified for advanced curriculum progression. Consider elevated difficulty protocols.',
      topics: []
    });
  }

  useEffect(() => {
    let isMounted = true;

    const loadResources = async () => {
      const entries = Object.entries(topicPerformance);
      const built = await Promise.all(
        entries.map(async ([topic, data]) => {
          const percentage = (data.correct / data.total) * 100;
          const isWeak = percentage < 60;
          const needsImprovement = percentage < 80;
          const resourcePack = await getTestAnalyticsResourcesForTopic(topic, isWeak);

          return {
            topic,
            percentage,
            isWeak,
            needsImprovement,
            videos: resourcePack.videos,
            notes: resourcePack.notes,
          };
        })
      );

      if (!isMounted) return;
      setLearningResources(built.filter((resource) => resource.needsImprovement));
      setIsResourceLoading(false);
    };

    setIsResourceLoading(true);
    loadResources();

    return () => {
      isMounted = false;
    };
  }, [results]);

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      {showFeedback && (
        <div 
          className="fixed top-20 right-6 z-50 px-3 py-1.5 text-[10px] font-medium border"
          style={{ 
            background: '#FFFFFF', 
            borderColor: '#111827',
            color: '#111827'
          }}
        >
          {showFeedback}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Recent Test Results</h1>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: '#111827', letterSpacing: '-0.01em' }}>
          {results.subject}
        </h1>
        <div className="text-xs font-medium" style={{ color: '#6B7280' }}>
          {results.topic}
        </div>
      </div>

      <div 
        className="p-6 mb-4 border"
        style={{
          background: '#FFFFFF',
          borderColor: '#E5E7EB'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#9CA3AF' }}>
              Overall Score
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <div className="text-4xl font-bold tracking-tight" style={{ color: '#111827' }}>
                {results.percentage.toFixed(1)}
              </div>
              <div className="text-lg font-medium" style={{ color: '#9CA3AF' }}>
                / 100
              </div>
            </div>
            <div 
              className="h-0.5 mb-3"
              style={{ background: '#F3F4F6' }}
            >
              <div 
                className="h-full transition-all duration-700"
                style={{ 
                  width: `${results.percentage}%`,
                  background: '#111827'
                }}
              />
            </div>
            <div className="text-[9px] font-medium uppercase tracking-[0.08em]" style={{ color: '#6B7280' }}>
              {performance.level}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: '#9CA3AF' }}>
                Correct
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: '#111827' }}>
                {results.correct}
              </div>
              <div className="text-[10px] font-medium" style={{ color: '#6B7280' }}>
                of {results.totalQuestions}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: '#9CA3AF' }}>
                Incorrect
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: '#111827' }}>
                {results.incorrect}
              </div>
              <div className="text-[10px] font-medium" style={{ color: '#6B7280' }}>
                missed
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: '#9CA3AF' }}>
                Time
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: '#111827' }}>
                {formatTime(results.timeTaken)}
              </div>
              <div className="text-[10px] font-medium" style={{ color: '#6B7280' }}>
                duration
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: '#9CA3AF' }}>
                Avg/Question
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: '#111827' }}>
                {Math.round(results.timeTaken / results.totalQuestions)}s
              </div>
              <div className="text-[10px] font-medium" style={{ color: '#6B7280' }}>
                per question
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: '#E5E7EB' }}>
          <button
            onClick={() => {
              showMicroFeedback('Loading detailed solutions');
              onReviewAnswers();
            }}
            className="p-4 text-left hover:bg-opacity-90 transition-all group"
            style={{ background: '#FFFFFF' }}
          >
            <FileText className="w-4 h-4 mb-2" style={{ color: '#111827' }} />
            <div className="text-xs font-bold mb-0.5" style={{ color: '#111827' }}>
              Review Solutions
            </div>
            <div className="text-[10px] font-medium" style={{ color: '#6B7280' }}>
              Complete answer breakdown
            </div>
          </button>

          <button
            onClick={() => {
              showMicroFeedback('Preparing test instance');
              onRetakeTest();
            }}
            className="p-4 text-left hover:bg-opacity-90 transition-all group"
            style={{ background: '#FFFFFF' }}
          >
            <RotateCcw className="w-4 h-4 mb-2" style={{ color: '#111827' }} />
            <div className="text-xs font-bold mb-0.5" style={{ color: '#111827' }}>
              Retake Assessment
            </div>
            <div className="text-[10px] font-medium" style={{ color: '#6B7280' }}>
              New question set
            </div>
          </button>

          <button
            onClick={() => {
              showMicroFeedback('Initializing practice mode');
              onStartPractice();
            }}
            className="p-4 text-left hover:bg-opacity-90 transition-all group"
            style={{ background: '#111827' }}
          >
            <Target className="w-4 h-4 mb-2" style={{ color: '#FFFFFF' }} />
            <div className="text-xs font-bold mb-0.5" style={{ color: '#FFFFFF' }}>
              Targeted Practice
            </div>
            <div className="text-[10px] font-medium" style={{ color: '#D1D5DB' }}>
              Focus weak areas
            </div>
          </button>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#9CA3AF' }}>
            System Recommendations
          </div>
          <div 
            className="border divide-y"
            style={{ 
              background: '#FFFFFF',
              borderColor: '#E5E7EB'
            }}
          >
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div className="flex items-start gap-3">
                    <rec.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#111827' }} />
                    <div>
                      <div className="text-xs font-bold mb-1" style={{ color: '#111827' }}>
                        {rec.title}
                      </div>
                      <div className="text-[10px] font-medium leading-relaxed max-w-2xl" style={{ color: '#6B7280' }}>
                        {rec.description}
                      </div>
                      {rec.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {rec.topics.map((topic, idx) => (
                            <span 
                              key={idx}
                              className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] border"
                              style={{ 
                                background: '#FAFAFA',
                                borderColor: '#E5E7EB',
                                color: '#111827'
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div 
                    className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] border flex-shrink-0"
                    style={{ 
                      background: rec.priority === 'CRITICAL' ? '#111827' : '#FAFAFA',
                      borderColor: '#E5E7EB',
                      color: rec.priority === 'CRITICAL' ? '#FFFFFF' : '#6B7280'
                    }}
                  >
                    {rec.priority}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#9CA3AF' }}>
            Topic Performance Matrix
          </div>
          <div 
            className="border"
            style={{
              background: '#FFFFFF',
              borderColor: '#E5E7EB'
            }}
          >
            <div className="divide-y">
              {Object.entries(topicPerformance)
                .sort(([, a], [, b]) => (a.correct / a.total) - (b.correct / b.total))
                .map(([topic, data]) => {
                  const percentage = (data.correct / data.total) * 100;

                  return (
                    <div key={topic} className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-[11px] font-bold mb-0.5" style={{ color: '#111827' }}>
                            {topic}
                          </div>
                          <div className="text-[9px] font-medium" style={{ color: '#9CA3AF' }}>
                            {data.correct} / {data.total} correct
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold" style={{ color: '#111827' }}>
                            {percentage.toFixed(0)}%
                          </div>
                          {percentage < 60 && (
                            <div 
                              className="text-[8px] font-bold uppercase tracking-[0.1em] mt-0.5"
                              style={{ color: '#EF4444' }}
                            >
                              CRITICAL
                            </div>
                          )}
                        </div>
                      </div>
                      <div 
                        className="h-0.5"
                        style={{ background: '#F3F4F6' }}
                      >
                        <div 
                          className="h-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            background: percentage >= 80 ? '#111827' : percentage >= 60 ? '#6B7280' : '#9CA3AF'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#9CA3AF' }}>
            Difficulty Distribution
          </div>
          <div 
            className="border divide-y"
            style={{
              background: '#FFFFFF',
              borderColor: '#E5E7EB'
            }}
          >
            {['Easy', 'Medium', 'Hard'].map((difficulty) => {
              const data = difficultyPerformance[difficulty];
              if (!data) return null;

              const percentage = (data.correct / data.total) * 100;

              return (
                <div key={difficulty} className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-[11px] font-bold mb-0.5" style={{ color: '#111827' }}>
                        {difficulty}
                      </div>
                      <div className="text-[9px] font-medium" style={{ color: '#9CA3AF' }}>
                        {data.correct} / {data.total} correct
                      </div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: '#111827' }}>
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                  <div 
                    className="h-0.5"
                    style={{ background: '#F3F4F6' }}
                  >
                    <div 
                      className="h-full"
                      style={{ 
                        width: `${percentage}%`,
                        background: '#111827'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isResourceLoading && (
        <div className="space-y-3 mb-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!isResourceLoading && learningResources.length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#9CA3AF' }}>
            Prescribed Learning Resources
          </div>
          
          <div className="space-y-4">
            {learningResources.map((resource, idx) => (
              <div 
                key={idx}
                className="border"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#E5E7EB'
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold mb-0.5" style={{ color: '#111827' }}>
                        {resource.topic}
                      </div>
                      <div className="text-[9px] font-medium uppercase tracking-[0.08em]" style={{ color: '#9CA3AF' }}>
                        {resource.percentage.toFixed(0)}% Accuracy
                      </div>
                    </div>
                    {resource.isWeak && (
                      <div 
                        className="px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] border"
                        style={{ 
                          background: '#111827',
                          borderColor: '#111827',
                          color: '#FFFFFF'
                        }}
                      >
                        Priority Intervention
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x" style={{ borderColor: '#E5E7EB' }}>
                  <div className="p-4">
                    <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#6B7280' }}>
                      Video Lectures
                    </div>
                    <div className="space-y-2">
                      {resource.videos.map((video, vidx) => (
                        <div
                          key={vidx}
                          className="border p-2.5 hover:border-black transition-colors cursor-pointer group"
                          style={{ 
                            borderColor: '#E5E7EB'
                          }}
                          onClick={() => showMicroFeedback(`Loading: ${video.title}`)}
                        >
                          <div className="flex items-start gap-2.5">
                            <div 
                              className="w-12 h-9 flex-shrink-0 flex items-center justify-center border"
                              style={{ 
                                background: '#FAFAFA',
                                borderColor: '#E5E7EB'
                              }}
                            >
                              <Play className="w-3 h-3" style={{ color: '#111827' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] font-bold mb-1 group-hover:underline" style={{ color: '#111827' }}>
                                {video.title}
                              </div>
                              <div className="text-[9px] font-medium mb-1" style={{ color: '#6B7280' }}>
                                {video.instructor}
                              </div>
                              <div className="flex items-center gap-2 text-[8px] font-medium" style={{ color: '#9CA3AF' }}>
                                <span>{video.duration}</span>
                                <span>•</span>
                                <span>{video.level}</span>
                                <span>•</span>
                                <span>{video.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t xl:border-t-0" style={{ borderColor: '#E5E7EB' }}>
                    <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#6B7280' }}>
                      Reference Materials
                    </div>
                    <div className="space-y-2">
                      {resource.notes.map((note, nidx) => (
                        <div
                          key={nidx}
                          className="border p-2.5 hover:border-black transition-colors cursor-pointer group"
                          style={{ 
                            borderColor: '#E5E7EB'
                          }}
                          onClick={() => showMicroFeedback(`Downloading: ${note.title}`)}
                        >
                          <div className="flex items-start gap-2.5">
                            <div 
                              className="w-8 h-9 flex-shrink-0 flex items-center justify-center border"
                              style={{ 
                                background: '#FAFAFA',
                                borderColor: '#E5E7EB'
                              }}
                            >
                              <FileText className="w-3 h-3" style={{ color: '#111827' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] font-bold mb-1 group-hover:underline" style={{ color: '#111827' }}>
                                {note.title}
                              </div>
                              <div className="flex items-center gap-2 text-[8px] font-medium mb-1" style={{ color: '#6B7280' }}>
                                <span>{note.pages} pages</span>
                                <span>•</span>
                                <span>{note.size}</span>
                              </div>
                              <div className="text-[8px] font-medium" style={{ color: '#9CA3AF' }}>
                                {note.rating} • {note.downloads} downloads
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
