import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { List, LayoutGrid, FileText, Clock } from 'lucide-react';

type ViewMode = 'list' | 'cards';

interface PYQSet {
  title: string;
  year: string;
  subject: string;
  questions: number;
  difficulty: string;
  avgTime: string;
  completed: number;
}

const pyqSets: PYQSet[] = [
  { 
    title: 'JEE Advanced Physics 2024', 
    year: '2024', 
    subject: 'Physics', 
    questions: 54,
    difficulty: 'Very Hard',
    avgTime: '3 hours',
    completed: 12
  },
  { 
    title: 'JEE Main Mathematics 2024', 
    year: '2024', 
    subject: 'Math', 
    questions: 30,
    difficulty: 'Hard',
    avgTime: '1.5 hours',
    completed: 30
  },
  { 
    title: 'JEE Advanced Chemistry 2023', 
    year: '2023', 
    subject: 'Chemistry', 
    questions: 54,
    difficulty: 'Hard',
    avgTime: '3 hours',
    completed: 22
  },
  { 
    title: 'NEET Physics 2024', 
    year: '2024', 
    subject: 'Physics', 
    questions: 45,
    difficulty: 'Medium',
    avgTime: '1 hour',
    completed: 45
  },
];

export function PYQSection() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  useEffect(() => {
    const saved = localStorage.getItem('towsoth_pyq_view') as ViewMode | null;
    if (saved) setViewMode(saved);
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('towsoth_pyq_view', mode);
  };

  const handleOpenPYQ = (pyq: PYQSet) => {
    const searchParams = new URLSearchParams({
      topic: pyq.title,
      subject: pyq.subject,
      returnTo: ROUTES.student['tests-guidelines'],
    });

    navigate(`${ROUTES.student['test-window']}?${searchParams.toString()}`);
  };

  return (
    <div>
      {/* Header with View Toggle */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            PYQ Solver
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Previous year questions organized by topic and difficulty
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
          {pyqSets.map((pyq, idx) => {
            const progress = (pyq.completed / pyq.questions) * 100;

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
                      {pyq.title}
                    </div>
                    <div className="flex items-center gap-4 text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                      <span>{pyq.subject}</span>
                      <span>•</span>
                      <span>{pyq.questions} questions</span>
                      <span>•</span>
                      <span>{pyq.difficulty}</span>
                      <span>•</span>
                      <span>⏱ {pyq.avgTime}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                        <span>Progress</span>
                        <span className="font-bold">{pyq.completed}/{pyq.questions}</span>
                      </div>
                      <div className="w-full h-2" style={{ background: 'var(--bg-secondary)' }}>
                        <div
                          className="h-2 transition-all"
                          style={{
                            width: `${progress}%`,
                            background: progress === 100 ? '#10b981' : 'var(--accent-primary)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="px-3 py-1 text-xs font-bold ml-6"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {pyq.year}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenPYQ(pyq)}
                  className="w-full px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90"
                  style={{
                    background: progress === 100 ? '#10b981' : 'var(--accent-primary)',
                    color: '#ffffff',
                  }}
                >
                  {progress === 100 ? 'Review Solutions' : 'Continue Solving'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pyqSets.map((pyq, idx) => {
            const progress = (pyq.completed / pyq.questions) * 100;

            return (
              <div
                key={idx}
                className="relative p-5"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-soft)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              >
                {/* Progress Strip */}
                <div className="absolute top-0 left-0 right-0 h-1">
                  <div
                    className="h-1 transition-all"
                    style={{
                      width: `${progress}%`,
                      background: progress === 100 ? '#10b981' : 'var(--accent-primary)',
                    }}
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    <div
                      className="px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {pyq.year}
                    </div>
                  </div>

                  <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {pyq.title}
                  </div>

                  {/* Progress Display */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold mb-1" style={{ color: progress === 100 ? '#10b981' : 'var(--accent-primary)' }}>
                      {pyq.completed}/{pyq.questions}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                      Questions Solved
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-tertiary)' }}>Subject</span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{pyq.subject}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-tertiary)' }}>Difficulty</span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{pyq.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <Clock className="w-3 h-3" />
                      <span>{pyq.avgTime}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleOpenPYQ(pyq)}
                    className="w-full px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90"
                    style={{
                      background: progress === 100 ? '#10b981' : 'var(--accent-primary)',
                      color: '#ffffff',
                    }}
                  >
                    {progress === 100 ? 'Review' : 'Continue'}
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