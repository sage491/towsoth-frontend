import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Clock, Brain, Zap, CheckCircle2, XCircle, Circle } from 'lucide-react';

interface TestSystemPageProps {
  subject: string;
  topic?: string;
  onBack: () => void;
  onNavigateToSubject: () => void;
  onTestComplete: (results: TestResults) => void;
}

interface TestResults {
  score: number;
  accuracy: number;
  speed: number;
  weakTopics: string[];
  confidence: { sure: number; guess: number; notSure: number };
}

type ConfidenceLevel = 'sure' | 'guess' | 'notsure';
type QuestionDifficulty = 'easy' | 'medium' | 'hard';

interface TestAnswer {
  questionId: number;
  topic: string;
  difficulty: QuestionDifficulty;
  selectedAnswer: number;
  correct: number;
  isCorrect: boolean;
  confidence: ConfidenceLevel;
  timeSpent: number;
}

interface TestQuestion {
  id: number;
  difficulty: QuestionDifficulty;
  topic: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export function TestSystemPage({ subject, topic: _topic, onBack, onNavigateToSubject, onTestComplete }: TestSystemPageProps) {
  const [testMode, setTestMode] = useState<'select' | 'practice' | 'timed' | 'adaptive' | 'active' | 'results'>('select');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel | null>(null);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  // Mock questions with adaptive difficulty
  const questions: TestQuestion[] = [
    {
      id: 1,
      difficulty: 'easy',
      topic: 'Electromagnetic Induction',
      question: 'What is the SI unit of magnetic flux?',
      options: ['Weber', 'Tesla', 'Henry', 'Ampere'],
      correct: 0,
      explanation: 'The SI unit of magnetic flux is Weber (Wb). 1 Weber = 1 Tesla × 1 m²'
    },
    {
      id: 2,
      difficulty: 'medium',
      topic: 'Electromagnetic Induction',
      question: 'According to Lenz\'s law, the direction of induced current is such that it:',
      options: [
        'Aids the change causing it',
        'Opposes the change causing it',
        'Is perpendicular to the change',
        'Has no relation to the change'
      ],
      correct: 1,
      explanation: 'Lenz\'s law states that induced current opposes the change in magnetic flux that caused it.'
    },
    {
      id: 3,
      difficulty: 'hard',
      topic: 'Electromagnetic Induction',
      question: 'A coil of 100 turns experiences a flux change from 0.5 Wb to 0.1 Wb in 0.2 seconds. The induced EMF is:',
      options: ['200 V', '-200 V', '100 V', '-100 V'],
      correct: 1,
      explanation: 'EMF = -N(ΔΦ/Δt) = -100 × (0.1-0.5)/0.2 = -100 × (-0.4/0.2) = -100 × (-2) = -200 V'
    },
    {
      id: 4,
      difficulty: 'medium',
      topic: 'Rotational Dynamics',
      question: 'Torque is the rotational equivalent of:',
      options: ['Velocity', 'Acceleration', 'Force', 'Momentum'],
      correct: 2,
      explanation: 'Just as force causes linear acceleration, torque causes angular acceleration.'
    },
    {
      id: 5,
      difficulty: 'hard',
      topic: 'Rotational Dynamics',
      question: 'A wheel of moment of inertia 2 kg·m² accelerates from rest to 10 rad/s in 5 seconds. The torque applied is:',
      options: ['4 N·m', '2 N·m', '10 N·m', '20 N·m'],
      correct: 0,
      explanation: 'τ = I × α = I × (ω/t) = 2 × (10/5) = 2 × 2 = 4 N·m'
    }
  ];

  // Timer for timed mode
  useEffect(() => {
    if (testMode === 'active' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testMode, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = (mode: 'practice' | 'timed' | 'adaptive') => {
    setTestMode('active');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setConfidenceLevel(null);
    if (mode === 'timed') {
      setTimeRemaining(1800);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleConfidenceSelect = (confidence: ConfidenceLevel) => {
    setConfidenceLevel(confidence);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null || confidenceLevel === null) {
      setShowFeedback('⚠ Please select an answer and confidence level');
      setTimeout(() => setShowFeedback(null), 2000);
      return;
    }

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct;

    // Store answer
    const newAnswer = {
      questionId: currentQ.id,
      topic: currentQ.topic,
      difficulty: currentQ.difficulty,
      selectedAnswer,
      correct: currentQ.correct,
      isCorrect,
      confidence: confidenceLevel,
      timeSpent: 45 // Mock time
    };
    setAnswers([...answers, newAnswer]);

    // Adaptive difficulty adjustment
    if (testMode === 'adaptive') {
      if (isCorrect && confidenceLevel === 'sure') {
        setDifficulty('hard');
      } else if (!isCorrect || confidenceLevel === 'notsure') {
        setDifficulty('easy');
      } else {
        setDifficulty('medium');
      }
    }

    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setConfidenceLevel(null);
    } else {
      handleTestComplete();
    }
  };

  const handleTestComplete = () => {
    setTestMode('results');
    
    // Calculate results
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Calculate average speed
    const avgTime = answers.reduce((sum, a) => sum + a.timeSpent, 0) / totalQuestions;
    const speed = Math.max(0, 100 - (avgTime / 60) * 100); // Normalize to 0-100

    // Find weak topics (< 60% accuracy)
    const topicPerformance: { [key: string]: { correct: number; total: number } } = {};
    answers.forEach(a => {
      if (!topicPerformance[a.topic]) {
        topicPerformance[a.topic] = { correct: 0, total: 0 };
      }
      topicPerformance[a.topic].total++;
      if (a.isCorrect) topicPerformance[a.topic].correct++;
    });

    const weakTopics = Object.entries(topicPerformance)
      .filter(([_, perf]) => (perf.correct / perf.total) < 0.6)
      .map(([topic, _]) => topic);

    // Calculate confidence distribution
    const confidenceDist = {
      sure: answers.filter(a => a.confidence === 'sure').length,
      guess: answers.filter(a => a.confidence === 'guess').length,
      notSure: answers.filter(a => a.confidence === 'notsure').length
    };

    const results: TestResults = {
      score: correctAnswers,
      accuracy,
      speed,
      weakTopics,
      confidence: confidenceDist
    };

    onTestComplete(results);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' };
      case 'medium': return { bg: '#DBEAFE', text: '#1E3A8A', border: '#BFDBFE' };
      case 'hard': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const currentQ = questions[currentQuestion];
  const diffColors = currentQ ? getDifficultyColor(currentQ.difficulty) : getDifficultyColor('medium');

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
            Test System
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {testMode === 'select' ? 'Select Test Mode' : testMode === 'results' ? 'Test Results' : 'Test in Progress'}
        </h1>
      </div>

      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg animate-fadeIn" style={{ background: '#FED7AA', border: '1px solid #F97316', color: '#9A3412' }}>
          <span className="text-sm font-semibold">{showFeedback}</span>
        </div>
      )}

      {/* Mode Selection */}
      {testMode === 'select' && (
        <div className="px-4 md:px-6 py-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Practice Mode */}
            <button
              onClick={() => handleStartTest('practice')}
              className="p-6 border-2 text-left hover:border-blue-500 hover:shadow-lg transition-all"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
            >
              <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: '#DBEAFE' }}>
                <Brain className="w-6 h-6" style={{ color: '#1E3A8A' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Practice Mode
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Untimed practice with instant feedback and explanations
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <CheckCircle2 className="w-4 h-4" />
                <span>No time pressure</span>
              </div>
            </button>

            {/* Timed Mode */}
            <button
              onClick={() => handleStartTest('timed')}
              className="p-6 border-2 text-left hover:border-blue-500 hover:shadow-lg transition-all"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
            >
              <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: '#FED7AA' }}>
                <Clock className="w-6 h-6" style={{ color: '#9A3412' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Timed Mode
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Simulate real exam conditions with time limits
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <Clock className="w-4 h-4" />
                <span>30 minutes</span>
              </div>
            </button>

            {/* Adaptive Mode */}
            <button
              onClick={() => handleStartTest('adaptive')}
              className="p-6 border-2 text-left hover:border-blue-500 hover:shadow-lg transition-all"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
            >
              <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: '#E9D5FF' }}>
                <Zap className="w-6 h-6" style={{ color: '#6B21A8' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Adaptive Mode
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                AI adjusts difficulty based on your performance
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <Zap className="w-4 h-4" />
                <span>Smart difficulty</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Active Test */}
      {testMode === 'active' && currentQ && (
        <div className="px-4 md:px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-4">
                  <div
                    className="px-3 py-1 text-xs font-bold uppercase"
                    style={{
                      background: diffColors.bg,
                      color: diffColors.text,
                      border: `1px solid ${diffColors.border}`
                    }}
                  >
                    {currentQ.difficulty}
                  </div>
                  {timeRemaining > 0 && (
                    <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      <Clock className="w-4 h-4" />
                      {formatTime(timeRemaining)}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    background: 'var(--accent-primary)'
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 border mb-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                {currentQ.topic}
              </div>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className="w-full p-4 text-left border-2 transition-all hover:border-blue-400"
                    style={{
                      background: selectedAnswer === idx ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                      borderColor: selectedAnswer === idx ? 'var(--accent-primary)' : 'var(--border-soft)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: selectedAnswer === idx ? 'var(--accent-primary)' : 'var(--border-medium)',
                          background: selectedAnswer === idx ? 'var(--accent-primary)' : 'transparent'
                        }}
                      >
                        {selectedAnswer === idx && (
                          <div className="w-3 h-3 rounded-full" style={{ background: '#ffffff' }} />
                        )}
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence Rating */}
            <div className="p-6 border mb-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>
                How confident are you?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  onClick={() => handleConfidenceSelect('sure')}
                  className="p-4 border-2 text-center transition-all hover:border-green-500"
                  style={{
                    background: confidenceLevel === 'sure' ? '#D1FAE5' : 'var(--bg-secondary)',
                    borderColor: confidenceLevel === 'sure' ? '#10B981' : 'var(--border-soft)',
                  }}
                >
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2" style={{ color: confidenceLevel === 'sure' ? '#10B981' : 'var(--text-tertiary)' }} />
                  <div className="text-sm font-bold" style={{ color: confidenceLevel === 'sure' ? '#065F46' : 'var(--text-primary)' }}>
                    Sure
                  </div>
                </button>
                <button
                  onClick={() => handleConfidenceSelect('guess')}
                  className="p-4 border-2 text-center transition-all hover:border-yellow-500"
                  style={{
                    background: confidenceLevel === 'guess' ? '#FEF3C7' : 'var(--bg-secondary)',
                    borderColor: confidenceLevel === 'guess' ? '#F59E0B' : 'var(--border-soft)',
                  }}
                >
                  <Circle className="w-6 h-6 mx-auto mb-2" style={{ color: confidenceLevel === 'guess' ? '#F59E0B' : 'var(--text-tertiary)' }} />
                  <div className="text-sm font-bold" style={{ color: confidenceLevel === 'guess' ? '#92400E' : 'var(--text-primary)' }}>
                    Guess
                  </div>
                </button>
                <button
                  onClick={() => handleConfidenceSelect('notsure')}
                  className="p-4 border-2 text-center transition-all hover:border-red-500"
                  style={{
                    background: confidenceLevel === 'notsure' ? '#FEE2E2' : 'var(--bg-secondary)',
                    borderColor: confidenceLevel === 'notsure' ? '#EF4444' : 'var(--border-soft)',
                  }}
                >
                  <XCircle className="w-6 h-6 mx-auto mb-2" style={{ color: confidenceLevel === 'notsure' ? '#EF4444' : 'var(--text-tertiary)' }} />
                  <div className="text-sm font-bold" style={{ color: confidenceLevel === 'notsure' ? '#991B1B' : 'var(--text-primary)' }}>
                    Not Sure
                  </div>
                </button>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null || confidenceLevel === null}
              className="w-full px-6 py-4 text-sm font-bold uppercase hover:opacity-90 disabled:opacity-50 transition-all"
              style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Test'}
            </button>
          </div>
        </div>
      )}

      {/* Results View */}
      {testMode === 'results' && answers.length > 0 && (
        <div className="px-4 md:px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Score Card */}
            <div className="p-8 border text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="text-6xl font-bold mb-4" style={{ color: 'var(--accent-primary)' }}>
                {answers.filter(a => a.isCorrect).length}/{answers.length}
              </div>
              <div className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Test Completed!
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {((answers.filter(a => a.isCorrect).length / answers.length) * 100).toFixed(0)}% Accuracy
              </div>
            </div>

            {/* Instant Insights */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Instant Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    Accuracy
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {((answers.filter(a => a.isCorrect).length / answers.length) * 100).toFixed(0)}%
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.1)' }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${(answers.filter(a => a.isCorrect).length / answers.length) * 100}%`,
                        background: '#10B981'
                      }}
                    />
                  </div>
                </div>

                <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    Confidence Distribution
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: '#10B981' }}>Sure:</span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        {answers.filter(a => a.confidence === 'sure').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: '#F59E0B' }}>Guess:</span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        {answers.filter(a => a.confidence === 'guess').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: '#EF4444' }}>Not Sure:</span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        {answers.filter(a => a.confidence === 'notsure').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    Weak Topics Detected
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: '#EF4444' }}>
                    {Array.from(new Set(answers.filter(a => !a.isCorrect).map(a => a.topic))).length}
                  </div>
                  <button
                    className="text-xs font-semibold hover:underline"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 text-sm font-bold uppercase hover:opacity-90"
                style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
              >
                Back to Subject
              </button>
              <button
                onClick={() => setTestMode('select')}
                className="px-6 py-3 text-sm font-bold uppercase hover:opacity-90"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              >
                Take Another Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
