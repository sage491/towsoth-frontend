import { useState } from 'react';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { X, CheckCircle, Circle, ChevronDown, ChevronUp, Rocket } from 'lucide-react';

export function OnboardingChecklist() {
  const { preferences, completeOnboardingStep, dismissOnboarding } = useUserPreferences();
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't show if onboarding is completed or dismissed
  if (preferences.hasCompletedOnboarding || !preferences.isFirstLogin) {
    return null;
  }

  const completedCount = preferences.onboardingSteps.filter(s => s.completed).length;
  const totalCount = preferences.onboardingSteps.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white border border-[#d1d5db] mb-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#d1d5db] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#dbeafe] border border-[#93c5fd] flex items-center justify-center">
            <Rocket className="w-5 h-5 text-[#3b82f6]" />
          </div>
          <div>
            <h2 className="text-[15px] text-[#111827]">Getting Started</h2>
            <p className="text-[11px] text-[#6b7280]">
              {completedCount} of {totalCount} steps completed ({progress}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#6b7280] hover:text-[#111827] transition-colors p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={dismissOnboarding}
            className="text-[#6b7280] hover:text-[#111827] transition-colors p-1"
            title="Dismiss onboarding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-5 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-[#e5e7eb]">
            <div
              className="h-full bg-[#3b82f6] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] text-[#6b7280] whitespace-nowrap">
            {progress}%
          </span>
        </div>
      </div>

      {/* Checklist */}
      {isExpanded && (
        <div className="p-5">
          <div className="space-y-3">
            {preferences.onboardingSteps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 border transition-colors ${
                  step.completed
                    ? 'bg-[#f0f9ff] border-[#bae6fd]'
                    : 'bg-white border-[#e5e7eb] hover:border-[#d1d5db]'
                }`}
              >
                <button
                  onClick={() => !step.completed && completeOnboardingStep(step.id)}
                  className={`flex-shrink-0 ${
                    step.completed ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-[#3b82f6]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#d1d5db]" />
                  )}
                </button>

                <div className="flex-1">
                  <span className={`text-[13px] ${
                    step.completed ? 'text-[#6b7280] line-through' : 'text-[#111827]'
                  }`}>
                    {step.label}
                  </span>
                </div>

                {!step.completed && (
                  <button
                    onClick={() => completeOnboardingStep(step.id)}
                    className="text-[11px] text-[#3b82f6] hover:underline whitespace-nowrap"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Completion Message */}
          {completedCount === totalCount && (
            <div className="mt-4 p-4 bg-[#d1fae5] border border-[#86efac]">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#059669] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[13px] text-[#059669] mb-1">
                    🎉 Congratulations! You've completed the setup
                  </h3>
                  <p className="text-[11px] text-[#047857] leading-relaxed">
                    You're ready to use the platform. Your experience mode has been upgraded to Standard.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
