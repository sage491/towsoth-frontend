import { useState, useEffect } from 'react';
import { List, LayoutGrid } from 'lucide-react';

interface MistakeCluster {
  cluster: string;
  topics: string[];
  frequency: number;
  severity: 'High' | 'Medium' | 'Low';
  impact: string;
}

interface MistakeAnalysisProps {
  onViewFixPlan: (cluster: MistakeCluster) => void;
}

const mistakeClusters: MistakeCluster[] = [
  { 
    cluster: 'Conceptual Confusion', 
    topics: ['Lenz Law', 'Faraday Law', 'Induced EMF'],
    frequency: 8,
    severity: 'High',
    impact: '12% of total errors'
  },
  { 
    cluster: 'Calculation Errors', 
    topics: ['Rotational Dynamics', 'Angular Momentum'],
    frequency: 5,
    severity: 'Medium',
    impact: '7% of total errors'
  },
  { 
    cluster: 'Time Mismanagement', 
    topics: ['Complex Word Problems'],
    frequency: 3,
    severity: 'Low',
    impact: '4% of total errors'
  },
  { 
    cluster: 'Sign Convention Errors', 
    topics: ['Optics', 'Mirror Formula'],
    frequency: 6,
    severity: 'Medium',
    impact: '8% of total errors'
  },
];

type ViewMode = 'list' | 'cards';

export function MistakeAnalysis({ onViewFixPlan }: MistakeAnalysisProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('towsoth_mistakes_view') as ViewMode | null;
    if (saved) {
      setViewMode(saved);
    }
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('towsoth_mistakes_view', mode);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return {
          bg: '#fef2f2',
          text: '#991b1b',
          border: '#fca5a5',
        };
      case 'Medium':
        return {
          bg: '#fffbeb',
          text: '#92400e',
          border: '#fcd34d',
        };
      case 'Low':
        return {
          bg: '#f8fafc',
          text: '#475569',
          border: '#cbd5e1',
        };
      default:
        return {
          bg: '#f8fafc',
          text: '#475569',
          border: '#cbd5e1',
        };
    }
  };

  return (
    <div>
      {/* Header with View Toggle */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Mistake Analysis
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            AI-identified error patterns with severity classification
          </p>
        </div>

        {/* View Toggle - Top Right */}
        <div
          className="inline-flex items-center gap-1 p-1 ml-6"
          style={{
            background: 'var(--bg-tertiary)',
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

      {/* List View - Horizontal Rows */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {mistakeClusters.map((cluster, idx) => {
            const colors = getSeverityColor(cluster.severity);

            return (
              <div
                key={idx}
                className="p-5"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {cluster.cluster}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cluster.topics.map((topic, tidx) => (
                        <span
                          key={tidx}
                          className="px-2 py-1 text-xs font-semibold"
                          style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                      Frequency
                    </div>
                    <div className="text-2xl font-bold" style={{ color: colors.text }}>
                      {cluster.frequency}×
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="px-3 py-1 text-xs font-bold"
                    style={{
                      background: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {cluster.severity} Severity
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {cluster.impact}
                  </span>
                </div>

                <button
                  onClick={() => onViewFixPlan(cluster)}
                  className="w-full px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90"
                  style={{
                    background: cluster.severity === 'High' ? '#dc2626' : 'var(--accent-primary)',
                    color: '#ffffff',
                  }}
                >
                  View Fix Plan
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Card View - Visual Grid */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mistakeClusters.map((cluster, idx) => {
            const colors = getSeverityColor(cluster.severity);

            return (
              <div
                key={idx}
                className="relative"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-soft)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              >
                {/* Severity Color Strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: colors.border }}
                />

                <div className="p-5 pt-6">
                  {/* Category Title */}
                  <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {cluster.cluster}
                  </div>

                  {/* Frequency - Large but Muted */}
                  <div className="mb-4">
                    <div className="text-4xl font-bold mb-1" style={{ color: colors.text }}>
                      {cluster.frequency}×
                    </div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                      Occurrences
                    </div>
                  </div>

                  {/* Subtopics - Stacked Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cluster.topics.map((topic, tidx) => (
                      <span
                        key={tidx}
                        className="px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Severity Badge */}
                  <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <span
                      className="px-2 py-1 text-[10px] font-bold"
                      style={{
                        background: colors.bg,
                        color: colors.text,
                      }}
                    >
                      {cluster.severity}
                    </span>
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                      {cluster.impact}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onViewFixPlan(cluster)}
                    className="w-full px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90"
                    style={{
                      background: cluster.severity === 'High' ? '#dc2626' : 'var(--accent-primary)',
                      color: '#ffffff',
                    }}
                  >
                    Fix Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}