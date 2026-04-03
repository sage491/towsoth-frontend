import { X, Play, FileText, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface MicroFixSessionProps {
  subject: string;
  chapter: string;
  gapTopic: string;
  onClose: () => void;
  onComplete: () => void;
  onNavigateToDashboard?: () => void;
}

export function MicroFixSession({
  subject,
  chapter,
  gapTopic,
  onClose,
  onComplete,
  onNavigateToDashboard,
}: MicroFixSessionProps) {
  const [currentStep, setCurrentStep] = useState<'concept' | 'examples' | 'practice'>('concept');
  const [progress, setProgress] = useState(0);

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] z-50 flex flex-col" style={{ background: 'var(--bg-card)', borderLeft: '4px solid var(--accent-primary)', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
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
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-primary)' }}>
                Micro-Fix Session
              </div>
            </div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
              {subject} → {chapter}
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{gapTopic}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:opacity-70 transition-opacity"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            <span>Session Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2" style={{ background: 'var(--bg-secondary)' }}>
            <div
              className="h-2 transition-all duration-500"
              style={{ width: `${progress}%`, background: 'var(--accent-primary)' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Step Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentStep('concept')}
            className={`flex-1 p-3 border-2 transition-all text-left ${
              currentStep === 'concept'
                ? 'border-orange-600 bg-orange-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Play className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-xs font-bold text-slate-900">Concept</span>
            </div>
            <div className="text-[10px] text-slate-500">2 min refresher</div>
          </button>

          <button
            onClick={() => setCurrentStep('examples')}
            className={`flex-1 p-3 border-2 transition-all text-left ${
              currentStep === 'examples'
                ? 'border-orange-600 bg-orange-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-xs font-bold text-slate-900">Examples</span>
            </div>
            <div className="text-[10px] text-slate-500">3 guided cases</div>
          </button>

          <button
            onClick={() => setCurrentStep('practice')}
            className={`flex-1 p-3 border-2 transition-all text-left ${
              currentStep === 'practice'
                ? 'border-orange-600 bg-orange-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-xs font-bold text-slate-900">Practice</span>
            </div>
            <div className="text-[10px] text-slate-500">5 quick MCQs</div>
          </button>
        </div>

        {/* Concept Step */}
        {currentStep === 'concept' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
              <div className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2">
                Core Concept
              </div>
              <div className="text-sm text-slate-900 leading-relaxed mb-3">
                <strong>Lenz's Law:</strong> The direction of induced current is
                such that it opposes the change in magnetic flux that produced it.
              </div>
              <div className="text-xs text-blue-800">
                This is a consequence of energy conservation.
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4">
              <div className="text-xs font-semibold text-slate-900 mb-3">
                Key Points to Remember:
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Induced current creates a magnetic field opposing the change</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Use right-hand rule to determine direction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>The word "opposes" is critical for problem-solving</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setProgress(33);
                setCurrentStep('examples');
              }}
              className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wide transition-colors"
            >
              Continue to Examples
            </button>
          </div>
        )}

        {/* Examples Step */}
        {currentStep === 'examples' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 p-4">
              <div className="text-xs font-semibold text-slate-900 mb-2">
                Example 1: Bar Magnet Approaching a Coil
              </div>
              <div className="text-xs text-slate-700 leading-relaxed mb-3">
                When a north pole of a magnet approaches a coil, the induced
                current creates a north pole facing the magnet to repel it.
              </div>
              <div className="bg-slate-50 p-3 border-l-2 border-slate-300">
                <div className="text-[10px] text-slate-600 mb-1">
                  Direction of induced current:
                </div>
                <div className="text-xs font-semibold text-slate-900">
                  Anticlockwise (when viewed from magnet side)
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4">
              <div className="text-xs font-semibold text-slate-900 mb-2">
                Example 2: Magnet Moving Away
              </div>
              <div className="text-xs text-slate-700 leading-relaxed mb-3">
                When a north pole moves away, the induced current creates a south
                pole to attract it and oppose the decrease in flux.
              </div>
              <div className="bg-slate-50 p-3 border-l-2 border-slate-300">
                <div className="text-[10px] text-slate-600 mb-1">
                  Direction of induced current:
                </div>
                <div className="text-xs font-semibold text-slate-900">
                  Clockwise (when viewed from magnet side)
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4">
              <div className="text-xs font-semibold text-slate-900 mb-2">
                Example 3: Expanding Coil in Uniform Field
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                When a coil expands in a uniform magnetic field, the induced
                current opposes the increase in flux by creating an opposing field.
              </div>
            </div>

            <button
              onClick={() => {
                setProgress(66);
                setCurrentStep('practice');
              }}
              className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wide transition-colors"
            >
              Continue to Practice
            </button>
          </div>
        )}

        {/* Practice Step */}
        {currentStep === 'practice' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
              <div className="text-xs font-semibold text-yellow-900 mb-1">
                Quick Practice Round
              </div>
              <div className="text-xs text-yellow-800">
                Answer 5 targeted MCQs to verify your understanding
              </div>
            </div>

            {/* Sample Question */}
            <div className="bg-white border border-slate-200 p-4">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">
                Question 1 / 5
              </div>
              <div className="text-sm text-slate-900 mb-4">
                A magnet is dropped through a copper ring. The acceleration of the
                magnet during the fall is:
              </div>
              <div className="space-y-2">
                {['Less than g', 'Equal to g', 'More than g', 'Zero'].map(
                  (option, idx) => (
                    <button
                      key={idx}
                      className="w-full p-3 border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-left text-xs text-slate-900 transition-all"
                    >
                      {String.fromCharCode(65 + idx)}. {option}
                    </button>
                  )
                )}
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wide transition-colors"
            >
              Complete Session
            </button>
          </div>
        )}

        {/* Timer */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-200">
          <Clock className="w-3.5 h-3.5" />
          <span>Estimated: 10–15 minutes total</span>
        </div>
      </div>
    </div>
  );
}