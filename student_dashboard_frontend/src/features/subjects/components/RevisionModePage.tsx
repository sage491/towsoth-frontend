import { useState } from 'react';
import { ArrowLeft, ChevronRight, Brain, Target, CheckCircle2, RotateCw, AlertCircle, BookOpen, PlayCircle, Trophy } from 'lucide-react';

interface RevisionModePageProps {
  subject: string;
  topic?: string; // Optional - if coming from "Fix Now" button
  onBack: () => void;
  onNavigateToSubject: () => void;
  onStartQuickTest: () => void;
  onOpenMaterials?: (topic: string) => void; // Add navigation to materials
}

interface RevisionTopic {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  dueType: 'overdue' | 'today' | 'upcoming';
  lastRevised: string;
  nextReview: string;
  retentionScore: number;
  estimatedTime: string;
  masteryLevel: number; // 0-100
}

interface Flashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PreviousMistake {
  id: string;
  topic: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  timestamp: string;
}

export function RevisionModePage({ subject, topic, onBack, onNavigateToSubject, onStartQuickTest, onOpenMaterials }: RevisionModePageProps) {
  const [activeTab, setActiveTab] = useState<'queue' | 'flashcards' | 'mistakes'>('queue');
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [todayProgress, setTodayProgress] = useState({ revised: 0, retention: 85 });
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [flashcardDifficulty, setFlashcardDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  // Mock revision queue data
  const revisionQueue: RevisionTopic[] = ([
    {
      id: '1',
      title: 'Electromagnetic Induction - Lenz\'s Law',
      category: 'Electromagnetic Induction',
      priority: 'high',
      dueType: 'overdue',
      lastRevised: '3 days ago',
      nextReview: 'Overdue by 1 day',
      retentionScore: 45,
      estimatedTime: '15 min',
      masteryLevel: 40
    },
    {
      id: '2',
      title: 'Rotational Dynamics - Torque',
      category: 'Rotational Dynamics',
      priority: 'high',
      dueType: 'today',
      lastRevised: '2 days ago',
      nextReview: 'Due today',
      retentionScore: 62,
      estimatedTime: '20 min',
      masteryLevel: 58
    },
    {
      id: '3',
      title: 'Magnetic Field - Biot-Savart Law',
      category: 'Electromagnetic Induction',
      priority: 'medium',
      dueType: 'today',
      lastRevised: '1 week ago',
      nextReview: 'Due today',
      retentionScore: 70,
      estimatedTime: '12 min',
      masteryLevel: 72
    },
    {
      id: '4',
      title: 'Wave Optics - Interference',
      category: 'Wave Optics',
      priority: 'medium',
      dueType: 'upcoming',
      lastRevised: '4 days ago',
      nextReview: 'Tomorrow',
      retentionScore: 80,
      estimatedTime: '10 min',
      masteryLevel: 85
    }
  ] as RevisionTopic[]).filter(t => !topic || t.category === topic); // Filter if specific topic requested

  // Mock flashcards
  const flashcards: Flashcard[] = [
    {
      id: '1',
      topic: 'Electromagnetic Induction',
      question: 'State Lenz\'s Law',
      answer: 'The direction of induced current is such that it opposes the change in magnetic flux that produced it. This follows the law of conservation of energy.',
      difficulty: 'medium'
    },
    {
      id: '2',
      topic: 'Electromagnetic Induction',
      question: 'What is the formula for induced EMF?',
      answer: 'ε = -N(dΦ/dt), where N is number of turns, Φ is magnetic flux, and the negative sign represents Lenz\'s law.',
      difficulty: 'easy'
    },
    {
      id: '3',
      topic: 'Rotational Dynamics',
      question: 'Define torque and write its formula',
      answer: 'Torque (τ) is the rotational equivalent of force. τ = r × F = rF sin θ, where r is perpendicular distance from axis and θ is the angle between r and F.',
      difficulty: 'medium'
    },
    {
      id: '4',
      topic: 'Wave Optics',
      question: 'What is the condition for constructive interference?',
      answer: 'Path difference = nλ (where n = 0, 1, 2, ...). This means the waves are in phase and their amplitudes add constructively.',
      difficulty: 'hard'
    }
  ];

  // Mock previous mistakes
  const previousMistakes: PreviousMistake[] = [
    {
      id: '1',
      topic: 'Electromagnetic Induction',
      question: 'A coil experiences a flux change from 0.5 Wb to 0.1 Wb in 0.2s with 100 turns. Find induced EMF.',
      yourAnswer: '200 V',
      correctAnswer: '-200 V',
      explanation: 'You forgot the negative sign from Lenz\'s law. EMF = -N(ΔΦ/Δt) = -100 × (0.1-0.5)/0.2 = -200 V',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      topic: 'Rotational Dynamics',
      question: 'Which force contributes zero torque about the center of mass?',
      yourAnswer: 'Applied force',
      correctAnswer: 'Gravitational force',
      explanation: 'Gravitational force acts through the center of mass, so perpendicular distance r = 0, making torque = 0.',
      timestamp: '1 day ago'
    },
    {
      id: '3',
      topic: 'Thermodynamics',
      question: 'In an adiabatic process, what is Q?',
      yourAnswer: 'Q = ΔU',
      correctAnswer: 'Q = 0',
      explanation: 'Adiabatic process means no heat exchange (Q = 0). By first law: ΔU = Q - W, so ΔU = -W.',
      timestamp: '2 days ago'
    }
  ];

  const getDueTypeColor = (dueType: string) => {
    switch (dueType) {
      case 'overdue': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      case 'today': return { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' };
      case 'upcoming': return { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const handleCompleteRevision = (topicId: string, topicTitle: string) => {
    setCompletedTopics([...completedTopics, topicId]);
    setTodayProgress({
      revised: todayProgress.revised + 1,
      retention: Math.min(100, todayProgress.retention + 3)
    });
    showMicroFeedback(`✓ ${topicTitle} completed! Retention +3%`);
  };

  const handleFlashcardRating = (rating: 'easy' | 'medium' | 'hard') => {
    setFlashcardDifficulty(rating);
    
    const ratingMessages = {
      easy: '✓ Great! Next review in 7 days',
      medium: '✓ Good! Next review in 3 days',
      hard: '⚠ Review again tomorrow'
    };
    
    showMicroFeedback(ratingMessages[rating]);
    
    // Auto-advance after rating
    setTimeout(() => {
      if (currentFlashcard < flashcards.length - 1) {
        setCurrentFlashcard(currentFlashcard + 1);
        setIsFlipped(false);
        setFlashcardDifficulty(null);
      } else {
        showMicroFeedback('🎉 Flashcard session complete!');
      }
    }, 1500);
  };

  const queueStats = {
    overdue: revisionQueue.filter(t => t.dueType === 'overdue').length,
    today: revisionQueue.filter(t => t.dueType === 'today').length,
    upcoming: revisionQueue.filter(t => t.dueType === 'upcoming').length,
    totalTime: revisionQueue.reduce((sum, t) => sum + parseInt(t.estimatedTime), 0)
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 px-3 py-2 text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent-primary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={onNavigateToSubject} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-tertiary)' }}>
            My Subjects
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <button onClick={onNavigateToSubject} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-tertiary)' }}>
            {subject}
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Revision Mode
          </span>
        </div>

        {/* Title and Progress */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Revision Mode
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {topic ? `Focused revision: ${topic}` : 'Spaced repetition learning system'}
            </p>
          </div>

          {/* Today's Progress */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Revised Today
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {todayProgress.revised}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Retention
              </div>
              <div className="text-2xl font-bold" style={{ color: '#10B981' }}>
                {todayProgress.retention}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg animate-fadeIn" style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46' }}>
          <span className="text-sm font-semibold">{showFeedback}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="px-4 md:px-6 py-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <div className="overflow-x-auto whitespace-nowrap">
          <div className="inline-flex min-w-max items-center gap-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              activeTab === 'queue' ? '' : 'opacity-60'
            }`}
            style={{
              background: activeTab === 'queue' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: activeTab === 'queue' ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            <BookOpen className="w-4 h-4" />
            Revision Queue ({revisionQueue.length})
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              activeTab === 'flashcards' ? '' : 'opacity-60'
            }`}
            style={{
              background: activeTab === 'flashcards' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: activeTab === 'flashcards' ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            <RotateCw className="w-4 h-4" />
            Flashcards ({flashcards.length})
          </button>
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
              activeTab === 'mistakes' ? '' : 'opacity-60'
            }`}
            style={{
              background: activeTab === 'mistakes' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: activeTab === 'mistakes' ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            <AlertCircle className="w-4 h-4" />
            Previous Mistakes ({previousMistakes.length})
          </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 md:px-6 py-6">
        {/* Revision Queue Tab */}
        {activeTab === 'queue' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Overdue
                </div>
                <div className="text-2xl font-bold" style={{ color: '#EF4444' }}>
                  {queueStats.overdue}
                </div>
              </div>
              <div className="p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Due Today
                </div>
                <div className="text-2xl font-bold" style={{ color: '#F97316' }}>
                  {queueStats.today}
                </div>
              </div>
              <div className="p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Upcoming
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {queueStats.upcoming}
                </div>
              </div>
              <div className="p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Total Time
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {queueStats.totalTime}m
                </div>
              </div>
            </div>

            {/* Topics List */}
            <div className="space-y-3">
              {revisionQueue.map((topic) => {
                const dueColors = getDueTypeColor(topic.dueType);
                const isCompleted = completedTopics.includes(topic.id);

                return (
                  <div
                    key={topic.id}
                    className={`p-6 border-2 transition-all ${isCompleted ? 'opacity-50' : ''}`}
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: isCompleted ? 'var(--border-soft)' : dueColors.border,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Priority Indicator */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8" style={{ color: '#10B981' }} />
                        ) : (
                          <Target className="w-8 h-8" style={{ color: dueColors.text }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <div
                                className="px-3 py-1 text-xs font-bold uppercase"
                                style={{
                                  background: dueColors.bg,
                                  color: dueColors.text,
                                  border: `1px solid ${dueColors.border}`
                                }}
                              >
                                {topic.nextReview}
                              </div>
                              <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                {topic.category}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                              {topic.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm flex-wrap" style={{ color: 'var(--text-tertiary)' }}>
                              <span>Last: {topic.lastRevised}</span>
                              <span>•</span>
                              <span>{topic.estimatedTime}</span>
                              <span>•</span>
                              <span>Retention: {topic.retentionScore}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Mastery Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                              Mastery Level
                            </span>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                              {topic.masteryLevel}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                            <div
                              className="h-full transition-all duration-500"
                              style={{
                                width: `${topic.masteryLevel}%`,
                                background: topic.masteryLevel < 50 ? '#EF4444' : topic.masteryLevel < 75 ? '#F59E0B' : '#10B981'
                              }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {!isCompleted ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleCompleteRevision(topic.id, topic.title)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90"
                              style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                            >
                              <PlayCircle className="w-4 h-4" />
                              Start Revision
                            </button>
                            <button
                              onClick={() => onOpenMaterials && onOpenMaterials(topic.category)}
                              className="px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90"
                              style={{
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-medium)'
                              }}
                            >
                              View Materials
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#10B981' }}>
                            <Trophy className="w-5 h-5" />
                            <span>Completed! Great work!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Test Button */}
            <div className="p-6 border-2 text-center" style={{ background: '#E9D5FF', borderColor: '#D8B4FE' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#6B21A8' }}>
                Ready to Test Your Knowledge?
              </h3>
              <p className="text-sm mb-4" style={{ color: '#6B21A8' }}>
                Take a quick test on your revised topics to measure retention
              </p>
              <button
                onClick={onStartQuickTest}
                className="px-6 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90"
                style={{ background: '#9333EA', color: '#ffffff' }}
              >
                Start Quick Test
              </button>
            </div>
          </div>
        )}

        {/* Flashcards Tab */}
        {activeTab === 'flashcards' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Card {currentFlashcard + 1} of {flashcards.length}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                  {flashcards[currentFlashcard].topic}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${((currentFlashcard + 1) / flashcards.length) * 100}%`,
                    background: 'var(--accent-primary)'
                  }}
                />
              </div>
            </div>

            {/* Flashcard */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative cursor-pointer mb-6"
              style={{ minHeight: '300px', perspective: '1000px' }}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  minHeight: '300px'
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 p-8 border-2 flex flex-col items-center justify-center text-center"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--accent-primary)',
                    backfaceVisibility: 'hidden',
                    minHeight: '300px'
                  }}
                >
                  <Brain className="w-12 h-12 mb-6" style={{ color: 'var(--accent-primary)' }} />
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {flashcards[currentFlashcard].question}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Click to reveal answer
                  </p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 p-8 border-2 flex flex-col items-center justify-center text-center"
                  style={{
                    background: '#D1FAE5',
                    borderColor: '#10B981',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    minHeight: '300px'
                  }}
                >
                  <CheckCircle2 className="w-12 h-12 mb-6" style={{ color: '#10B981' }} />
                  <p className="text-lg leading-relaxed" style={{ color: '#065F46' }}>
                    {flashcards[currentFlashcard].answer}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Buttons (Only show when flipped) */}
            {isFlipped && !flashcardDifficulty && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide mb-3 text-center" style={{ color: 'var(--text-primary)' }}>
                  How well did you know this?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlashcardRating('hard');
                    }}
                    className="p-4 border-2 text-center hover:scale-105 transition-transform"
                    style={{ background: '#FEE2E2', borderColor: '#EF4444' }}
                  >
                    <div className="text-3xl mb-2">😰</div>
                    <div className="text-sm font-bold" style={{ color: '#991B1B' }}>
                      Hard
                    </div>
                    <div className="text-xs" style={{ color: '#991B1B' }}>
                      Review tomorrow
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlashcardRating('medium');
                    }}
                    className="p-4 border-2 text-center hover:scale-105 transition-transform"
                    style={{ background: '#FEF3C7', borderColor: '#F59E0B' }}
                  >
                    <div className="text-3xl mb-2">🤔</div>
                    <div className="text-sm font-bold" style={{ color: '#92400E' }}>
                      Medium
                    </div>
                    <div className="text-xs" style={{ color: '#92400E' }}>
                      Review in 3 days
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlashcardRating('easy');
                    }}
                    className="p-4 border-2 text-center hover:scale-105 transition-transform"
                    style={{ background: '#D1FAE5', borderColor: '#10B981' }}
                  >
                    <div className="text-3xl mb-2">😊</div>
                    <div className="text-sm font-bold" style={{ color: '#065F46' }}>
                      Easy
                    </div>
                    <div className="text-xs" style={{ color: '#065F46' }}>
                      Review in 7 days
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {!isFlipped && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (currentFlashcard > 0) {
                      setCurrentFlashcard(currentFlashcard - 1);
                      setIsFlipped(false);
                      setFlashcardDifficulty(null);
                    }
                  }}
                  disabled={currentFlashcard === 0}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wide hover:opacity-90 disabled:opacity-30"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-medium)'
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (currentFlashcard < flashcards.length - 1) {
                      setCurrentFlashcard(currentFlashcard + 1);
                      setIsFlipped(false);
                      setFlashcardDifficulty(null);
                    }
                  }}
                  disabled={currentFlashcard === flashcards.length - 1}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wide hover:opacity-90 disabled:opacity-30"
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#ffffff'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Previous Mistakes Tab */}
        {activeTab === 'mistakes' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="p-4 border" style={{ background: '#FEF3C7', borderColor: '#FCD34D' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#92400E' }} />
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: '#92400E' }}>
                    Learn from Your Mistakes
                  </h3>
                  <p className="text-xs" style={{ color: '#92400E' }}>
                    Review these errors to avoid repeating them. Understanding why you made a mistake is key to mastery.
                  </p>
                </div>
              </div>
            </div>

            {previousMistakes.map((mistake) => (
              <div key={mistake.id} className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                    <span className="text-sm font-bold" style={{ color: '#991B1B' }}>✗</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                      {mistake.topic} • {mistake.timestamp}
                    </span>
                    <h3 className="text-base font-bold mt-1 mb-3" style={{ color: 'var(--text-primary)' }}>
                      {mistake.question}
                    </h3>

                    {/* Answers Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="p-3" style={{ background: '#FEE2E2', border: '1px solid #FECACA' }}>
                        <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#991B1B' }}>
                          Your Answer
                        </div>
                        <p className="text-sm font-semibold" style={{ color: '#991B1B' }}>
                          {mistake.yourAnswer}
                        </p>
                      </div>
                      <div className="p-3" style={{ background: '#D1FAE5', border: '1px solid #A7F3D0' }}>
                        <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#065F46' }}>
                          Correct Answer
                        </div>
                        <p className="text-sm font-semibold" style={{ color: '#065F46' }}>
                          {mistake.correctAnswer}
                        </p>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="flex items-start gap-2">
                        <Brain className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                            Explanation
                          </div>
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            {mistake.explanation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => showMicroFeedback('→ Opening related revision materials...')}
                      className="mt-3 px-4 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
                      style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                    >
                      Revise This Topic
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}