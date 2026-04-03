import { useState, useEffect } from 'react';
import { List, LayoutGrid, TrendingDown, Target } from 'lucide-react';

type ViewMode = 'list' | 'cards';

interface WeakTopic {
  topic: string;
  subject: string;
  accuracy: number;
  attempts: number;
  lastPractice: string;
  fixPlan: string;
}

const weakTopics: WeakTopic[] = [
  { 
    topic: 'Lenz Law', 
    subject: 'Physics', 
    accuracy: 45, 
    attempts: 12, 
    lastPractice: '2 days ago',
    fixPlan: 'Watch 2 visual explainers → Solve 10 guided problems → Take topic test'
  },
  { 
    topic: 'Organic Mechanisms', 
    subject: 'Chemistry', 
    accuracy: 52, 
    attempts: 8, 
    lastPractice: '1 day ago',
    fixPlan: 'Review reaction patterns → Practice 15 mechanisms → Apply to new reactions'
  },
  { 
    topic: 'Integration by Parts', 
    subject: 'Math', 
    accuracy: 58, 
    attempts: 15, 
    lastPractice: '3 days ago',
    fixPlan: 'Master ILATE rule → Solve 12 standard problems → Try mixed problems'
  },
];

export function WeakTopicsSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  useEffect(() => {
    const saved = localStorage.getItem('towsoth_weak_topics_view') as ViewMode | null;
    if (saved) setViewMode(saved);
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('towsoth_weak_topics_view', mode);
  };

  return (
    <div>
      {/* Header with View Toggle */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Weak Topics
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            AI-identified weak areas with targeted improvement plans
          </p>
        </div>

        {/* View Toggle */}
        <div
          className="inline-flex items-center gap-1 p-1 ml-6"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-soft)',
          }}
        >
          <button
            onClick={() => handleViewChange('list')}
            title="List View"
            className="p-2 transition-all"
            style={{
              background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'list' ? '#ffffff' : 'var(--text-tertiary)',
            }}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewChange('cards')}
            title="Card View"
            className="p-2 transition-all"
            style={{
              background: viewMode === 'cards' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'cards' ? '#ffffff' : 'var(--text-tertiary)',
            }}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {weakTopics.map((weak, idx) => (
            <div
              key={idx}
              className="p-5"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderLeft: '4px solid #dc2626',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {weak.topic}
                  </div>
                  <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {weak.subject}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="mb-1" style={{ color: 'var(--text-tertiary)' }}>Accuracy</div>
                      <div className="font-bold text-red-600">{weak.accuracy}%</div>
                    </div>
                    <div>
                      <div className="mb-1" style={{ color: 'var(--text-tertiary)' }}>Attempts</div>
                      <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{weak.attempts}</div>
                    </div>
                    <div>
                      <div className="mb-1" style={{ color: 'var(--text-tertiary)' }}>Last Practice</div>
                      <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{weak.lastPractice}</div>
                    </div>
                  </div>
                </div>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>

              <div className="p-3 mb-4" style={{ 
                background: '#eff6ff', 
                borderLeft: '4px solid #2563eb',
                color: '#1e3a8a'
              }}>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#2563eb' }} />
                  <div>
                    <div className="text-xs font-bold mb-1">AI Fix Plan</div>
                    <p className="text-xs">{weak.fixPlan}</p>
                  </div>
                </div>
              </div>

              <button
                className="w-full px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90"
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                }}
              >
                Start Fix Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weakTopics.map((weak, idx) => (
            <div
              key={idx}
              className="relative p-5"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Red Severity Strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />

              <div className="pt-2">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {weak.topic}
                  </div>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>

                <div className="text-[10px] mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  {weak.subject}
                </div>

                {/* Accuracy - Large Display */}
                <div className="mb-4">
                  <div className="text-4xl font-bold mb-1 text-red-600">
                    {weak.accuracy}%
                  </div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Current Accuracy
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <div>
                    <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Attempts</div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{weak.attempts}</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Last Practice</div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{weak.lastPractice}</div>
                  </div>
                </div>

                {/* Fix Plan Preview */}
                <div className="text-[10px] mb-4" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Fix Plan:</span> {weak.fixPlan.substring(0, 50)}...
                </div>

                {/* CTA Button */}
                <button
                  className="w-full px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90"
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                  }}
                >
                  Fix Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}