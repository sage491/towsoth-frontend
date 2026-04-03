import { useState } from 'react';
import { ArrowLeft, ChevronRight, Clock, Target, BookOpen, FileText, CheckCircle2, Circle, Grid3x3, List } from 'lucide-react';
import { topicCatalog, type SubjectTopic } from './topicCatalog';
import { toSlug } from '@/features/subjects/utils/routing';

interface TopicSelectionPageProps {
  subject: string;
  onBack: () => void;
  onNavigateToTopic: (topic: SubjectTopic, subtopicSlug?: string) => void;
  onNavigateToSubject: () => void;
}

export function TopicSelectionPage({ subject, onBack, onNavigateToTopic, onNavigateToSubject }: TopicSelectionPageProps) {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  const topics = topicCatalog;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return { bg: '#D1FAE5', text: '#065F46' };
      case 'Intermediate': return { bg: '#DBEAFE', text: '#1E3A8A' };
      case 'Advanced': return { bg: '#E9D5FF', text: '#6B21A8' };
      case 'Expert': return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const getStatusIcon = (_status: string, progress: number) => {
    if (progress === 100) {
      return <CheckCircle2 className="w-6 h-6" style={{ color: '#10B981' }} />;
    }
    return <Circle className="w-6 h-6" style={{ color: '#D1D5DB' }} />;
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      {/* Feedback Toast */}
      {showFeedback && (
        <div 
          className="fixed top-4 right-6 z-50 px-4 py-3 shadow-lg text-sm font-semibold animate-fadeIn"
          style={{ 
            background: '#D1FAE5', 
            border: '1px solid #10B981', 
            color: '#065F46',
            borderRadius: '4px'
          }}
        >
          {showFeedback}
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-6 border-b" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: '#5B5F8D' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subjects
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onNavigateToSubject}
            className="text-xs font-medium uppercase hover:underline"
            style={{ color: '#6B7280' }}
          >
            My Subjects
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#D1D5DB' }} />
          <span className="text-xs font-bold uppercase" style={{ color: '#111827' }}>
            {subject.toUpperCase()}
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>
          {subject.toUpperCase()}
        </h1>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>
          Topics
        </h2>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Select a topic to access notes, resources, and practice materials
        </p>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => {
              setViewMode('card');
              showMicroFeedback('✓ Switched to card view');
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all"
            style={{
              background: viewMode === 'card' ? '#5B5F8D' : '#FFFFFF',
              color: viewMode === 'card' ? '#FFFFFF' : '#6B7280',
              border: '1px solid #D1D5DB'
            }}
          >
            <Grid3x3 className="w-4 h-4" />
            CARD VIEW
          </button>
          <button
            onClick={() => {
              setViewMode('list');
              showMicroFeedback('✓ Switched to list view');
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all"
            style={{
              background: viewMode === 'list' ? '#5B5F8D' : '#FFFFFF',
              color: viewMode === 'list' ? '#FFFFFF' : '#6B7280',
              border: '1px solid #D1D5DB'
            }}
          >
            <List className="w-4 h-4" />
            LIST VIEW
          </button>
        </div>
      </div>

      {/* Topics Content */}
      <div className="px-6 py-6">
        <div className="max-w-6xl">
          {/* Card View */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => {
                const diffColors = getDifficultyColor(topic.difficulty);

                return (
                  <div
                    key={topic.id}
                    className="border transition-shadow hover:shadow-lg cursor-pointer"
                    style={{
                      background: '#FFFFFF',
                      borderColor: '#E5E7EB',
                    }}
                      onClick={() => {
                      onNavigateToTopic(topic);
                      showMicroFeedback('→ Opening topic...');
                    }}
                  >
                    {/* Card Content */}
                    <div className="p-5">
                      {/* Status Icon */}
                      <div className="flex items-center justify-between mb-4">
                        {getStatusIcon(topic.status, topic.progress)}
                        <div
                          className="px-2 py-0.5 text-[10px] font-bold uppercase"
                          style={{
                            background: diffColors.bg,
                            color: diffColors.text,
                          }}
                        >
                          {topic.difficulty}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base font-bold mb-2 line-clamp-2" style={{ color: '#111827' }}>
                        {topic.title}
                      </h3>
                      <p className="text-xs mb-4 line-clamp-2" style={{ color: '#6B7280' }}>
                        {topic.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
                            PROGRESS
                          </span>
                          <span className="text-sm font-bold" style={{ color: '#111827' }}>
                            {topic.progress}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${topic.progress}%`,
                              background: topic.progress === 100 ? '#10B981' : '#5B5F8D'
                            }}
                          />
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs pt-4 border-t" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {topic.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          {topic.subtopics.length} topics
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {topics.map((topic) => {
                const diffColors = getDifficultyColor(topic.difficulty);
                const isExpanded = expandedTopic === topic.id;

                return (
                  <div
                    key={topic.id}
                    className="border transition-shadow hover:shadow-md"
                    style={{
                      background: '#FFFFFF',
                      borderColor: '#E5E7EB',
                    }}
                  >
                    {/* Topic Card */}
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(topic.status, topic.progress)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Title & Description */}
                          <h3 className="text-lg font-bold mb-2" style={{ color: '#111827' }}>
                            {topic.title}
                          </h3>
                          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                            {topic.description}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="px-2.5 py-1 text-xs font-bold uppercase"
                              style={{
                                background: diffColors.bg,
                                color: diffColors.text,
                              }}
                            >
                              {topic.difficulty}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm" style={{ color: '#6B7280' }}>
                              <Clock className="w-4 h-4" />
                              {topic.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm" style={{ color: '#6B7280' }}>
                              <BookOpen className="w-4 h-4" />
                              {topic.subtopics.length} subtopics
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <button
                              onClick={() => {
                                onNavigateToTopic(topic);
                                showMicroFeedback('→ Opening notes & resources...');
                              }}
                              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                              style={{ background: '#5B5F8D', color: '#FFFFFF' }}
                            >
                              <BookOpen className="w-4 h-4" />
                              VIEW NOTES & RESOURCES
                            </button>
                            <button
                              onClick={() => {
                                setExpandedTopic(isExpanded ? null : topic.id);
                                showMicroFeedback(isExpanded ? '✓ Collapsed subtopics' : '→ Showing subtopics...');
                              }}
                              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                              style={{
                                background: '#FFFFFF',
                                color: '#374151',
                                border: '1px solid #D1D5DB'
                              }}
                            >
                              <FileText className="w-4 h-4" />
                              VIEW SUBTOPICS
                            </button>
                            <button
                              onClick={() => showMicroFeedback('→ Starting practice session...')}
                              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                              style={{
                                background: '#FFFFFF',
                                color: '#374151',
                                border: '1px solid #D1D5DB'
                              }}
                            >
                              <Target className="w-4 h-4" />
                              START PRACTICE
                            </button>
                          </div>
                        </div>

                        {/* Progress (Right Side) */}
                        <div className="w-24 flex-shrink-0 text-right">
                          <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF' }}>
                            PROGRESS
                          </div>
                          <div className="mb-2">
                            <div className="w-full h-2 rounded-full overflow-hidden mb-1" style={{ background: '#E5E7EB' }}>
                              <div
                                className="h-full transition-all duration-500"
                                style={{
                                  width: `${topic.progress}%`,
                                  background: topic.progress === 100 ? '#10B981' : '#5B5F8D'
                                }}
                              />
                            </div>
                          </div>
                          <div className="text-2xl font-bold" style={{ color: '#111827' }}>
                            {topic.progress}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Subtopics */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t" style={{ borderColor: '#E5E7EB' }}>
                        <div className="pt-4">
                          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#9CA3AF' }}>
                            SUBTOPICS
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {topic.subtopics.map((subtopic) => (
                              <button
                                key={subtopic.id}
                                className="p-4 border flex items-center justify-between hover:shadow-md transition-all text-left"
                                style={{ 
                                  borderColor: '#E5E7EB', 
                                  background: '#FAFAFA'
                                }}
                                onClick={() => {
                                  onNavigateToTopic(topic, toSlug(subtopic.title));
                                  showMicroFeedback(`→ Opening ${subtopic.title}...`);
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  {subtopic.completed ? (
                                    <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
                                  ) : (
                                    <Circle className="w-5 h-5" style={{ color: '#D1D5DB' }} />
                                  )}
                                  <div>
                                    <div className="text-sm font-semibold mb-0.5" style={{ color: '#111827' }}>
                                      {subtopic.title}
                                    </div>
                                    <div className="text-xs" style={{ color: '#9CA3AF' }}>
                                      {subtopic.duration}
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4" style={{ color: '#9CA3AF' }} />
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
          )}
        </div>
      </div>
    </div>
  );
}