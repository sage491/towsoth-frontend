import { useState, useEffect } from 'react';
import { Plus, Filter, Clock, Edit2, Trash2, CheckCircle2, Circle, Play, BookOpen, FileText, RotateCcw, GraduationCap, AlertCircle } from 'lucide-react';
import { TaskPanel, DailyTask, TaskType } from './TaskPanel';
import type { RoutePath } from '@/shared/config/routes';

const STORAGE_KEY = 'towsoth_daily_tasks';

type TaskFilterType = 'all' | TaskType | 'due-today' | 'completed';
type TaskSortType = 'time' | 'xp' | 'urgency';

const taskFilterOptions: TaskFilterType[] = ['all', 'study', 'practice', 'revision', 'test', 'deadline', 'due-today', 'completed'];
const taskSortOptions: Array<{ value: TaskSortType; label: string }> = [
  { value: 'urgency', label: 'Due urgency' },
  { value: 'time', label: 'Time required' },
  { value: 'xp', label: 'XP value' },
];

const SAMPLE_TASKS: DailyTask[] = [
  {
    id: 'sample_1',
    title: 'Complete EM Induction Practice Set',
    type: 'practice',
    subject: 'Physics',
    time: 45,
    xp: 250,
    rankImpact: 12,
    dueToday: true,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_2',
    title: 'Review Rotational Dynamics Notes',
    type: 'study',
    subject: 'Physics',
    time: 30,
    xp: 150,
    rankImpact: 8,
    dueToday: false,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_3',
    title: 'Revise Organic Chemistry Mechanisms',
    type: 'revision',
    subject: 'Chemistry',
    time: 40,
    xp: 120,
    rankImpact: 6,
    dueToday: false,
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

interface EnhancedDailyTaskSectionProps {
  onNavigate: (page: RoutePath, tab?: string) => void;
}

export function EnhancedDailyTaskSection({ onNavigate }: EnhancedDailyTaskSectionProps) {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  
  // Filters
  const [filterType, setFilterType] = useState<TaskFilterType>('all');
  const [sortBy, setSortBy] = useState<TaskSortType>('urgency');
  const [showFilters, setShowFilters] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load tasks:', e);
        // Load sample tasks on error
        setTasks(SAMPLE_TASKS);
      }
    } else {
      // First time load - use sample tasks
      setTasks(SAMPLE_TASKS);
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (taskData: Omit<DailyTask, 'id' | 'createdAt'>) => {
    const newTask: DailyTask = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const handleEditTask = (taskData: Omit<DailyTask, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    setTasks(tasks.map(t => 
      t.id === editingTask.id 
        ? { ...t, ...taskData }
        : t
    ));
    setEditingTask(null);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setDeletingTaskId(null);
  };

  const handleStartTask = (task: DailyTask) => {
    // Navigate to appropriate workspace based on task type
    switch (task.type) {
      case 'study':
        onNavigate('my-subjects', 'learn');
        break;
      case 'practice':
        onNavigate('my-subjects', 'practice');
        break;
      case 'revision':
        onNavigate('my-subjects', 'revise');
        break;
      case 'test':
        onNavigate('tests-guidelines');
        break;
      case 'deadline':
        // Could navigate to a calendar or reminders page
        onNavigate('plan-journey', 'tasks');
        break;
    }
  };

  const openEditPanel = (task: DailyTask) => {
    setEditingTask(task);
    setShowTaskPanel(true);
  };

  const closeTaskPanel = () => {
    setShowTaskPanel(false);
    setEditingTask(null);
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    if (filterType === 'all') return true;
    if (filterType === 'completed') return task.completed;
    if (filterType === 'due-today') return task.dueToday;
    return task.type === filterType;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'time') return a.time - b.time;
    if (sortBy === 'xp') return b.xp - a.xp;
    if (sortBy === 'urgency') {
      if (a.dueToday && !b.dueToday) return -1;
      if (!a.dueToday && b.dueToday) return 1;
      if (!a.completed && b.completed) return -1;
      if (a.completed && !b.completed) return 1;
      return 0;
    }
    return 0;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalXP = tasks.reduce((sum, t) => t.completed ? sum + t.xp : sum, 0);

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'study': return BookOpen;
      case 'practice': return FileText;
      case 'revision': return RotateCcw;
      case 'test': return GraduationCap;
      case 'deadline': return AlertCircle;
    }
  };

  const getTaskColor = (type: TaskType) => {
    switch (type) {
      case 'study': return { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' };
      case 'practice': return { bg: '#f0fdf4', border: '#10b981', text: '#166534' };
      case 'revision': return { bg: '#fefce8', border: '#f59e0b', text: '#854d0e' };
      case 'test': return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' };
      case 'deadline': return { bg: '#faf5ff', border: '#8b5cf6', text: '#6b21a8' };
    }
  };

  // Empty states
  if (tasks.length === 0) {
    return (
      <div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Daily Tasks
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Your personalized action plan for today
            </p>
          </div>
          <button
            onClick={() => setShowTaskPanel(true)}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        <div className="text-center py-16 border-2 border-dashed" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
          <div className="mb-4">
            <Clock className="w-12 h-12 mx-auto" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            No tasks planned today
          </h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Add 2–3 focused tasks to stay on track and build momentum.
          </p>
          <button
            onClick={() => setShowTaskPanel(true)}
            className="px-6 py-3 text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Your First Task
          </button>
        </div>

        <TaskPanel
          open={showTaskPanel}
          onClose={closeTaskPanel}
          onSave={handleAddTask}
          editingTask={editingTask}
        />
      </div>
    );
  }

  // All tasks completed
  if (tasks.length > 0 && completedCount === tasks.length) {
    return (
      <div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Daily Tasks
            </h1>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              {completedCount}/{tasks.length} completed · {totalXP} XP earned today
            </p>
          </div>
          <button
            onClick={() => setShowTaskPanel(true)}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        <div className="text-center py-16 border-2" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
          <div className="mb-4">
            <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: '#10b981' }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Great work today
          </h3>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            You've completed all planned tasks.
          </p>
        </div>

        <TaskPanel
          open={showTaskPanel}
          onClose={closeTaskPanel}
          onSave={handleAddTask}
          editingTask={editingTask}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Daily Tasks
          </h1>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            {completedCount}/{tasks.length} completed · {totalXP} XP earned today
          </p>
        </div>
        <button
          onClick={() => setShowTaskPanel(true)}
          className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          <Filter className="w-4 h-4" />
          Filters {showFilters ? '▼' : '▶'}
        </button>

        {showFilters && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Filter by
              </label>
              <div className="flex flex-wrap gap-2">
                {taskFilterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterType(filter)}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide border transition-colors"
                    style={{
                      background: filterType === filter ? 'var(--accent-primary)' : 'transparent',
                      borderColor: filterType === filter ? 'var(--accent-primary)' : 'var(--border-soft)',
                      color: filterType === filter ? '#ffffff' : 'var(--text-primary)',
                    }}
                  >
                    {filter.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Sort by
              </label>
              <div className="flex flex-wrap gap-2">
                {taskSortOptions.map((sort) => (
                  <button
                    key={sort.value}
                    onClick={() => setSortBy(sort.value)}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide border transition-colors"
                    style={{
                      background: sortBy === sort.value ? 'var(--accent-primary)' : 'transparent',
                      borderColor: sortBy === sort.value ? 'var(--accent-primary)' : 'var(--border-soft)',
                      color: sortBy === sort.value ? '#ffffff' : 'var(--text-primary)',
                    }}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.map((task) => {
          const TaskIcon = getTaskIcon(task.type);
          const colors = getTaskColor(task.type);
          const isDeleting = deletingTaskId === task.id;

          return (
            <div
              key={task.id}
              className="relative border-2 p-5 transition-all"
              style={{
                background: 'var(--bg-card)',
                borderColor: colors.border,
                opacity: task.completed ? 0.6 : 1,
              }}
            >
              {/* Type indicator strip */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: colors.border }} />

              {/* Header: Checkbox + Title */}
              <div className="flex items-start gap-3 mb-4 pt-2">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className="mt-0.5"
                  disabled={task.completed}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
                  ) : (
                    <Circle className="w-5 h-5" style={{ color: 'var(--border-medium)' }} />
                  )}
                </button>

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
                  {task.subject && (
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                      {task.subject}
                    </div>
                  )}
                </div>
              </div>

              {/* XP Display */}
              <div className="mb-4">
                <div className="text-3xl font-bold mb-1" style={{ color: colors.text }}>
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
                  <span className="font-bold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                    <Clock className="w-3 h-3" />
                    {task.time} min
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-tertiary)' }}>Type</span>
                  <span className="flex items-center gap-1">
                    <TaskIcon className="w-3 h-3" style={{ color: colors.text }} />
                    <span className="font-bold uppercase text-[10px]" style={{ color: colors.text }}>
                      {task.type}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-tertiary)' }}>Rank Impact</span>
                  <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
                    +{task.rankImpact}
                  </span>
                </div>
              </div>

              {/* Due badge */}
              {task.dueToday && !task.completed && (
                <div className="mb-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wide inline-block" style={{ background: '#fef2f2', color: '#991b1b' }}>
                  ⏰ Due Today
                </div>
              )}

              {/* Actions */}
              {!isDeleting ? (
                <div className="flex items-center gap-2">
                  {!task.completed && (
                    <button
                      onClick={() => handleStartTask(task)}
                      className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                      style={{ background: colors.border, color: '#ffffff' }}
                    >
                      <Play className="w-3 h-3" />
                      Start
                    </button>
                  )}
                  
                  <button
                    onClick={() => openEditPanel(task)}
                    className="p-2 transition-colors hover:opacity-70"
                    style={{ color: 'var(--text-tertiary)' }}
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setDeletingTaskId(task.id)}
                    className="p-2 transition-colors hover:opacity-70"
                    style={{ color: '#ef4444' }}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-3 border-2" style={{ background: '#fef2f2', borderColor: '#ef4444' }}>
                  <div className="text-xs font-bold mb-3" style={{ color: '#991b1b' }}>
                    Remove this task?
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeletingTaskId(null)}
                      className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wide border-2"
                      style={{ background: 'transparent', borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wide"
                      style={{ background: '#ef4444', color: '#ffffff' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Task Panel */}
      <TaskPanel
        open={showTaskPanel}
        onClose={closeTaskPanel}
        onSave={editingTask ? handleEditTask : handleAddTask}
        editingTask={editingTask}
      />
    </div>
  );
}