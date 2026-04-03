import { useState, useEffect } from 'react';
import { List, LayoutGrid, Calendar, CheckCircle2, Circle, Clock, Target } from 'lucide-react';

type ViewMode = 'list' | 'cards' | 'timeline';

type TaskType = 'study' | 'practice' | 'test' | 'revision' | 'deadline' | 'personal';

interface DailyTask {
  id: string;
  title: string;
  type: TaskType;
  xp: number;
  timeEstimate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  deadline?: string;
  impact: string;
}

const dailyTasks: DailyTask[] = [
  {
    id: '1',
    title: 'Complete EM Induction Practice Set',
    type: 'practice',
    xp: 250,
    timeEstimate: '45 mins',
    priority: 'High',
    completed: false,
    impact: '+12 rank points'
  },
  {
    id: '2',
    title: 'Review Rotational Dynamics Notes',
    type: 'study',
    xp: 150,
    timeEstimate: '30 mins',
    priority: 'Medium',
    completed: true,
    impact: 'Concept clarity'
  },
  {
    id: '3',
    title: 'Physics Mock Test #3',
    type: 'test',
    xp: 500,
    timeEstimate: '3 hours',
    priority: 'High',
    completed: false,
    deadline: '5:00 PM Today',
    impact: '+50 XP bonus'
  },
  {
    id: '4',
    title: 'Revise Organic Chemistry Mechanisms',
    type: 'revision',
    xp: 200,
    timeEstimate: '40 mins',
    priority: 'Medium',
    completed: false,
    impact: 'Retention boost'
  },
  {
    id: '5',
    title: 'Submit Assignment - Calculus',
    type: 'deadline',
    xp: 100,
    timeEstimate: '20 mins',
    priority: 'Low',
    completed: true,
    deadline: 'Today',
    impact: 'Required'
  },
];

export function DailyTaskSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [tasks, setTasks] = useState(dailyTasks);

  useEffect(() => {
    const saved = localStorage.getItem('towsoth_tasks_view') as ViewMode | null;
    if (saved) setViewMode(saved);
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('towsoth_tasks_view', mode);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTaskTypeColor = (type: TaskType) => {
    const colors = {
      study: { bg: '#eff6ff', text: '#1e40af', border: '#93c5fd' },
      practice: { bg: '#f0fdf4', text: '#166534', border: '#86efac' },
      test: { bg: '#fef2f2', text: '#991b1b', border: '#fca5a5' },
      revision: { bg: '#fefce8', text: '#854d0e', border: '#fde047' },
      deadline: { bg: '#fdf4ff', text: '#86198f', border: '#f0abfc' },
      personal: { bg: '#f8fafc', text: '#475569', border: '#cbd5e1' },
    };
    return colors[type];
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalXP = tasks.reduce((sum, t) => sum + (t.completed ? t.xp : 0), 0);

  return (
    <div>
      {/* Header with View Toggle */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Daily Tasks
          </h1>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            Your personalized action plan for today
          </p>
          
          {/* Progress Summary */}
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" style={{ color: '#10b981' }} />
              <span style={{ color: 'var(--text-tertiary)' }}>
                {completedCount}/{tasks.length} completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span style={{ color: 'var(--text-tertiary)' }}>
                {totalXP} XP earned today
              </span>
            </div>
          </div>
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
          <button
            onClick={() => handleViewChange('timeline')}
            title="Timeline View"
            className="p-2 transition-all"
            style={{
              background: viewMode === 'timeline' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'timeline' ? '#ffffff' : 'var(--text-tertiary)',
            }}
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {tasks.map((task) => {
            const typeColor = getTaskTypeColor(task.type);

            return (
              <div
                key={task.id}
                className="p-4 flex items-start gap-4 transition-opacity"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-soft)',
                  opacity: task.completed ? 0.6 : 1,
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
                  ) : (
                    <Circle className="w-5 h-5" style={{ color: 'var(--border-medium)' }} />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div
                        className="text-sm font-bold mb-1"
                        style={{
                          color: 'var(--text-primary)',
                          textDecoration: task.completed ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.timeEstimate}
                        </span>
                        <span>•</span>
                        <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
                          +{task.xp} XP
                        </span>
                        <span>•</span>
                        <span>{task.impact}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div
                        className="px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{
                          background: typeColor.bg,
                          color: typeColor.text,
                        }}
                      >
                        {task.type}
                      </div>
                      {task.deadline && (
                        <div className="text-[10px] text-red-600 font-bold">
                          ⏰ {task.deadline}
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

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => {
            const typeColor = getTaskTypeColor(task.type);

            return (
              <div
                key={task.id}
                className="relative p-5 transition-opacity"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-soft)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  opacity: task.completed ? 0.6 : 1,
                }}
              >
                {/* Type Strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: typeColor.border }}
                />

                <div className="pt-2">
                  {/* Checkbox and Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
                      ) : (
                        <Circle className="w-5 h-5" style={{ color: 'var(--border-medium)' }} />
                      )}
                    </button>
                    <div
                      className="text-sm font-bold flex-1"
                      style={{
                        color: 'var(--text-primary)',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </div>
                  </div>

                  {/* XP Display */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>
                      +{task.xp}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                      Experience Points
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-tertiary)' }}>Time</span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{task.timeEstimate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-tertiary)' }}>Type</span>
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{
                          background: typeColor.bg,
                          color: typeColor.text,
                        }}
                      >
                        {task.type}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {task.impact}
                    </div>
                  </div>

                  {/* Deadline */}
                  {task.deadline && (
                    <div className="text-[10px] font-bold text-red-600 mb-2">
                      ⏰ Due: {task.deadline}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="relative">
          {/* Timeline Line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5"
            style={{ background: 'var(--border-medium)' }}
          />

          <div className="space-y-6">
            {tasks.map((task, _idx) => {
              const typeColor = getTaskTypeColor(task.type);

              return (
                <div key={task.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div
                    className="absolute left-[18px] top-2 w-4 h-4 rounded-full border-2"
                    style={{
                      background: task.completed ? '#10b981' : 'var(--bg-card)',
                      borderColor: task.completed ? '#10b981' : typeColor.border,
                    }}
                  />

                  {/* Task Content */}
                  <div
                    className="p-4 transition-opacity"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                      opacity: task.completed ? 0.6 : 1,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div
                          className="text-sm font-bold mb-1"
                          style={{
                            color: 'var(--text-primary)',
                            textDecoration: task.completed ? 'line-through' : 'none',
                          }}
                        >
                          {task.title}
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          <span>{task.timeEstimate}</span>
                          <span>•</span>
                          <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
                            +{task.xp} XP
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-80"
                        style={{
                          background: task.completed ? '#10b981' : 'var(--accent-primary)',
                          color: '#ffffff',
                        }}
                      >
                        {task.completed ? 'Done' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}