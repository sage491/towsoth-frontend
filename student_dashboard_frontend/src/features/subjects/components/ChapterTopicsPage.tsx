import { useState } from 'react';
import { ArrowLeft, ChevronRight, Clock, CheckCircle2, Circle, BookOpen, PlayCircle, BarChart2, FileText, AlertTriangle, ChevronDown } from 'lucide-react';
import { TopicResourcesPage } from './TopicResourcesPage';

interface Topic {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  progress: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  completedSubtopics: number;
  totalSubtopics: number;
  lastStudied?: string;
  weaknessDetected?: boolean;
  subtopics: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
  }[];
}

interface ChapterTopicsPageProps {
  chapterTitle: string;
  chapterCode: string;
  instructor: string;
  onBack: () => void;
  onNavigateToSubjects: () => void;
}

type ChapterTab = 'learn' | 'practice' | 'revise' | 'test' | 'weak-topics' | 'analytics' | 'notes';

const chapterTabs: Array<{ id: ChapterTab; icon: typeof BookOpen; label: string }> = [
  { id: 'learn', icon: BookOpen, label: 'Learn' },
  { id: 'practice', icon: PlayCircle, label: 'Practice' },
  { id: 'revise', icon: FileText, label: 'Revise' },
  { id: 'test', icon: CheckCircle2, label: 'Test' },
  { id: 'weak-topics', icon: AlertTriangle, label: 'Weak Topics' },
  { id: 'analytics', icon: BarChart2, label: 'Learning Analytics' },
  { id: 'notes', icon: BookOpen, label: 'Notes & Resources' },
];

export function ChapterTopicsPage({ chapterTitle, chapterCode, instructor, onBack, onNavigateToSubjects }: ChapterTopicsPageProps) {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedTab, setSelectedTab] = useState<ChapterTab>('learn');

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  // Mock topics data
  const topics: Topic[] = [
    {
      id: 'em-induction',
      title: 'Electromagnetic Induction',
      description: 'Faraday\'s law, Lenz\'s law, and induced EMF',
      estimatedTime: '3h 30m',
      difficulty: 'ADVANCED',
      progress: 85,
      status: 'IN_PROGRESS',
      completedSubtopics: 3,
      totalSubtopics: 4,
      lastStudied: '2 hours ago',
      weaknessDetected: false,
      subtopics: [
        { id: '1', title: 'Faraday\'s Law', duration: '45 min', completed: true },
        { id: '2', title: 'Lenz\'s Law', duration: '35 min', completed: true },
        { id: '3', title: 'Induced EMF', duration: '50 min', completed: true },
        { id: '4', title: 'Applications', duration: '40 min', completed: false },
      ]
    },
    {
      id: 'rotation',
      title: 'Rotational Dynamics',
      description: 'Torque, angular momentum, and rotational motion',
      estimatedTime: '4h 15m',
      difficulty: 'ADVANCED',
      progress: 60,
      status: 'IN_PROGRESS',
      completedSubtopics: 2,
      totalSubtopics: 4,
      lastStudied: '1 day ago',
      weaknessDetected: true,
      subtopics: [
        { id: '1', title: 'Torque & Angular Momentum', duration: '55 min', completed: true },
        { id: '2', title: 'Moment of Inertia', duration: '50 min', completed: true },
        { id: '3', title: 'Rolling Motion', duration: '45 min', completed: false },
        { id: '4', title: 'Conservation Laws', duration: '40 min', completed: false },
      ]
    },
    {
      id: 'thermodynamics',
      title: 'Thermodynamics',
      description: 'Laws of thermodynamics, heat engines, and entropy',
      estimatedTime: '5h 20m',
      difficulty: 'EXPERT',
      progress: 25,
      status: 'IN_PROGRESS',
      completedSubtopics: 1,
      totalSubtopics: 4,
      lastStudied: '3 days ago',
      weaknessDetected: false,
      subtopics: [
        { id: '1', title: 'First Law', duration: '60 min', completed: true },
        { id: '2', title: 'Second Law', duration: '65 min', completed: false },
        { id: '3', title: 'Heat Engines', duration: '55 min', completed: false },
        { id: '4', title: 'Entropy', duration: '70 min', completed: false },
      ]
    },
    {
      id: 'optics',
      title: 'Ray Optics and Wave Optics',
      description: 'Reflection, refraction, interference, and diffraction',
      estimatedTime: '4h 45m',
      difficulty: 'INTERMEDIATE',
      progress: 0,
      status: 'NOT_STARTED',
      completedSubtopics: 0,
      totalSubtopics: 4,
      lastStudied: undefined,
      weaknessDetected: false,
      subtopics: [
        { id: '1', title: 'Ray Optics', duration: '50 min', completed: false },
        { id: '2', title: 'Wave Theory', duration: '55 min', completed: false },
        { id: '3', title: 'Interference', duration: '60 min', completed: false },
        { id: '4', title: 'Diffraction', duration: '50 min', completed: false },
      ]
    },
    {
      id: 'waves',
      title: 'Wave Motion and Sound',
      description: 'Mechanical waves, sound propagation, and wave interference',
      estimatedTime: '3h 50m',
      difficulty: 'INTERMEDIATE',
      progress: 0,
      status: 'NOT_STARTED',
      completedSubtopics: 0,
      totalSubtopics: 4,
      lastStudied: undefined,
      weaknessDetected: false,
      subtopics: [
        { id: '1', title: 'Wave Fundamentals', duration: '45 min', completed: false },
        { id: '2', title: 'Sound Waves', duration: '50 min', completed: false },
        { id: '3', title: 'Doppler Effect', duration: '40 min', completed: false },
        { id: '4', title: 'Standing Waves', duration: '55 min', completed: false },
      ]
    },
    {
      id: 'modern-physics',
      title: 'Modern Physics',
      description: 'Quantum mechanics, atomic structure, and nuclear physics',
      estimatedTime: '6h 10m',
      difficulty: 'EXPERT',
      progress: 100,
      status: 'COMPLETED',
      completedSubtopics: 5,
      totalSubtopics: 5,
      lastStudied: '1 week ago',
      weaknessDetected: false,
      subtopics: [
        { id: '1', title: 'Photoelectric Effect', duration: '60 min', completed: true },
        { id: '2', title: 'Bohr Model', duration: '65 min', completed: true },
        { id: '3', title: 'De Broglie Wavelength', duration: '55 min', completed: true },
        { id: '4', title: 'Nuclear Physics', duration: '80 min', completed: true },
        { id: '5', title: 'Radioactivity', duration: '70 min', completed: true },
      ]
    },
  ];

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' };
      case 'INTERMEDIATE':
        return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' };
      case 'ADVANCED':
        return { bg: '#FAF5FF', text: '#6B21A8', border: '#E9D5FF' };
      case 'EXPERT':
        return { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' };
      default:
        return { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' };
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', icon: CheckCircle2 };
      case 'IN_PROGRESS':
        return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', icon: Circle };
      case 'NOT_STARTED':
        return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0', icon: Circle };
      default:
        return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0', icon: Circle };
    }
  };

  const completedCount = topics.filter(t => t.status === 'COMPLETED').length;
  const inProgressCount = topics.filter(t => t.status === 'IN_PROGRESS').length;
  const avgProgress = Math.round(topics.reduce((sum, t) => sum + t.progress, 0) / topics.length);

  // If a topic is selected, show the resources page
  if (selectedTopic) {
    return (
      <TopicResourcesPage
        chapterTitle={chapterTitle}
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
        onNavigateToChapter={() => setSelectedTopic(null)}
        onNavigateToSubjects={onNavigateToSubjects}
      />
    );
  }

  return (
    <div className="flex h-screen" style={{ background: '#F8FAFC' }}>
      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg animate-fadeIn" style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46' }}>
          <span className="text-sm font-semibold">{showFeedback}</span>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-3 text-xs font-semibold hover:bg-slate-50 transition-colors border-b"
          style={{ color: '#64748B', borderColor: '#E2E8F0' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </button>

        {/* Chapter Info */}
        <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>
            {chapterCode}
          </div>
          <h2 className="text-sm font-bold mb-2" style={{ color: '#0F172A' }}>
            {chapterTitle}
          </h2>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#E2E8F0', color: '#475569' }}>
              D
            </div>
            <span>{instructor}</span>
          </div>
          <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>
            Instructor
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 overflow-y-auto">
          {chapterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-50 transition-colors border-l-4"
                style={{
                  background: isActive ? '#F1F5F9' : 'transparent',
                  color: isActive ? '#5B5F8D' : '#64748B',
                  borderColor: isActive ? '#5B5F8D' : 'transparent'
                }}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={onNavigateToSubjects}
              className="text-xs font-medium uppercase tracking-wide hover:underline transition-all"
              style={{ color: '#64748B' }}
            >
              MY SUBJECTS
            </button>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#0F172A' }}>
              {chapterTitle.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#0F172A' }}>
              {chapterTitle}
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Topic-wise curriculum with hierarchical learning structure
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 border" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>
                Total Topics
              </div>
              <div className="text-2xl font-bold" style={{ color: '#0F172A' }}>
                {topics.length}
              </div>
            </div>
            <div className="p-3 border" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#166534' }}>
                Completed
              </div>
              <div className="text-2xl font-bold" style={{ color: '#166534' }}>
                {completedCount}
              </div>
            </div>
            <div className="p-3 border" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#1E40AF' }}>
                In Progress
              </div>
              <div className="text-2xl font-bold" style={{ color: '#1E40AF' }}>
                {inProgressCount}
              </div>
            </div>
            <div className="p-3 border" style={{ background: '#FAF5FF', borderColor: '#E9D5FF' }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#6B21A8' }}>
                Avg Progress
              </div>
              <div className="text-2xl font-bold" style={{ color: '#6B21A8' }}>
                {avgProgress}%
              </div>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="px-6 py-5">
          <div className="space-y-3">
            {topics.map((topic) => {
              const diffStyles = getDifficultyStyles(topic.difficulty);
              const statusStyles = getStatusStyles(topic.status);
              const StatusIcon = statusStyles.icon;
              const isExpanded = expandedTopic === topic.id;

              return (
                <div
                  key={topic.id}
                  className="border transition-all"
                  style={{
                    background: '#FFFFFF',
                    borderColor: isExpanded ? '#5B5F8D' : '#E2E8F0',
                    borderWidth: isExpanded ? '2px' : '1px'
                  }}
                >
                  {/* Main Topic Row */}
                  <div className="flex items-center gap-4 p-4">
                    {/* Left Section: Status & Topic Info (60%) */}
                    <div className="flex-1 flex items-center gap-4">
                      {/* Status Indicator */}
                      <div className="flex items-center justify-center w-10 h-10 border-2" style={{ borderColor: statusStyles.border, background: statusStyles.bg }}>
                        <StatusIcon className="w-5 h-5" style={{ color: statusStyles.text }} />
                      </div>

                      {/* Topic Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>
                            {topic.title}
                          </h3>
                          {topic.weaknessDetected && (
                            <div className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold uppercase" style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}>
                              <AlertTriangle className="w-3 h-3" />
                              WEAKNESS
                            </div>
                          )}
                        </div>
                        <p className="text-xs mb-2" style={{ color: '#64748B' }}>
                          {topic.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <div
                            className="px-2 py-0.5 text-xs font-bold uppercase tracking-wide"
                            style={{
                              background: diffStyles.bg,
                              color: diffStyles.text,
                              border: `1px solid ${diffStyles.border}`
                            }}
                          >
                            {topic.difficulty}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#64748B' }}>
                            <Clock className="w-3.5 h-3.5" />
                            {topic.estimatedTime}
                          </div>
                          <div className="text-xs font-medium" style={{ color: '#64748B' }}>
                            {topic.completedSubtopics}/{topic.totalSubtopics} Subtopics
                          </div>
                          {topic.lastStudied && (
                            <div className="text-xs font-medium" style={{ color: '#94A3B8' }}>
                              • Last: {topic.lastStudied}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Progress & Actions (40%) */}
                    <div className="flex items-center gap-6">
                      {/* Progress Visualization */}
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-bold uppercase tracking-wide" style={{ color: '#64748B' }}>
                            PROGRESS
                          </div>
                          <div className="text-sm font-bold" style={{ color: topic.progress === 100 ? '#166534' : '#5B5F8D' }}>
                            {topic.progress}%
                          </div>
                        </div>
                        <div className="h-2 overflow-hidden" style={{ background: '#E2E8F0' }}>
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${topic.progress}%`,
                              background: topic.progress === 100 ? '#16A34A' : topic.progress > 50 ? '#5B5F8D' : '#94A3B8'
                            }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTopic(topic);
                            showMicroFeedback('→ Opening topic resources...');
                          }}
                          className="px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2"
                          style={{ background: '#5B5F8D', color: '#FFFFFF' }}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          OPEN
                        </button>
                        <button
                          onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                          className="px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-1.5"
                          style={{
                            background: isExpanded ? '#F1F5F9' : 'transparent',
                            color: '#475569',
                            border: '1px solid #CBD5E1'
                          }}
                        >
                          <ChevronDown 
                            className="w-3.5 h-3.5 transition-transform duration-200"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                          {isExpanded ? 'COLLAPSE' : 'EXPAND'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Subtopics Section */}
                  {isExpanded && (
                    <div className="border-t px-4 py-3" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>
                          SUBTOPIC BREAKDOWN
                        </div>
                        <div className="text-xs font-medium" style={{ color: '#64748B' }}>
                          {topic.completedSubtopics} of {topic.totalSubtopics} completed
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {topic.subtopics.map((subtopic, idx) => (
                          <div
                            key={subtopic.id}
                            onClick={() => {
                              setSelectedTopic(topic);
                              showMicroFeedback(`→ Opening ${subtopic.title}...`);
                            }}
                            className="flex items-center gap-3 p-3 border cursor-pointer hover:border-blue-400 transition-all"
                            style={{
                              background: subtopic.completed ? '#F0FDF4' : '#FFFFFF',
                              borderColor: subtopic.completed ? '#BBF7D0' : '#E2E8F0'
                            }}
                          >
                            {/* Subtopic Number */}
                            <div
                              className="w-7 h-7 flex items-center justify-center text-xs font-bold"
                              style={{
                                background: subtopic.completed ? '#16A34A' : '#CBD5E1',
                                color: '#FFFFFF'
                              }}
                            >
                              {idx + 1}
                            </div>
                            
                            {/* Subtopic Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="text-xs font-bold" style={{ color: '#0F172A' }}>
                                  {subtopic.title}
                                </div>
                                {subtopic.completed && (
                                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#16A34A' }} />
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
                                <Clock className="w-3 h-3" />
                                {subtopic.duration}
                              </div>
                            </div>

                            {/* Arrow */}
                            <ChevronRight className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
