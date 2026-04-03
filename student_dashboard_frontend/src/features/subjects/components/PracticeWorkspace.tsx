import { X, Clock, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PracticeWorkspaceProps {
  subject: string;
  topic: string;
  chapter: string;
  questionCount: number;
  difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
  onClose: () => void;
  onNavigateToDashboard?: () => void;
}

export function PracticeWorkspace({
  subject,
  topic,
  chapter,
  questionCount,
  difficulty,
  onClose,
  onNavigateToDashboard,
}: PracticeWorkspaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-4xl h-[90vh] flex flex-col" style={{ background: 'var(--bg-card)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
          <div className="flex items-center gap-4">
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
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                {subject} → {chapter}
              </div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{topic}</h2>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {formatTime(timeElapsed)}
              </span>
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Question {currentQuestion} / {questionCount}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${(currentQuestion / questionCount) * 100}%` }}
          ></div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Difficulty Badge */}
            <div className="flex items-center justify-between">
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
                {difficulty} Mode
              </div>
              <div className="text-xs text-slate-500">
                Adaptive difficulty based on 68% mastery
              </div>
            </div>

            {/* Question */}
            <div className="bg-slate-50 border border-slate-200 p-6">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">
                Question {currentQuestion}
              </div>
              <div className="text-base text-slate-900 leading-relaxed mb-4">
                A rectangular coil of 50 turns and area 5 × 10<sup>-2</sup> m
                <sup>2</sup> is placed in a magnetic field of 0.1 T. The coil
                rotates at 60 rpm about an axis perpendicular to the field. What
                is the maximum EMF induced in the coil?
              </div>
              <div className="text-xs text-slate-500 italic">
                Difficulty: Medium • Topic: EM Induction • Time: ~2 minutes
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {[
                { id: 'A', text: '0.314 V', correct: false },
                { id: 'B', text: '0.628 V', correct: false },
                { id: 'C', text: '1.57 V', correct: true },
                { id: 'D', text: '3.14 V', correct: false },
              ].map((option) => (
                <button
                  key={option.id}
                  className="w-full p-4 border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-slate-300 group-hover:border-blue-600 flex items-center justify-center font-bold text-slate-600 group-hover:text-blue-600">
                      {option.id}
                    </div>
                    <span className="text-sm text-slate-900">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Hint */}
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-yellow-900 mb-1">
                    Need a hint?
                  </div>
                  <div className="text-xs text-yellow-800">
                    Use: EMF = NABω (Note: Convert rpm to rad/s)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button className="px-4 py-2 border-2 border-slate-300 hover:bg-white text-slate-700 text-xs font-bold uppercase tracking-wide transition-colors">
            Skip Question
          </button>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border-2 border-slate-300 hover:bg-white text-slate-700 text-xs font-bold uppercase tracking-wide transition-colors">
              Mark for Review
            </button>
            <button
              onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, questionCount))}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-2"
            >
              Submit & Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}