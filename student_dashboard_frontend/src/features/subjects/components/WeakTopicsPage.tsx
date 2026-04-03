import { useState } from 'react';
import { ArrowLeft, ChevronRight, AlertCircle, TrendingDown, BookOpen, FileQuestion, Zap, CheckCircle2 } from 'lucide-react';

interface WeakTopicsPageProps {
  subject: string;
  onBack: () => void;
  onNavigateToSubject: () => void;
  onFixNow: (topic: WeakTopic) => void;
  onStartPractice: (topic: WeakTopic) => void;
  onStartRevision: (topic: WeakTopic) => void;
}

interface WeakTopic {
  id: string;
  title: string;
  category: string;
  accuracy: number;
  attemptsCount: number;
  lastAttempt: string;
  severity: 'critical' | 'high' | 'medium';
  commonMistakes: string[];
  suggestedActions: string[];
  relatedTopics: string[];
  estimatedFixTime: string;
}

export function WeakTopicsPage({
  subject,
  onBack,
  onNavigateToSubject,
  onFixNow,
  onStartPractice,
  onStartRevision
}: WeakTopicsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  // Mock weak topics data with AI-detected patterns
  const weakTopics: WeakTopic[] = [
    {
      id: '1',
      title: 'Lenz\'s Law Direction',
      category: 'Electromagnetic Induction',
      accuracy: 35,
      attemptsCount: 8,
      lastAttempt: '2 hours ago',
      severity: 'critical',
      commonMistakes: [
        'Confusing current direction with flux change',
        'Not applying right-hand rule correctly',
        'Forgetting negative sign in Faraday\'s law'
      ],
      suggestedActions: [
        'Review Lenz\'s law concept video',
        'Practice 10 direction problems',
        'Complete visual diagram exercises'
      ],
      relatedTopics: ['Faraday\'s Law', 'Magnetic Flux', 'Right-hand Rule'],
      estimatedFixTime: '45 min'
    },
    {
      id: '2',
      title: 'Torque Calculation',
      category: 'Rotational Dynamics',
      accuracy: 48,
      attemptsCount: 12,
      lastAttempt: '1 day ago',
      severity: 'high',
      commonMistakes: [
        'Using wrong perpendicular distance',
        'Mixing up force and torque units',
        'Incorrect angle calculation'
      ],
      suggestedActions: [
        'Review torque formula and derivation',
        'Practice with different lever arm scenarios',
        'Master cross product calculations'
      ],
      relatedTopics: ['Angular Momentum', 'Moment of Inertia', 'Equilibrium'],
      estimatedFixTime: '60 min'
    },
    {
      id: '3',
      title: 'First Law Applications',
      category: 'Thermodynamics',
      accuracy: 55,
      attemptsCount: 6,
      lastAttempt: '3 days ago',
      severity: 'high',
      commonMistakes: [
        'Confusing heat and work signs',
        'Not identifying system correctly',
        'Missing state change implications'
      ],
      suggestedActions: [
        'Review sign conventions for Q and W',
        'Practice identifying cyclic processes',
        'Solve PV diagram problems'
      ],
      relatedTopics: ['Internal Energy', 'Heat Transfer', 'Work Done'],
      estimatedFixTime: '50 min'
    },
    {
      id: '4',
      title: 'Interference Pattern Analysis',
      category: 'Wave Optics',
      accuracy: 62,
      attemptsCount: 5,
      lastAttempt: '1 week ago',
      severity: 'medium',
      commonMistakes: [
        'Confusing bright and dark fringe positions',
        'Incorrect path difference calculation',
        'Missing wavelength unit conversions'
      ],
      suggestedActions: [
        'Review Young\'s double slit experiment',
        'Practice fringe width calculations',
        'Study constructive/destructive interference'
      ],
      relatedTopics: ['Diffraction', 'Wave Theory', 'Light Properties'],
      estimatedFixTime: '40 min'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', icon: '#EF4444' };
      case 'high': return { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74', icon: '#F97316' };
      case 'medium': return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D', icon: '#F59E0B' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', icon: '#64748B' };
    }
  };

  const filteredTopics = selectedFilter === 'all' 
    ? weakTopics 
    : weakTopics.filter(t => t.severity === selectedFilter);

  const totalWeakTopics = weakTopics.length;
  const criticalCount = weakTopics.filter(t => t.severity === 'critical').length;
  const avgAccuracy = Math.round(weakTopics.reduce((sum, t) => sum + t.accuracy, 0) / weakTopics.length);

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
          <button onClick={onNavigateToSubject} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-tertiary)' }}>
            My Subjects
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <button onClick={onNavigateToSubject} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-tertiary)' }}>
            {subject}
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Weak Topics
          </span>
        </div>

        {/* Title and Stats */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Weak Topics Analysis
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              AI-detected areas requiring focused attention
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Weak Topics
              </div>
              <div className="text-2xl font-bold" style={{ color: '#EF4444' }}>
                {totalWeakTopics}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Critical
              </div>
              <div className="text-2xl font-bold" style={{ color: '#991B1B' }}>
                {criticalCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Avg Accuracy
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {avgAccuracy}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 md:px-6 py-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <div className="overflow-x-auto whitespace-nowrap">
          <div className="inline-flex min-w-max items-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              selectedFilter === 'all' ? '' : 'opacity-60'
            }`}
            style={{
              background: selectedFilter === 'all' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: selectedFilter === 'all' ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            All ({weakTopics.length})
          </button>
          <button
            onClick={() => setSelectedFilter('critical')}
            className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              selectedFilter === 'critical' ? '' : 'opacity-60'
            }`}
            style={{
              background: selectedFilter === 'critical' ? '#EF4444' : 'var(--bg-secondary)',
              color: selectedFilter === 'critical' ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            Critical ({weakTopics.filter(t => t.severity === 'critical').length})
          </button>
          <button
            onClick={() => setSelectedFilter('high')}
            className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              selectedFilter === 'high' ? '' : 'opacity-60'
            }`}
            style={{
              background: selectedFilter === 'high' ? '#F97316' : 'var(--bg-secondary)',
              color: selectedFilter === 'high' ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            High ({weakTopics.filter(t => t.severity === 'high').length})
          </button>
          <button
            onClick={() => setSelectedFilter('medium')}
            className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              selectedFilter === 'medium' ? '' : 'opacity-60'
            }`}
            style={{
              background: selectedFilter === 'medium' ? '#F59E0B' : 'var(--bg-secondary)',
              color: selectedFilter === 'medium' ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            Medium ({weakTopics.filter(t => t.severity === 'medium').length})
          </button>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg animate-fadeIn" style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46' }}>
          <span className="text-sm font-semibold">{showFeedback}</span>
        </div>
      )}

      {/* Weak Topics List */}
      <div className="px-4 md:px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {filteredTopics.map((topic) => {
            const severityColors = getSeverityColor(topic.severity);
            const isExpanded = expandedTopic === topic.id;

            return (
              <div
                key={topic.id}
                className="border-2 transition-all"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: severityColors.border,
                }}
              >
                {/* Topic Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Severity Icon */}
                    <div className="flex-shrink-0">
                      <AlertCircle className="w-8 h-8" style={{ color: severityColors.icon }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="px-3 py-1 text-xs font-bold uppercase"
                              style={{
                                background: severityColors.bg,
                                color: severityColors.text,
                                border: `1px solid ${severityColors.border}`
                              }}
                            >
                              {topic.severity} Priority
                            </div>
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                              {topic.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            <span>{topic.attemptsCount} attempts</span>
                            <span>•</span>
                            <span>Last: {topic.lastAttempt}</span>
                            <span>•</span>
                            <span>Fix time: {topic.estimatedFixTime}</span>
                          </div>
                        </div>

                        {/* Accuracy Circle */}
                        <div className="text-center">
                          <div
                            className="w-20 h-20 rounded-full flex items-center justify-center border-4"
                            style={{
                              borderColor: topic.accuracy < 50 ? '#EF4444' : topic.accuracy < 70 ? '#F59E0B' : '#10B981',
                              background: topic.accuracy < 50 ? '#FEE2E2' : topic.accuracy < 70 ? '#FEF3C7' : '#D1FAE5'
                            }}
                          >
                            <div>
                              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {topic.accuracy}%
                              </div>
                              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                accuracy
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Common Mistakes Preview */}
                      <div className="p-4 mb-4" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
                        <div className="flex items-start gap-2">
                          <TrendingDown className="w-5 h-5 flex-shrink-0" style={{ color: '#92400E' }} />
                          <div className="flex-1">
                            <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#92400E' }}>
                              Most Common Mistake
                            </div>
                            <p className="text-sm" style={{ color: '#92400E' }}>
                              {topic.commonMistakes[0]}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            onFixNow(topic);
                            showMicroFeedback(`→ Opening targeted revision for ${topic.title}`);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90"
                          style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                        >
                          <Zap className="w-4 h-4" />
                          Fix Now
                        </button>
                        <button
                          onClick={() => {
                            onStartPractice(topic);
                            showMicroFeedback(`→ Loading practice problems for ${topic.title}`);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90"
                          style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-medium)'
                          }}
                        >
                          <FileQuestion className="w-4 h-4" />
                          Start Practice
                        </button>
                        <button
                          onClick={() => {
                            onStartRevision(topic);
                            showMicroFeedback(`✓ ${topic.title} added to revision schedule`);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90"
                          style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-medium)'
                          }}
                        >
                          <BookOpen className="w-4 h-4" />
                          Add to Revision
                        </button>
                        <button
                          onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                          className="px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90"
                          style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-medium)'
                          }}
                        >
                          {isExpanded ? 'Hide' : 'View'} Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 border-t" style={{ borderColor: 'var(--border-soft)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* All Common Mistakes */}
                      <div>
                        <div className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>
                          Common Mistakes
                        </div>
                        <div className="space-y-2">
                          {topic.commonMistakes.map((mistake, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-3" style={{ background: 'var(--bg-secondary)' }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                                {idx + 1}
                              </div>
                              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{mistake}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Suggested Actions */}
                      <div>
                        <div className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>
                          AI-Recommended Actions
                        </div>
                        <div className="space-y-2">
                          {topic.suggestedActions.map((action, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-3" style={{ background: 'var(--bg-secondary)' }}>
                              <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#10B981' }} />
                              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{action}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Related Topics */}
                    <div className="mt-6">
                      <div className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>
                        Related Topics to Review
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {topic.relatedTopics.map((related, idx) => (
                          <button
                            key={idx}
                            onClick={() => showMicroFeedback(`→ Opening ${related}`)}
                            className="px-3 py-2 text-xs font-semibold hover:opacity-80 transition-all"
                            style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                          >
                            {related}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
