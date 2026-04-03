import { useState, useEffect } from 'react';
import { List, LayoutGrid, Play } from 'lucide-react';

type ViewMode = 'list' | 'cards';

interface PracticeSet {
  topic: string;
  questions: number;
  difficulty: string;
  priority: 'High' | 'Medium' | 'Low';
  accuracy: number;
}

const practiceSets: PracticeSet[] = [
  { topic: 'Electromagnetic Induction', questions: 25, difficulty: 'Medium', priority: 'High', accuracy: 45 },
  { topic: 'Rotational Motion', questions: 30, difficulty: 'Hard', priority: 'Medium', accuracy: 62 },
  { topic: 'Thermodynamics', questions: 20, difficulty: 'Easy', priority: 'Low', accuracy: 78 },
  { topic: 'Waves and Sound', questions: 22, difficulty: 'Medium', priority: 'High', accuracy: 53 },
  { topic: 'Modern Physics', questions: 28, difficulty: 'Hard', priority: 'Medium', accuracy: 58 },
];

export function PracticeSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  useEffect(() => {
    const saved = localStorage.getItem('towsoth_practice_view') as ViewMode | null;
    if (saved) setViewMode(saved);
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('towsoth_practice_view', mode);
  };

  return (
    <div>
      {/* Header with View Toggle */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Practice
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Targeted practice based on your weak areas and learning progress
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
          {practiceSets.map((set, idx) => (
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
                    {set.topic}
                  </div>
                  <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {set.questions} questions • {set.difficulty}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Current Accuracy:</div>
                    <div
                      className="text-xs font-bold"
                      style={{
                        color: set.accuracy < 50 ? '#dc2626' :
                               set.accuracy < 70 ? '#f59e0b' : '#10b981'
                      }}
                    >
                      {set.accuracy}%
                    </div>
                  </div>
                </div>
                <span
                  className="px-3 py-1 text-xs font-bold"
                  style={{
                    background: set.priority === 'High' ? '#fef2f2' :
                               set.priority === 'Medium' ? '#fffbeb' : '#f8fafc',
                    color: set.priority === 'High' ? '#991b1b' :
                           set.priority === 'Medium' ? '#92400e' : '#475569'
                  }}
                >
                  {set.priority} Priority
                </span>
              </div>
              <button
                className="w-full px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90"
                style={{
                  background: 'var(--accent-primary)',
                  color: '#ffffff',
                }}
              >
                Start Practice Set
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {practiceSets.map((set, idx) => (
            <div
              key={idx}
              className="relative p-5"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Priority Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: set.priority === 'High' ? '#fca5a5' :
                             set.priority === 'Medium' ? '#fcd34d' : '#cbd5e1'
                }}
              />

              <div className="pt-2">
                <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {set.topic}
                </div>

                {/* Accuracy - Large Display */}
                <div className="mb-4">
                  <div
                    className="text-4xl font-bold mb-1"
                    style={{
                      color: set.accuracy < 50 ? '#dc2626' :
                             set.accuracy < 70 ? '#f59e0b' : '#10b981'
                    }}
                  >
                    {set.accuracy}%
                  </div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Current Accuracy
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {set.questions} questions
                  </div>
                  <div
                    className="px-2 py-1 text-[10px] font-bold"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {set.difficulty}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className="w-full px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                  }}
                >
                  <Play className="w-3.5 h-3.5" />
                  Start Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}