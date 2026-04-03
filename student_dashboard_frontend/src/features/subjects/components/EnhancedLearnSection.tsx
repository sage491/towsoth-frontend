import { useState } from 'react';
import { Search, Bookmark, Download, MessageSquare, Lightbulb, Clock, CheckCircle, Video, FileQuestion, ChevronDown, ChevronRight, Play, BookOpen, FileText, User, X, CheckCircle2, AlertCircle, MoreVertical, Eye, Grid3x3, List, Target } from 'lucide-react';
import type { SubjectLearnLesson, SubjectLearnModule } from '@/features/student/subjects/types';

interface EnhancedLearnSectionProps {
  courseTitle: string;
  courseCode: string;
}

interface Notification {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export function EnhancedLearnSection({ courseTitle: _courseTitle, courseCode: _courseCode }: EnhancedLearnSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2]);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);
  const [completedLessons] = useState<string[]>(['1-1', '1-2', '1-3', '2-1', '2-2']);
  const [currentLesson, setCurrentLesson] = useState('1-4');
  const [showNotes, setShowNotes] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [showLessonNotes, setShowLessonNotes] = useState<string | null>(null);
  const [showLessonMenu, setShowLessonMenu] = useState<string | null>(null);
  const [studyTime, setStudyTime] = useState({ today: 127, thisWeek: 485 });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lessonNotes, setLessonNotes] = useState<{ [key: string]: string }>({});
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list');
  const [focusMode, setFocusMode] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState<string | null>(null);

  const modules: SubjectLearnModule[] = [
    {
      id: 1,
      title: 'Fundamentals of Core Concepts',
      description: 'Foundational principles and theoretical framework',
      totalLessons: 5,
      duration: '2h 30m',
      progress: 65,
      lessons: [
        { 
          id: '1-1', 
          title: 'Introduction to Core Concepts', 
          duration: '25 min', 
          type: 'video', 
          difficulty: 'Beginner',
          instructor: 'Dr. Rajesh Verma',
          views: 1247,
          rating: 4.8,
          lastUpdated: 'Jan 15, 2026'
        },
        { 
          id: '1-2', 
          title: 'Fundamental Principles and Theorems', 
          duration: '32 min', 
          type: 'video', 
          difficulty: 'Beginner',
          instructor: 'Dr. Rajesh Verma',
          views: 1156,
          rating: 4.9,
          lastUpdated: 'Jan 16, 2026'
        },
        { 
          id: '1-3', 
          title: 'Problem-Solving Framework & Methodology', 
          duration: '28 min', 
          type: 'video', 
          difficulty: 'Intermediate',
          instructor: 'Dr. Rajesh Verma',
          views: 1089,
          rating: 4.7,
          lastUpdated: 'Jan 18, 2026'
        },
        { 
          id: '1-4', 
          title: 'Common Misconceptions and Pitfalls', 
          duration: '22 min', 
          type: 'video', 
          difficulty: 'Intermediate',
          instructor: 'Prof. Anita Sharma',
          views: 982,
          rating: 4.8,
          lastUpdated: 'Jan 20, 2026'
        },
        { 
          id: '1-5', 
          title: 'Practice Problems Set 1 - Application', 
          duration: '43 min', 
          type: 'practice', 
          difficulty: 'Intermediate',
          instructor: 'Dr. Rajesh Verma',
          views: 756,
          rating: 4.6,
          lastUpdated: 'Jan 22, 2026'
        },
      ]
    },
    {
      id: 2,
      title: 'Advanced Topics and Applications',
      description: 'Complex problem-solving and real-world scenarios',
      totalLessons: 7,
      duration: '3h 45m',
      progress: 28,
      lessons: [
        { 
          id: '2-1', 
          title: 'Complex Problem Analysis Techniques', 
          duration: '35 min', 
          type: 'video', 
          difficulty: 'Advanced',
          instructor: 'Dr. Rajesh Verma',
          views: 834,
          rating: 4.9,
          lastUpdated: 'Jan 24, 2026'
        },
        { 
          id: '2-2', 
          title: 'Advanced Mathematical Techniques', 
          duration: '42 min', 
          type: 'video', 
          difficulty: 'Advanced',
          instructor: 'Prof. Vikram Singh',
          views: 721,
          rating: 4.8,
          lastUpdated: 'Jan 26, 2026'
        },
        { 
          id: '2-3', 
          title: 'Real-World Applications and Case Studies', 
          duration: '30 min', 
          type: 'video', 
          difficulty: 'Advanced',
          instructor: 'Dr. Rajesh Verma',
          views: 645,
          rating: 4.7,
          lastUpdated: 'Jan 28, 2026'
        },
        { 
          id: '2-4', 
          title: 'Industry Case Studies and Analysis', 
          duration: '28 min', 
          type: 'reading', 
          difficulty: 'Advanced',
          instructor: 'Prof. Anita Sharma',
          views: 598,
          rating: 4.6,
          lastUpdated: 'Jan 29, 2026'
        },
        { 
          id: '2-5', 
          title: 'Expert Problem Solving Strategies', 
          duration: '38 min', 
          type: 'video', 
          difficulty: 'Expert',
          instructor: 'Dr. Rajesh Verma',
          views: 512,
          rating: 4.9,
          lastUpdated: 'Jan 30, 2026'
        },
        { 
          id: '2-6', 
          title: 'Competitive Exam Pattern Analysis', 
          duration: '32 min', 
          type: 'video', 
          difficulty: 'Expert',
          instructor: 'Prof. Vikram Singh',
          views: 467,
          rating: 4.8,
          lastUpdated: 'Feb 1, 2026'
        },
        { 
          id: '2-7', 
          title: 'Practice Problems Set 2 - Advanced', 
          duration: '50 min', 
          type: 'practice', 
          difficulty: 'Expert',
          instructor: 'Dr. Rajesh Verma',
          views: 389,
          rating: 4.7,
          lastUpdated: 'Feb 2, 2026'
        },
      ]
    },
    {
      id: 3,
      title: 'Mastery and Competitive Excellence',
      description: 'JEE/NEET level mastery and examination strategies',
      totalLessons: 6,
      duration: '2h 50m',
      progress: 0,
      locked: true,
      prerequisite: 'Complete Module 2 with >70% score'
    }
  ];

  // Progress timeline stages
  const progressStages = [
    { id: 1, label: 'Learn', active: true, completed: true },
    { id: 2, label: 'Practice', active: true, completed: false },
    { id: 3, label: 'Revise', active: false, completed: false },
    { id: 4, label: 'Test', active: false, completed: false },
  ];

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleBookmark = (lessonId: string) => {
    const isBookmarked = bookmarkedLessons.includes(lessonId);
    setBookmarkedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
    addNotification('success', isBookmarked ? 'Bookmark removed' : 'Lesson bookmarked');
  };

  const handleLessonAction = (lessonId: string, action: string) => {
    const lesson = modules.flatMap(m => m.lessons || []).find(l => l.id === lessonId);
    if (!lesson) return;

    setLoadingLesson(lessonId);

    setTimeout(() => {
      setLoadingLesson(null);
      
      if (action === 'start') {
        setCurrentLesson(lessonId);
        setStudyTime(prev => ({ ...prev, today: prev.today + 1 }));
        addNotification('info', `Starting: ${lesson.title}`);
      } else if (action === 'continue') {
        addNotification('info', `Continuing: ${lesson.title} from last position`);
      } else if (action === 'review') {
        addNotification('info', `Reviewing: ${lesson.title}`);
      }
      
      // In real app, would open lesson player in new workspace
      console.log(`Action: ${action}, Lesson: ${lessonId}`);
    }, 800);
  };

  const handleDownloadLesson = (lessonId: string) => {
    const lesson = modules.flatMap(m => m.lessons || []).find(l => l.id === lessonId);
    if (lesson) {
      addNotification('success', `Downloading: ${lesson.title}`);
    }
  };

  const handleOpenDiscussion = (lessonId: string) => {
    const lesson = modules.flatMap(m => m.lessons || []).find(l => l.id === lessonId);
    if (lesson) {
      setShowDiscussion(true);
      addNotification('info', `Opening discussion for: ${lesson.title}`);
    }
  };

  const handleShowNotes = (lessonId: string) => {
    setShowLessonNotes(lessonId);
    setShowLessonMenu(null);
    const lesson = modules.flatMap(m => m.lessons || []).find(l => l.id === lessonId);
    if (lesson) {
      addNotification('info', `Opening notes for: ${lesson.title}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' };
      case 'Intermediate': return { bg: '#DBEAFE', text: '#1E3A8A', border: '#BFDBFE' };
      case 'Advanced': return { bg: '#E9D5FF', text: '#6B21A8', border: '#D8B4FE' };
      case 'Expert': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'practice': return <FileQuestion className="w-4 h-4" />;
      case 'reading': return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const addNotification = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      type,
      message
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 4000);
  };

  const handleAddNote = (lessonId: string) => {
    const note = lessonNotes[lessonId] || '';
    if (note.trim()) {
      setLessonNotes(prev => ({ ...prev, [lessonId]: note }));
      addNotification('success', 'Note saved successfully');
    } else {
      addNotification('warning', 'Please enter a note');
    }
  };

  const handleDeleteNote = (lessonId: string) => {
    setLessonNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[lessonId];
      return newNotes;
    });
    addNotification('success', 'Note deleted');
  };

  const getLessonStatus = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) return 'completed';
    if (currentLesson === lessonId) return 'inprogress';
    return 'notstarted';
  };

  // Filter lessons based on status filter
  const getFilteredLessons = (lessons: SubjectLearnLesson[]) => {
    if (statusFilter === 'all') return lessons;
    return lessons.filter(lesson => {
      const status = getLessonStatus(lesson.id);
      if (statusFilter === 'completed') return status === 'completed';
      if (statusFilter === 'inprogress') return status === 'inprogress';
      if (statusFilter === 'notstarted') return status === 'notstarted';
      if (statusFilter === 'weak') return lesson.rating < 4.7; // Example: weak topics have lower ratings
      return true;
    });
  };

  // Get recommended next lesson
  const getNextRecommendedLesson = () => {
    for (const module of modules) {
      if (module.lessons) {
        for (const lesson of module.lessons) {
          if (lesson.id === currentLesson) {
            return lesson;
          }
        }
      }
    }
    return null;
  };

  const nextLesson = getNextRecommendedLesson();

  return (
    <div>
      {/* Professional Header */}
      <div 
        className="mb-6 px-6 py-5"
        style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Learning Path
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Structured curriculum designed for comprehensive mastery
            </p>
          </div>

          {/* Study Stats */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Today
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {studyTime.today}m
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                This Week
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {studyTime.thisWeek}m
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Streak
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                12d
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="flex items-center gap-2 mb-4">
          {progressStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-200"
                  style={{
                    background: stage.completed ? 'var(--accent-primary)' : stage.active ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                    color: stage.completed || stage.active ? (stage.completed ? '#ffffff' : 'var(--accent-primary)') : 'var(--text-tertiary)',
                    border: '1px solid',
                    borderColor: stage.completed ? 'var(--accent-primary)' : stage.active ? 'var(--accent-border)' : 'var(--border-soft)',
                  }}
                >
                  {stage.label}
                </div>
              </div>
              {index < progressStages.length - 1 && (
                <div 
                  className="w-8 h-0.5 mx-1"
                  style={{ background: stage.completed ? 'var(--accent-primary)' : 'var(--border-soft)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Focus Mode Toggle */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all duration-200"
              style={{
                background: focusMode ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: focusMode ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid',
                borderColor: focusMode ? 'var(--accent-primary)' : 'var(--border-soft)',
              }}
            >
              <Target className="w-4 h-4" />
              <span>Focus Mode {focusMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* View Toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('list')}
                className="p-2 transition-all duration-200"
                style={{
                  background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
                  color: viewMode === 'list' ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--border-soft)',
                }}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className="p-2 transition-all duration-200"
                style={{
                  background: viewMode === 'compact' ? 'var(--accent-primary)' : 'transparent',
                  color: viewMode === 'compact' ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: viewMode === 'compact' ? 'var(--accent-primary)' : 'var(--border-soft)',
                }}
                title="Compact view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold transition-all duration-200"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <option value="all">All Lessons</option>
              <option value="completed">Completed</option>
              <option value="inprogress">In Progress</option>
              <option value="notstarted">Not Started</option>
              <option value="weak">Weak Topics</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all duration-200"
              style={{
                background: showNotes ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: showNotes ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid',
                borderColor: showNotes ? 'var(--accent-primary)' : 'var(--border-soft)',
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Notes</span>
            </button>
            <button 
              onClick={() => setShowDiscussion(!showDiscussion)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all duration-200"
              style={{
                background: showDiscussion ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: showDiscussion ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid',
                borderColor: showDiscussion ? 'var(--accent-primary)' : 'var(--border-soft)',
              }}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discussion</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Next Action Panel */}
      {nextLesson && !focusMode && (
        <div 
          className="mx-6 mb-6 px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-200"
          style={{
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent-border)',
          }}
          onClick={() => handleLessonAction(nextLesson.id, 'continue')}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--accent-border)'}
        >
          <Lightbulb className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
          <div className="flex-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              Next recommended step:
            </span>
            <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>
              Continue "{nextLesson.title}"
            </span>
          </div>
          <Play className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
        </div>
      )}

      {/* Search Bar */}
      {!focusMode && (
        <div className="mx-6 mb-6">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
              style={{ color: 'var(--text-tertiary)' }} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons, topics, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 text-sm transition-all duration-200"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
            />
          </div>
        </div>
      )}

      {/* Learning Modules */}
      <div className="mx-6 space-y-4">
        {modules.map((module) => {
          const filteredLessons = module.lessons ? getFilteredLessons(module.lessons) : [];
          const showModule = !focusMode || module.id === 1; // In focus mode, show only current module

          if (!showModule && focusMode) return null;

          return (
            <div 
              key={module.id} 
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                opacity: module.locked ? 0.6 : 1,
              }}
            >
              {/* Professional Module Header */}
              <div 
                style={{
                  background: '#F8FAFC',
                  borderLeft: `4px solid ${module.locked ? '#94A3B8' : 'var(--accent-primary)'}`,
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                <div className="p-5">
                  <button
                    onClick={() => !module.locked && toggleModule(module.id)}
                    disabled={module.locked}
                    className="w-full flex items-center gap-4 text-left"
                  >
                    {/* Expand/Collapse Icon */}
                    <div className="flex-shrink-0">
                      {module.locked ? (
                        <svg className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                        </svg>
                      ) : expandedModules.includes(module.id) ? (
                        <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                      ) : (
                        <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                      )}
                    </div>

                    {/* Module Info */}
                    <div className="flex-1">
                      <h3 className="text-base font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-primary)' }}>
                        Module {module.id}: {module.title}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                        {module.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <span>{module.totalLessons} lessons</span>
                        <span>•</span>
                        <span>{module.duration}</span>
                        {module.locked && (
                          <>
                            <span>•</span>
                            <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                              {module.prerequisite}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress Badge */}
                    {!module.locked && (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>
                            Progress
                          </div>
                          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            {module.progress}%
                          </div>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Thin Progress Bar */}
                  {!module.locked && (
                    <div className="mt-4">
                      <div 
                        className="w-full h-1 overflow-hidden"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <div 
                          className="h-full transition-all duration-500"
                          style={{ 
                            width: `${module.progress}%`,
                            background: 'var(--accent-primary)',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lessons List */}
              {expandedModules.includes(module.id) && !module.locked && (
                <div style={{ borderTop: '1px solid var(--border-soft)' }}>
                  {filteredLessons.map((lesson, idx) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isCurrent = currentLesson === lesson.id;
                    const isBookmarked = bookmarkedLessons.includes(lesson.id);
                    const diffColors = getDifficultyColor(lesson.difficulty);
                    const isLoading = loadingLesson === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        className={`transition-all duration-200 ${viewMode === 'compact' ? 'p-4' : 'p-5'}`}
                        style={{
                          background: isCurrent ? 'var(--accent-soft)' : 'var(--bg-card)',
                          borderBottom: '1px solid var(--border-soft)',
                          borderLeft: isCurrent ? '4px solid var(--accent-primary)' : '4px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrent) e.currentTarget.style.background = 'var(--bg-secondary)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrent) e.currentTarget.style.background = 'var(--bg-card)';
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Status Icon */}
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: isCompleted 
                                ? '#D1FAE5' 
                                : isCurrent 
                                ? 'var(--accent-soft)' 
                                : 'var(--bg-secondary)',
                              border: '2px solid',
                              borderColor: isCompleted 
                                ? '#10B981' 
                                : isCurrent 
                                ? 'var(--accent-primary)' 
                                : 'var(--border-medium)',
                            }}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                            ) : (
                              <span 
                                className="text-sm font-bold"
                                style={{ 
                                  color: isCurrent ? 'var(--accent-primary)' : 'var(--text-secondary)' 
                                }}
                              >
                                {idx + 1}
                              </span>
                            )}
                          </div>

                          {/* Lesson Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 
                                  className={`font-bold mb-2 ${viewMode === 'compact' ? 'text-sm' : 'text-base'}`}
                                  style={{ 
                                    color: isCurrent ? 'var(--accent-primary)' : 'var(--text-primary)' 
                                  }}
                                >
                                  {lesson.title}
                                </h4>
                                
                                {/* Metadata Tags */}
                                {!focusMode && viewMode === 'list' && (
                                  <div className="flex items-center gap-2 flex-wrap mb-3">
                                    <div 
                                      className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold"
                                      style={{
                                        background: lesson.type === 'video' ? '#EDE9FE' :
                                                   lesson.type === 'practice' ? '#FED7AA' : '#DBEAFE',
                                        color: lesson.type === 'video' ? '#6B21A8' :
                                               lesson.type === 'practice' ? '#9A3412' : '#1E3A8A',
                                        border: '1px solid',
                                        borderColor: lesson.type === 'video' ? '#DDD6FE' :
                                                    lesson.type === 'practice' ? '#FDBA74' : '#BFDBFE',
                                      }}
                                    >
                                      {getTypeIcon(lesson.type)}
                                      <span className="uppercase">{lesson.type}</span>
                                    </div>
                                    
                                    <div 
                                      className="px-2 py-1 text-xs font-semibold"
                                      style={{
                                        background: diffColors.bg,
                                        color: diffColors.text,
                                        border: `1px solid ${diffColors.border}`,
                                      }}
                                    >
                                      {lesson.difficulty}
                                    </div>

                                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                      <Clock className="w-3 h-3" />
                                      <span>{lesson.duration}</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                      <User className="w-3 h-3" />
                                      <span>{lesson.instructor}</span>
                                    </div>
                                  </div>
                                )}

                                {/* Compact View Metadata */}
                                {viewMode === 'compact' && (
                                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    <span>{lesson.duration}</span>
                                    <span>•</span>
                                    <span>{lesson.type}</span>
                                    <span>•</span>
                                    <span>{lesson.difficulty}</span>
                                  </div>
                                )}
                              </div>

                              {/* Bookmark Button */}
                              <button
                                onClick={() => toggleBookmark(lesson.id)}
                                className="p-2 transition-all duration-200"
                                style={{
                                  background: isBookmarked ? '#FEF3C7' : 'transparent',
                                  color: isBookmarked ? '#B45309' : 'var(--text-tertiary)',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isBookmarked) {
                                    e.currentTarget.style.background = '#FEF3C7';
                                    e.currentTarget.style.color = '#B45309';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isBookmarked) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-tertiary)';
                                  }
                                }}
                              >
                                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                              </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleLessonAction(lesson.id, isCompleted ? 'review' : isCurrent ? 'continue' : 'start')}
                                disabled={isLoading}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${viewMode === 'compact' ? 'px-3 py-1.5' : ''}`}
                                style={{
                                  background: isCurrent 
                                    ? 'var(--accent-primary)' 
                                    : isCompleted
                                    ? 'var(--bg-secondary)'
                                    : 'var(--accent-primary)',
                                  color: isCurrent || !isCompleted ? '#ffffff' : 'var(--text-primary)',
                                  border: '1px solid',
                                  borderColor: isCurrent 
                                    ? 'var(--accent-primary)' 
                                    : isCompleted
                                    ? 'var(--border-medium)'
                                    : 'var(--accent-primary)',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isLoading) e.currentTarget.style.opacity = '0.9';
                                }}
                                onMouseLeave={(e) => {
                                  if (!isLoading) e.currentTarget.style.opacity = '1';
                                }}
                              >
                                {isLoading ? (
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <>
                                    {isCompleted ? (
                                      <>
                                        <Eye className="w-3.5 h-3.5" />
                                        Review
                                      </>
                                    ) : isCurrent ? (
                                      <>
                                        <Play className="w-3.5 h-3.5" />
                                        Continue
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-3.5 h-3.5" />
                                        Start
                                      </>
                                    )}
                                  </>
                                )}
                              </button>

                              {!focusMode && (
                                <>
                                  <button 
                                    onClick={() => handleShowNotes(lesson.id)}
                                    className="p-2 transition-all duration-200"
                                    style={{
                                      background: 'var(--bg-card)',
                                      color: 'var(--text-secondary)',
                                      border: '1px solid var(--border-soft)',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
                                    title="Notes"
                                  >
                                    <Lightbulb className="w-4 h-4" />
                                  </button>

                                  <button 
                                    onClick={() => handleDownloadLesson(lesson.id)}
                                    className="p-2 transition-all duration-200"
                                    style={{
                                      background: 'var(--bg-card)',
                                      color: 'var(--text-secondary)',
                                      border: '1px solid var(--border-soft)',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>

                                  <div className="relative">
                                    <button 
                                      onClick={() => setShowLessonMenu(showLessonMenu === lesson.id ? null : lesson.id)}
                                      className="p-2 transition-all duration-200"
                                      style={{
                                        background: showLessonMenu === lesson.id ? 'var(--accent-soft)' : 'var(--bg-card)',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border-soft)',
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
                                      title="More options"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showLessonMenu === lesson.id && (
                                      <div 
                                        className="absolute right-0 mt-1 w-48 z-50 shadow-lg"
                                        style={{
                                          background: 'var(--bg-card)',
                                          border: '1px solid var(--border-medium)',
                                        }}
                                      >
                                        <button
                                          onClick={() => {
                                            handleOpenDiscussion(lesson.id);
                                            setShowLessonMenu(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2 transition-all duration-200"
                                          style={{ color: 'var(--text-primary)' }}
                                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                          <MessageSquare className="w-3.5 h-3.5" />
                                          Discussion
                                        </button>
                                        <button
                                          onClick={() => {
                                            toggleBookmark(lesson.id);
                                            setShowLessonMenu(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2 transition-all duration-200"
                                          style={{ color: 'var(--text-primary)' }}
                                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                          <Bookmark className="w-3.5 h-3.5" />
                                          {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredLessons.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        No lessons match the selected filter
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="px-4 py-3 shadow-lg flex items-center gap-3 animate-fadeIn"
            style={{
              background: 
                notification.type === 'success' ? '#D1FAE5' :
                notification.type === 'error' ? '#FEE2E2' :
                notification.type === 'warning' ? '#FEF3C7' :
                '#DBEAFE',
              border: '1px solid',
              borderColor:
                notification.type === 'success' ? '#10B981' :
                notification.type === 'error' ? '#EF4444' :
                notification.type === 'warning' ? '#F59E0B' :
                '#3B82F6',
              color:
                notification.type === 'success' ? '#065F46' :
                notification.type === 'error' ? '#991B1B' :
                notification.type === 'warning' ? '#B45309' :
                '#1E3A8A',
            }}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {notification.type === 'warning' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {notification.type === 'info' && <Lightbulb className="w-4 h-4 flex-shrink-0" />}
            <span className="text-xs font-semibold">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Notes Panel */}
      {showLessonNotes && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={() => setShowLessonNotes(null)}
        >
          <div 
            className="w-full max-w-2xl p-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Lesson Notes
              </h3>
              <button
                onClick={() => setShowLessonNotes(null)}
                className="text-sm font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={lessonNotes[showLessonNotes] || ''}
              onChange={(e) => setLessonNotes(prev => ({ ...prev, [showLessonNotes]: e.target.value }))}
              placeholder="Write your notes here..."
              className="w-full h-64 p-4 text-sm mb-4 resize-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-primary)',
              }}
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleDeleteNote(showLessonNotes)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  handleAddNote(showLessonNotes);
                  setShowLessonNotes(null);
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200"
                style={{
                  background: 'var(--accent-primary)',
                  color: '#ffffff',
                  border: '1px solid var(--accent-primary)',
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discussion Panel */}
      {showDiscussion && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={() => setShowDiscussion(false)}
        >
          <div 
            className="w-full max-w-3xl p-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Discussion Forum
              </h3>
              <button
                onClick={() => setShowDiscussion(false)}
                className="text-sm font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Discussion feature coming soon
              </p>
            </div>
          </div>
        </div>
      )}

      {/* My Notes Panel */}
      {showNotes && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={() => setShowNotes(false)}
        >
          <div 
            className="w-full max-w-3xl p-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                My Notes
              </h3>
              <button
                onClick={() => setShowNotes(false)}
                className="text-sm font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {Object.keys(lessonNotes).length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No notes yet. Start adding notes to your lessons!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(lessonNotes).map(([lessonId, note]) => {
                  const lesson = modules.flatMap(m => m.lessons || []).find(l => l.id === lessonId);
                  return (
                    <div 
                      key={lessonId}
                      className="p-4"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-soft)',
                      }}
                    >
                      <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {lesson?.title || 'Unknown Lesson'}
                      </h4>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {note}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}