import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, BookmarkPlus, Download, Brain, Play, FileText, Video, FileQuestion, Link2, ChevronDown, ChevronRight, Lightbulb, Calendar, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getNotesResourcesPageContent, type NotesResourcesCollections, type NotesSection } from '@/services/subjectResourceService';

type ResourceClickType = 'formula' | 'concept' | 'diagram' | 'mistakes' | 'strategy' | 'reference';
type ResourceTab = 'notes' | 'videos' | 'pdfs' | 'practice' | 'links';

interface NotesSubtopic {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  concepts: string[];
  progress: number;
}

interface NotesResourcesPageProps {
  subject: string;
  topic: string;
  subtopic: NotesSubtopic;
  onBack: () => void;
  onNavigateToSubject: () => void;
  onNavigateToTopic: () => void;
  onMarkComplete: () => void;
  onAddToRevision: () => void;
  onStartPractice: () => void;
  onResourceClick: (type: ResourceClickType, title: string) => void;
}

export function NotesResourcesPage({
  subject,
  topic,
  subtopic,
  onBack,
  onNavigateToSubject,
  onNavigateToTopic,
  onMarkComplete,
  onAddToRevision,
  onStartPractice,
  onResourceClick
}: NotesResourcesPageProps) {
  const [activeTab, setActiveTab] = useState<ResourceTab>('notes');
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [notesSections, setNotesSections] = useState<NotesSection[]>([]);
  const [resources, setResources] = useState<NotesResourcesCollections>({ videos: [], pdfs: [], practice: [], links: [] });
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
    onMarkComplete();
    showMicroFeedback('✓ Marked as completed!');
  };

  const handleAddToRevision = () => {
    onAddToRevision();
    showMicroFeedback('✓ Added to revision plan');
  };

  const handleStartPractice = () => {
    onStartPractice();
    showMicroFeedback('→ Opening practice section...');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showMicroFeedback(isBookmarked ? '✓ Bookmark removed' : '✓ Bookmarked for later');
  };

  const handleDownload = () => {
    showMicroFeedback('⬇ Downloading notes...');
  };

  const toggleSection = (id: number) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' };
      case 'Intermediate': return { bg: '#DBEAFE', text: '#1E3A8A', border: '#BFDBFE' };
      case 'Advanced': return { bg: '#E9D5FF', text: '#6B21A8', border: '#D8B4FE' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const diffColors = getDifficultyColor(subtopic.difficulty);

  const resourceTabs: Array<{ id: ResourceTab; label: string; icon: typeof FileText }> = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'videos', label: 'Video Lectures', icon: Video },
    { id: 'pdfs', label: 'PDFs', icon: Download },
    { id: 'practice', label: 'Practice Problems', icon: FileQuestion },
    { id: 'links', label: 'Reference Links', icon: Link2 },
  ];

  useEffect(() => {
    let isMounted = true;

    getNotesResourcesPageContent()
      .then((data) => {
        if (!isMounted) return;
        setNotesSections(data.notesSections);
        setResources(data.resources);
        setRelatedTopics(data.relatedTopics);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsContentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isContentLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="px-4 md:px-6 py-6 space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-[520px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header with Breadcrumbs */}
      <div className="px-4 md:px-6 py-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 px-3 py-2 text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent-primary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Topics
        </button>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button
            onClick={onNavigateToSubject}
            className="text-sm font-medium hover:underline transition-all"
            style={{ color: 'var(--text-tertiary)' }}
          >
            My Subjects
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <button
            onClick={onNavigateToSubject}
            className="text-sm font-medium hover:underline transition-all"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {subject}
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <button
            onClick={onNavigateToTopic}
            className="text-sm font-medium hover:underline transition-all"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {topic}
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {subtopic.title}
          </span>
        </div>

        {/* Title and Metadata */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              {subtopic.title}
            </h1>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {subtopic.description}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="px-3 py-1 text-xs font-bold uppercase"
                style={{
                  background: diffColors.bg,
                  color: diffColors.text,
                  border: `1px solid ${diffColors.border}`
                }}
              >
                {subtopic.difficulty}
              </div>
              <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Clock className="w-4 h-4" />
                {subtopic.estimatedTime}
              </div>
              <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Target className="w-4 h-4" />
                {subtopic.concepts.length} key concepts
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="lg:w-48">
            <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Your Progress
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${subtopic.progress}%`,
                      background: subtopic.progress === 100 ? '#10B981' : 'var(--accent-primary)'
                    }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {subtopic.progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="px-4 md:px-6 py-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleMarkComplete}
            disabled={isCompleted}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: isCompleted ? '#10B981' : 'var(--accent-primary)',
              color: '#ffffff',
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Completed' : 'Mark as Completed'}
          </button>

          <button
            onClick={handleAddToRevision}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all hover:opacity-90"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <Calendar className="w-4 h-4" />
            Add to Revision
          </button>

          <button
            onClick={handleStartPractice}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all hover:opacity-90"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <Play className="w-4 h-4" />
            Start Practice
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all hover:opacity-90"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <Download className="w-4 h-4" />
            Download Notes
          </button>

          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all hover:opacity-90 ${
              isBookmarked ? 'bg-yellow-100' : ''
            }`}
            style={{
              background: isBookmarked ? '#FEF3C7' : 'var(--bg-secondary)',
              color: isBookmarked ? '#92400E' : 'var(--text-primary)',
              border: `1px solid ${isBookmarked ? '#FCD34D' : 'var(--border-medium)'}`,
            }}
          >
            <BookmarkPlus className="w-4 h-4" />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <button
            onClick={() => showMicroFeedback('🤖 AI Explanation coming soon...')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all hover:opacity-90 ml-auto"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <Brain className="w-4 h-4" />
            Ask AI Explanation
          </button>
        </div>
      </div>

      {/* Micro Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg animate-fadeIn" style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46' }}>
          <span className="text-sm font-semibold">{showFeedback}</span>
        </div>
      )}

      <div className="px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-6">
            {/* Quick Resources Section - INTERACTIVE CARDS */}
            <div className="border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Quick Resources
                </h2>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Click any card to view detailed content
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Formula Sheet Card */}
                  <button
                    onClick={() => onResourceClick('formula', `${topic} - Formulas`)}
                    className="p-4 border-2 text-left transition-all hover:border-blue-500 hover:shadow-lg"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FEF3C7' }}>
                        <span className="text-2xl">📄</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {topic} Formulas
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          All key formulas with explanations
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </button>

                  {/* Concept Notes Card */}
                  <button
                    onClick={() => onResourceClick('concept', `${topic} - Concepts`)}
                    className="p-4 border-2 text-left transition-all hover:border-blue-500 hover:shadow-lg"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#DBEAFE' }}>
                        <span className="text-2xl">📝</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {topic} Concepts
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          Detailed conceptual explanations
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </button>

                  {/* Important Diagrams Card */}
                  <button
                    onClick={() => onResourceClick('diagram', `${topic} - Diagrams`)}
                    className="p-4 border-2 text-left transition-all hover:border-blue-500 hover:shadow-lg"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#E9D5FF' }}>
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          Important Diagrams
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          Visual representations with labels
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </button>

                  {/* Common Mistakes Card */}
                  <button
                    onClick={() => onResourceClick('mistakes', `${topic} - Common Mistakes`)}
                    className="p-4 border-2 text-left transition-all hover:border-blue-500 hover:shadow-lg"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                        <span className="text-2xl">⚠️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          Common Mistakes
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          Errors to avoid and how to fix them
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </button>

                  {/* Exam Strategy Card */}
                  <button
                    onClick={() => onResourceClick('strategy', `${topic} - Exam Strategy`)}
                    className="p-4 border-2 text-left transition-all hover:border-blue-500 hover:shadow-lg"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#D1FAE5' }}>
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          Exam Strategy
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          Problem-solving techniques & tips
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </button>

                  {/* Quick Reference Card */}
                  <button
                    onClick={() => onResourceClick('reference', `${topic} - Quick Reference`)}
                    className="p-4 border-2 text-left transition-all hover:border-blue-500 hover:shadow-lg"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FED7AA' }}>
                        <span className="text-2xl">📖</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          Quick Reference
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          Key facts and quick lookup guide
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1: Topic Overview */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                  <Lightbulb className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Topic Overview
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    Learning Objective
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Master the fundamental principles and applications of {subtopic.title}. Develop problem-solving skills and understand real-world applications.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                      Estimated Time
                    </div>
                    <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {subtopic.estimatedTime}
                    </div>
                  </div>
                  <div className="p-3" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                      Difficulty
                    </div>
                    <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {subtopic.difficulty}
                    </div>
                  </div>
                  <div className="p-3" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                      Your Progress
                    </div>
                    <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {subtopic.progress}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Structured Notes */}
            <div className="border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Structured Notes
                </h2>
              </div>
              <div>
                {notesSections.map((section) => {
                  const isExpanded = expandedSections.includes(section.id);
                  return (
                    <div key={section.id} className="border-b" style={{ borderColor: 'var(--border-soft)' }}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-50 transition-all"
                        style={{ background: isExpanded ? 'var(--accent-soft)' : 'transparent' }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--accent-primary)', color: '#ffffff' }}>
                            {section.id}
                          </div>
                          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {section.title}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                        ) : (
                          <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-6">
                          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                            {section.content}
                          </p>
                          {section.keyPoints && (
                            <div className="space-y-2">
                              {section.keyPoints.map((point, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ background: 'var(--accent-primary)' }} />
                                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{point}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          {section.formulas && (
                            <div className="space-y-3 mt-4">
                              {section.formulas.map((formula, idx) => (
                                <div key={idx} className="p-3" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
                                  <div className="text-xs font-bold mb-1" style={{ color: '#92400E' }}>{formula.name}</div>
                                  <code className="text-sm font-mono" style={{ color: '#92400E' }}>{formula.formula}</code>
                                </div>
                              ))}
                            </div>
                          )}
                          {section.steps && (
                            <div className="space-y-2 mt-4">
                              {section.steps.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                                    {idx + 1}
                                  </div>
                                  <p className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>{step}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          {section.misconceptions && (
                            <div className="space-y-2 mt-4">
                              {section.misconceptions.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2 p-3" style={{ background: '#FEE2E2', border: '1px solid #FECACA' }}>
                                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#991B1B' }} />
                                  <p className="text-sm" style={{ color: '#991B1B' }}>{item}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Resource Tabs */}
            <div className="border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              {/* Tabs Header */}
              <div className="flex items-center border-b overflow-x-auto" style={{ borderColor: 'var(--border-soft)' }}>
                {resourceTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all whitespace-nowrap"
                      style={{
                        borderColor: isActive ? 'var(--accent-primary)' : 'transparent',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'notes' && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Detailed notes are shown in the Structured Notes section above
                    </p>
                  </div>
                )}

                {activeTab === 'videos' && (
                  <div className="space-y-3">
                    {resources.videos.map((video) => (
                      <div key={video.id} className="p-4 border hover:border-blue-400 transition-all cursor-pointer" style={{ borderColor: 'var(--border-soft)' }}>
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)' }}>
                            <Video className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{video.title}</h4>
                            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                              <span>{video.instructor}</span>
                              <span>•</span>
                              <span>{video.duration}</span>
                              <span>•</span>
                              <span>{video.views} views</span>
                            </div>
                          </div>
                          <button className="px-4 py-2 text-xs font-bold uppercase" style={{ background: 'var(--accent-primary)', color: '#ffffff' }}>
                            Watch
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'pdfs' && (
                  <div className="space-y-3">
                    {resources.pdfs.map((pdf) => (
                      <div key={pdf.id} className="p-4 border hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between" style={{ borderColor: 'var(--border-soft)' }}>
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
                          <div>
                            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{pdf.title}</h4>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {pdf.pages} pages • {pdf.size}
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-xs font-bold uppercase flex items-center gap-2" style={{ background: 'var(--accent-primary)', color: '#ffffff' }}>
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'practice' && (
                  <div className="space-y-3">
                    {resources.practice.map((set) => (
                      <div key={set.id} className="p-4 border hover:border-blue-400 transition-all cursor-pointer" style={{ borderColor: 'var(--border-soft)' }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <FileQuestion className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
                            <div>
                              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{set.title}</h4>
                              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {set.questions} questions • {set.difficulty}
                              </div>
                            </div>
                          </div>
                          <button className="px-4 py-2 text-xs font-bold uppercase" style={{ background: 'var(--accent-primary)', color: '#ffffff' }}>
                            Start
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'links' && (
                  <div className="space-y-3">
                    {resources.links.map((link) => (
                      <div key={link.id} className="p-4 border hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between" style={{ borderColor: 'var(--border-soft)' }}>
                        <div className="flex items-center gap-3">
                          <Link2 className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                          <div>
                            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{link.title}</h4>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{link.type}</div>
                          </div>
                        </div>
                        <button className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                          Open →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => showMicroFeedback('→ Jumping to related topic...')}
                  className="w-full px-4 py-3 text-sm font-medium text-left hover:opacity-90 transition-all"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  Jump to Related Topic
                </button>
                <button
                  onClick={() => showMicroFeedback('✓ Added to revision queue')}
                  className="w-full px-4 py-3 text-sm font-medium text-left hover:opacity-90 transition-all"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  Revise Later
                </button>
                <button
                  onClick={() => showMicroFeedback('⬇ Downloading summary...')}
                  className="w-full px-4 py-3 text-sm font-medium text-left hover:opacity-90 transition-all"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  Download Summary
                </button>
              </div>
            </div>

            {/* Progress Insights */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>
                Your Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Completion</span>
                  <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{subtopic.progress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Time Spent</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>45 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Practice Score</span>
                  <span className="text-sm font-bold" style={{ color: '#10B981' }}>85%</span>
                </div>
              </div>
            </div>

            {/* Related Topics */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>
                Related Topics
              </h3>
              <div className="space-y-2">
                {relatedTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => showMicroFeedback(`→ Opening ${topic}...`)}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-opacity-70 transition-all"
                    style={{ background: 'var(--accent-soft)', color: 'var(--text-primary)' }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}