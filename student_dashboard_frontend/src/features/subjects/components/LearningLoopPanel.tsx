import { X, Play, ArrowLeft, List, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

type ViewMode = 'list' | 'cards';

interface LearningLoopPanelProps {
  type: 'watch' | 'practice' | 'revise' | 'test';
  subject: string;
  chapter: string;
  data: {
    watch?: { current: number; total: number };
    practice?: { current: number; total: number };
    revise?: { current: number; total: number };
    test?: { current: number; total: number };
    watched?: { current: number; total: number };
    practiced?: { current: number; total: number };
    revised?: { current: number; total: number };
    tested?: { current: number; total: number };
  };
  onClose: () => void;
  onNavigateToDashboard?: () => void;
}

export function LearningLoopPanel({
  type,
  subject,
  chapter,
  data,
  onClose,
  onNavigateToDashboard,
}: LearningLoopPanelProps) {
  const getTitle = () => {
    switch (type) {
      case 'watch':
        return 'Video Playlist';
      case 'practice':
        return 'Practice Sets';
      case 'revise':
        return 'Revision Planner';
      case 'test':
        return 'Mini Tests';
    }
  };

  const getCurrent = () => {
    switch (type) {
      case 'watch':
        return data.watch ?? data.watched;
      case 'practice':
        return data.practice ?? data.practiced;
      case 'revise':
        return data.revise ?? data.revised;
      case 'test':
        return data.test ?? data.tested;
      default:
        return { current: 0, total: 0 };
    }
  };

  const current = getCurrent();

  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  return (
    <div className="fixed inset-y-0 right-0 w-[500px] z-50 flex flex-col" style={{ background: 'var(--bg-card)', borderLeft: '4px solid var(--accent-primary)', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {onNavigateToDashboard && (
                <button
                  onClick={onNavigateToDashboard}
                  className="flex items-center gap-1.5 text-[11px] font-medium hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
              )}
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-primary)' }}>
                {getTitle()}
              </div>
            </div>
            <div className="text-xs text-slate-500 mb-2">
              {subject} → {chapter}
            </div>
            <div className="text-sm text-slate-600">
              Progress: {current?.current || 0} / {current?.total || 0}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-100 h-2">
            <div
              className="bg-blue-600 h-2 transition-all"
              style={{
                width: `${((current?.current || 0) / (current?.total || 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {type === 'watch' && (
          <div className="space-y-3">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <div className="text-xs font-semibold text-blue-900 mb-1">
                Smart Filtering Active
              </div>
              <div className="text-xs text-blue-800">
                Showing unwatched videos only • 1.25x default speed
              </div>
            </div>

            {/* Video List */}
            {[
              { id: 1, title: 'EM Induction Basics', duration: '12:34', watched: true },
              { id: 2, title: 'Faraday\'s Law Derivation', duration: '15:20', watched: true },
              { id: 3, title: 'Lenz Law Applications', duration: '10:45', watched: false },
              { id: 4, title: 'Motional EMF Concepts', duration: '14:12', watched: false },
              { id: 5, title: 'Self & Mutual Inductance', duration: '18:30', watched: false },
            ].map((video) => (
              <div
                key={video.id}
                className={`p-4 border-2 transition-all ${
                  video.watched
                    ? 'border-slate-200 bg-slate-50 opacity-60'
                    : 'border-blue-200 bg-white hover:border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900 mb-1">
                      {video.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      Duration: {video.duration}
                    </div>
                  </div>
                  {video.watched ? (
                    <div className="text-xs text-emerald-600 font-semibold">
                      ✓ Watched
                    </div>
                  ) : (
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      Watch
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
              Watch Next Video (5 min)
            </button>
          </div>
        )}

        {type === 'practice' && (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="overflow-x-auto whitespace-nowrap border-b border-slate-200">
              <div className="inline-flex min-w-max">
              {['Unsolved', 'Solved', 'Incorrect'].map((tab, idx) => (
                <button
                  key={idx}
                  className={`shrink-0 whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                    idx === 0
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
              </div>
            </div>

            {/* Practice Sets */}
            {[
              { id: 1, name: 'Basic EM Induction', questions: 15, solved: 15, accuracy: 87 },
              { id: 2, name: 'Lenz Law Applications', questions: 10, solved: 0, accuracy: 0 },
              { id: 3, name: 'AC Circuits', questions: 20, solved: 0, accuracy: 0 },
            ].map((set) => (
              <div
                key={set.id}
                className="p-4 border-2 border-slate-200 hover:border-blue-500 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900 mb-1">
                      {set.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {set.questions} questions • {set.solved} solved
                    </div>
                  </div>
                  {set.solved > 0 && (
                    <div className="text-xs font-semibold text-emerald-600">
                      {set.accuracy}% accuracy
                    </div>
                  )}
                </div>
                <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                  {set.solved > 0 ? 'Review Solutions' : 'Start Practice'}
                </button>
              </div>
            ))}

            <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
              Solve 5 More Problems
            </button>
          </div>
        )}

        {type === 'revise' && (
          <div>
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-3 flex-1 mr-3">
                <div className="text-xs font-semibold text-yellow-900 mb-1">
                  Smart Banner
                </div>
                <div className="text-xs text-yellow-800">
                  You forget fastest after 72 hours — revise now.
                </div>
              </div>

              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setViewMode('list')}
                  title="List View"
                  className="p-1.5 transition-all"
                  style={{
                    background: viewMode === 'list' ? '#1e293b' : 'transparent',
                    color: viewMode === 'list' ? '#ffffff' : '#64748b',
                  }}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  title="Grid View"
                  className="p-1.5 transition-all"
                  style={{
                    background: viewMode === 'cards' ? '#1e293b' : 'transparent',
                    color: viewMode === 'cards' ? '#ffffff' : '#64748b',
                  }}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-3">
                {[
                  { name: 'Flashcards', count: 24, icon: '📇', description: 'Key concepts and formulas' },
                  { name: 'Formula Sheet', count: 12, icon: '📝', description: 'Essential equations' },
                  { name: 'Mistake Recap', count: 8, icon: '⚠️', description: 'Your common errors' },
                ].map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-4 border-2 border-slate-200 hover:border-blue-500 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{tool.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900 mb-0.5">
                            {tool.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {tool.description} • {tool.count} items
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors">
                        Open
                      </button>
                    </div>
                  </div>
                ))}

                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors mt-4">
                  Start Revision Session
                </button>
              </div>
            )}

            {/* Grid/Cards View */}
            {viewMode === 'cards' && (
              <div className="space-y-3">
                {[
                  { name: 'Flashcards', count: 24, icon: '📇', description: 'Key concepts and formulas' },
                  { name: 'Formula Sheet', count: 12, icon: '📝', description: 'Essential equations' },
                  { name: 'Mistake Recap', count: 8, icon: '⚠️', description: 'Your common errors' },
                ].map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-5 border-2 border-slate-200 hover:border-blue-500 transition-all cursor-pointer text-center"
                  >
                    <div className="text-4xl mb-3">{tool.icon}</div>
                    <div className="text-sm font-semibold text-slate-900 mb-1">
                      {tool.name}
                    </div>
                    <div className="text-xs text-slate-500 mb-3">
                      {tool.description}
                    </div>
                    <div className="text-xs font-bold text-blue-600 mb-3">
                      {tool.count} items
                    </div>
                    <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors">
                      Open
                    </button>
                  </div>
                ))}

                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors mt-1">
                  Start Revision Session
                </button>
              </div>
            )}
          </div>
        )}

        {type === 'test' && (
          <div>
            {/* View Toggle */}
            <div className="flex items-center justify-end mb-4">
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setViewMode('list')}
                  title="List View"
                  className="p-1.5 transition-all"
                  style={{
                    background: viewMode === 'list' ? '#1e293b' : 'transparent',
                    color: viewMode === 'list' ? '#ffffff' : '#64748b',
                  }}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  title="Grid View"
                  className="p-1.5 transition-all"
                  style={{
                    background: viewMode === 'cards' ? '#1e293b' : 'transparent',
                    color: viewMode === 'cards' ? '#ffffff' : '#64748b',
                  }}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    name: 'EM Induction - Level 1',
                    questions: 20,
                    duration: 12,
                    predictedScore: '75-85%',
                    rankImpact: '+5',
                  },
                  {
                    id: 2,
                    name: 'AC Circuits - Level 2',
                    questions: 25,
                    duration: 15,
                    predictedScore: '70-80%',
                    rankImpact: '+7',
                  },
                ].map((test) => (
                  <div
                    key={test.id}
                    className="p-4 border-2 border-slate-200 hover:border-blue-500 transition-all"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900 mb-2">
                          {test.name}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span>{test.questions} questions</span>
                          <span>•</span>
                          <span>{test.duration} min</span>
                          <span>•</span>
                          <span className="text-blue-600 font-semibold">Score: {test.predictedScore}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">{test.rankImpact} rank</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors whitespace-nowrap">
                        Take Test
                      </button>
                    </div>
                  </div>
                ))}

                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors mt-1">
                  Take Remaining Test (12 min)
                </button>
              </div>
            )}

            {/* Grid/Cards View */}
            {viewMode === 'cards' && (
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    name: 'EM Induction - Level 1',
                    questions: 20,
                    duration: 12,
                    predictedScore: '75-85%',
                    rankImpact: '+5',
                  },
                  {
                    id: 2,
                    name: 'AC Circuits - Level 2',
                    questions: 25,
                    duration: 15,
                    predictedScore: '70-80%',
                    rankImpact: '+7',
                  },
                ].map((test) => (
                  <div
                    key={test.id}
                    className="p-4 border-2 border-blue-200 bg-blue-50"
                  >
                    <div className="text-sm font-semibold text-slate-900 mb-3">
                      {test.name}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <div className="text-xs text-slate-500">Questions</div>
                        <div className="text-sm font-bold text-slate-900">
                          {test.questions}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Duration</div>
                        <div className="text-sm font-bold text-slate-900">
                          {test.duration} min
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Expected Score</div>
                        <div className="text-sm font-bold text-blue-600">
                          {test.predictedScore}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Rank Impact</div>
                        <div className="text-sm font-bold text-emerald-600">
                          {test.rankImpact}
                        </div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                      Take Test Now
                    </button>
                  </div>
                ))}

                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                  Take Remaining Test (12 min)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}