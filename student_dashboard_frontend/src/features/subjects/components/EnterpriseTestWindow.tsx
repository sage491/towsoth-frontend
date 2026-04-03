import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Flag, ChevronLeft, ChevronRight, BookmarkPlus, Bookmark } from 'lucide-react';

export interface Question {
  id: string;
  number: number;
  text: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
}

export interface TestAnswer {
  questionId: string;
  selectedAnswer: number | null;
  isBookmarked: boolean;
  timeSpent: number;
}

interface EnterpriseTestWindowProps {
  subject: string;
  topic: string;
  onBack: () => void;
  onSubmit: (results: TestResults) => void;
}

export interface TestResults {
  testName?: string;
  subject: string;
  topic: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  score: number;
  percentage: number;
  timeTaken: number;
  answers: TestAnswer[];
  questions: Question[];
  difficulty: string;
}

export function EnterpriseTestWindow({ subject, topic, onBack, onSubmit }: EnterpriseTestWindowProps) {
  const [isPhoneViewport, setIsPhoneViewport] = useState(() => window.innerWidth < 768);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement));

  const questions: Question[] = [
    {
      id: 'q1',
      number: 1,
      text: 'According to Faraday\'s law of electromagnetic induction, the induced EMF in a coil is directly proportional to:',
      options: [
        'The number of turns in the coil',
        'The rate of change of magnetic flux',
        'The resistance of the coil',
        'The current flowing through the coil'
      ],
      correctAnswer: 1,
      topic: 'Electromagnetic Induction',
      difficulty: 'Medium',
      explanation: 'Faraday\'s law states that induced EMF = -N(dΦ/dt), where N is the number of turns and dΦ/dt is the rate of change of magnetic flux.'
    },
    {
      id: 'q2',
      number: 2,
      text: 'Lenz\'s law is a consequence of the law of conservation of:',
      options: [
        'Charge',
        'Momentum',
        'Energy',
        'Angular momentum'
      ],
      correctAnswer: 2,
      topic: 'Electromagnetic Induction',
      difficulty: 'Easy',
      explanation: 'Lenz\'s law ensures that the induced current opposes the change causing it, which is a consequence of energy conservation.'
    },
    {
      id: 'q3',
      number: 3,
      text: 'A rectangular coil of 100 turns has an area of 0.1 m². If a magnetic field changes from 0.2 T to 0.8 T in 0.05 seconds, what is the magnitude of induced EMF?',
      options: [
        '60 V',
        '120 V',
        '180 V',
        '240 V'
      ],
      correctAnswer: 1,
      topic: 'Electromagnetic Induction',
      difficulty: 'Hard',
      explanation: 'EMF = N × ΔΦ/Δt = 100 × (0.8-0.2) × 0.1 / 0.05 = 100 × 0.6 × 0.1 / 0.05 = 120 V'
    },
    {
      id: 'q4',
      number: 4,
      text: 'The direction of induced current in a conductor moving in a magnetic field can be determined by:',
      options: [
        'Right-hand thumb rule',
        'Fleming\'s left-hand rule',
        'Fleming\'s right-hand rule',
        'Ampere\'s circuital law'
      ],
      correctAnswer: 2,
      topic: 'Electromagnetic Induction',
      difficulty: 'Easy',
      explanation: 'Fleming\'s right-hand rule is used to determine the direction of induced current when a conductor moves in a magnetic field.'
    },
    {
      id: 'q5',
      number: 5,
      text: 'Self-inductance of a coil depends on:',
      options: [
        'Current flowing through the coil only',
        'Rate of change of current only',
        'Number of turns and geometry of the coil',
        'Resistance of the coil material'
      ],
      correctAnswer: 2,
      topic: 'Electromagnetic Induction',
      difficulty: 'Medium',
      explanation: 'Self-inductance L is a property that depends on the physical characteristics of the coil: number of turns, area, length, and core material.'
    },
    {
      id: 'q6',
      number: 6,
      text: 'The unit of magnetic flux is:',
      options: [
        'Tesla',
        'Weber',
        'Henry',
        'Ampere'
      ],
      correctAnswer: 1,
      topic: 'Electromagnetic Induction',
      difficulty: 'Easy',
      explanation: 'Magnetic flux is measured in Weber (Wb), where 1 Wb = 1 T⋅m².'
    },
    {
      id: 'q7',
      number: 7,
      text: 'When the speed of a conductor moving through a uniform magnetic field is doubled, the induced EMF:',
      options: [
        'Remains the same',
        'Becomes half',
        'Becomes double',
        'Becomes four times'
      ],
      correctAnswer: 2,
      topic: 'Electromagnetic Induction',
      difficulty: 'Medium',
      explanation: 'Induced EMF = Bvl, where v is velocity. If velocity doubles, EMF also doubles (direct proportionality).'
    },
    {
      id: 'q8',
      number: 8,
      text: 'A conducting loop is placed in a time-varying magnetic field. The induced EMF does NOT depend on:',
      options: [
        'Rate of change of magnetic field',
        'Area of the loop',
        'Number of turns',
        'Resistance of the loop'
      ],
      correctAnswer: 3,
      topic: 'Electromagnetic Induction',
      difficulty: 'Hard',
      explanation: 'EMF = -N(dΦ/dt) depends on N, area, and dB/dt, but not on resistance. Resistance affects current, not EMF.'
    },
    {
      id: 'q9',
      number: 9,
      text: 'The phenomenon of electromagnetic induction was discovered by:',
      options: [
        'Michael Faraday',
        'James Clerk Maxwell',
        'Heinrich Lenz',
        'Andre-Marie Ampere'
      ],
      correctAnswer: 0,
      topic: 'Electromagnetic Induction',
      difficulty: 'Easy',
      explanation: 'Michael Faraday discovered electromagnetic induction in 1831.'
    },
    {
      id: 'q10',
      number: 10,
      text: 'An AC generator works on the principle of:',
      options: [
        'Heating effect of current',
        'Electromagnetic induction',
        'Magnetic effect of current',
        'Chemical effect of current'
      ],
      correctAnswer: 1,
      topic: 'Electromagnetic Induction',
      difficulty: 'Easy',
      explanation: 'AC generators convert mechanical energy to electrical energy using the principle of electromagnetic induction.'
    },
  ];

  useEffect(() => {
    const initialAnswers: TestAnswer[] = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: null,
      isBookmarked: false,
      timeSpent: 0
    }));
    setAnswers(initialAnswers);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsPhoneViewport(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isPhoneViewport) {
      return;
    }

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPhoneViewport]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (isPhoneViewport) {
      exitFullscreen().catch(() => {
      });
      return;
    }

    enterFullscreen().catch(() => {
    });
  }, [isPhoneViewport]);

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      ...newAnswers[currentQuestionIndex],
      selectedAnswer: optionIndex
    };
    setAnswers(newAnswers);
    showMicroFeedback('✓ Answer selected');
  };

  const handleBookmark = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      ...newAnswers[currentQuestionIndex],
      isBookmarked: !newAnswers[currentQuestionIndex].isBookmarked
    };
    setAnswers(newAnswers);
    showMicroFeedback(newAnswers[currentQuestionIndex].isBookmarked ? '🔖 Bookmarked for review' : '✓ Bookmark removed');
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      showMicroFeedback('→ Next question');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      showMicroFeedback('← Previous question');
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
    showMicroFeedback(`→ Question ${index + 1}`);
  };

  const handleSubmit = async () => {
    const attemptedCount = answers.filter((a) => a.selectedAnswer !== null).length;
    const correct = answers.filter((a, i) => a.selectedAnswer === questions[i].correctAnswer).length;
    const incorrect = attemptedCount - correct;
    const skipped = questions.length - attemptedCount;
    const percentage = (correct / questions.length) * 100;

    const results: TestResults = {
      subject,
      topic,
      totalQuestions: questions.length,
      attempted: attemptedCount,
      correct,
      incorrect,
      skipped,
      score: correct,
      percentage,
      timeTaken: timeElapsed,
      answers,
      questions,
      difficulty: 'Mixed'
    };

    await exitFullscreen();
    onSubmit(results);
  };

  const handleBack = async () => {
    await exitFullscreen();
    onBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (answer: TestAnswer) => {
    if (answer.isBookmarked) return 'bookmarked';
    if (answer.selectedAnswer !== null) return 'answered';
    return 'unanswered';
  };

  const attempted = answers.filter((a) => a.selectedAnswer !== null).length;
  const bookmarked = answers.filter((a) => a.isBookmarked).length;

  return (
    <div className="min-h-[calc(100vh-64px)]" style={{ background: '#FAFAFA' }}>
      {showFeedback && (
        <div
          className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg text-sm font-semibold animate-fadeIn"
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

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white p-8 max-w-md w-full mx-4 border" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#111827' }}>Submit Test?</h3>
            <div className="space-y-2 mb-6 text-sm" style={{ color: '#6B7280' }}>
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-bold" style={{ color: '#111827' }}>{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Attempted:</span>
                <span className="font-bold" style={{ color: '#10B981' }}>{attempted}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <span className="font-bold" style={{ color: '#EF4444' }}>{questions.length - attempted}</span>
              </div>
              <div className="flex justify-between">
                <span>Bookmarked:</span>
                <span className="font-bold" style={{ color: '#F59E0B' }}>{bookmarked}</span>
              </div>
            </div>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Are you sure you want to submit? You won't be able to change your answers after submission.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB' }}
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleSubmit();
                }}
                className="flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                style={{ background: '#5B5F8D', color: '#FFFFFF' }}
              >
                SUBMIT TEST
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-40 border-b" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              handleBack().catch(() => {
              });
            }}
            className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#5B5F8D' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Test
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#6B7280' }} />
              <span className="text-sm font-bold" style={{ color: '#111827' }}>
                {formatTime(timeElapsed)}
              </span>
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>
              <span className="font-bold" style={{ color: '#111827' }}>{attempted}</span> / {questions.length} answered
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4" style={{ minHeight: 'calc(100vh - 128px)' }}>
        {isPhoneViewport && (
          <div
            className="mb-4 rounded-lg border p-6 flex flex-col items-center justify-center text-center"
            style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
          >
            <div className="text-base font-bold mb-2" style={{ color: '#111827' }}>Desktop Only</div>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
              Test attempts are not allowed on phones. Please switch to a desktop or laptop.
            </p>
            <button
              onClick={() => {
                handleBack().catch(() => {
                });
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide rounded"
              style={{ background: '#5B5F8D', color: '#FFFFFF' }}
            >
              Back to Tests
            </button>
          </div>
        )}

        {!isPhoneViewport && !isFullscreen && (
          <div
            className="mb-4 rounded-lg border p-6 flex flex-col items-center justify-center text-center"
            style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
          >
            <div className="text-base font-bold mb-2" style={{ color: '#111827' }}>Full Screen Required</div>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
              Testing mode is available only in full screen.
            </p>
            <button
              onClick={() => {
                enterFullscreen().catch(() => {
                });
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide rounded"
              style={{ background: '#5B5F8D', color: '#FFFFFF' }}
            >
              Enter Full Screen
            </button>
          </div>
        )}

        {isPhoneViewport || !isFullscreen ? null : (
        <div className="grid gap-4 xl:gap-5" style={{ gridTemplateColumns: 'minmax(0, 1fr) 360px' }}>
          <section
            className="rounded-lg border shadow-sm p-4 md:p-5"
            style={{
              background: '#FFFFFF',
              borderColor: '#E5E7EB',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#6B7280' }}>
                  Question {currentQuestion.number} of {questions.length}
                </div>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold uppercase rounded"
                    style={{
                      background: currentQuestion.difficulty === 'Easy' ? '#D1FAE5' :
                        currentQuestion.difficulty === 'Medium' ? '#DBEAFE' : '#FEE2E2',
                      color: currentQuestion.difficulty === 'Easy' ? '#065F46' :
                        currentQuestion.difficulty === 'Medium' ? '#1E3A8A' : '#991B1B'
                    }}
                  >
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs font-medium truncate" style={{ color: '#6B7280' }}>
                    {currentQuestion.topic}
                  </span>
                </div>
              </div>
              <button
                onClick={handleBookmark}
                className="p-2 rounded border transition-colors"
                style={{
                  color: currentAnswer?.isBookmarked ? '#F59E0B' : '#9CA3AF',
                  borderColor: '#E5E7EB',
                  background: '#FFFFFF'
                }}
              >
                {currentAnswer?.isBookmarked ? (
                  <Bookmark className="w-5 h-5 fill-current" />
                ) : (
                  <BookmarkPlus className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="mb-6 md:mb-7">
              <p className="text-[15px] leading-7" style={{ color: '#111827' }}>
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3 mb-6 md:mb-7">
              {currentQuestion.options.map((option, index) => {
                const isSelected = currentAnswer?.selectedAnswer === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className="w-full p-4 md:p-4.5 text-left rounded-md transition-all"
                    style={{
                      background: isSelected ? '#EEF2FF' : '#FFFFFF',
                      borderColor: 'transparent',
                      boxShadow: isSelected ? '0 1px 3px rgba(91,95,141,0.12)' : 'none'
                    }}
                    onMouseEnter={(event) => {
                      if (!isSelected) {
                        event.currentTarget.style.background = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(event) => {
                      if (!isSelected) {
                        event.currentTarget.style.background = '#FFFFFF';
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          borderColor: isSelected ? '#5B5F8D' : '#CBD5E1',
                          background: isSelected ? '#5B5F8D' : '#FFFFFF'
                        }}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full" style={{ background: '#FFFFFF' }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold mr-2" style={{ color: '#94A3B8' }}>
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-sm" style={{ color: '#111827' }}>
                          {option}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-opacity disabled:opacity-30 rounded"
                style={{
                  background: '#FFFFFF',
                  color: '#374151',
                  border: '1px solid #D1D5DB'
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-opacity disabled:opacity-30 rounded"
                style={{
                  background: '#FFFFFF',
                  color: '#374151',
                  border: '1px solid #D1D5DB'
                }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          <aside
            className="rounded-lg border shadow-sm p-5 md:p-6 h-fit"
            style={{
              background: '#FFFFFF',
              borderColor: '#E5E7EB',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: '#6B7280' }}>
              QUESTION PALETTE
            </h3>

            <div className="flex items-center gap-5 mb-4 text-[11px]" style={{ color: '#6B7280' }}>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#E5E7EB' }} />
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
              </div>
            </div>

            <div
              className="grid gap-2.5 mb-5"
              style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}
            >
              {questions.map((_, index) => {
                const answer = answers[index];
                const status = answer ? getQuestionStatus(answer) : 'unanswered';
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionJump(index)}
                    className="h-12 w-12 mx-auto rounded-md flex items-center justify-center text-sm font-bold border transition-all hover:shadow-sm"
                    style={{
                      background: status === 'answered' ? '#10B981' :
                        status === 'bookmarked' ? '#F59E0B' : '#E5E7EB',
                      color: status === 'unanswered' ? '#64748B' : '#FFFFFF',
                      borderColor: isCurrent ? '#111827' : '#D1D5DB',
                      boxShadow: isCurrent ? '0 0 0 1px #111827 inset' : 'none'
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide rounded transition-opacity hover:opacity-90"
              style={{ background: '#5B5F8D', color: '#FFFFFF' }}
            >
              <Flag className="w-4 h-4" />
              Submit Test
            </button>

            <div className="grid grid-cols-3 gap-2.5 mt-4">
              <div className="rounded-md border px-2 py-2 text-center" style={{ borderColor: '#E5E7EB', background: '#F8FAFC' }}>
                <div className="text-[10px]" style={{ color: '#6B7280' }}>Answered</div>
                <div className="text-sm font-bold" style={{ color: '#10B981' }}>{attempted}</div>
              </div>
              <div className="rounded-md border px-2 py-2 text-center" style={{ borderColor: '#E5E7EB', background: '#F8FAFC' }}>
                <div className="text-[10px]" style={{ color: '#6B7280' }}>Not Ans</div>
                <div className="text-sm font-bold" style={{ color: '#64748B' }}>{questions.length - attempted}</div>
              </div>
              <div className="rounded-md border px-2 py-2 text-center" style={{ borderColor: '#E5E7EB', background: '#F8FAFC' }}>
                <div className="text-[10px]" style={{ color: '#6B7280' }}>Marked</div>
                <div className="text-sm font-bold" style={{ color: '#F59E0B' }}>{bookmarked}</div>
              </div>
            </div>
          </aside>
        </div>
        )}
      </div>
    </div>
  );
}
