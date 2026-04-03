import { Lock, CheckCircle2, TrendingUp } from 'lucide-react';
import { useStudentProgress } from '@/hooks/useStudentProgress';

interface ProgressUnlocksProps {
  onClose: () => void;
}

export function ProgressUnlocks({ onClose: _onClose }: ProgressUnlocksProps) {
  const {
    progress,
    dailyProgressPercent,
    getLockedFeatures,
    getMotivationalMessage,
  } = useStudentProgress();

  const lockedFeatures = getLockedFeatures();
  const motivationalMessage = getMotivationalMessage();

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 shadow-lg z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          My Progress Unlocks
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          Complete tasks to access advanced tools
        </div>
      </div>

      {/* Today's Progress Status */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-600">Daily Tasks</span>
            <span className="font-semibold text-slate-900">
              {progress.dailyTasks.completed} / {progress.dailyTasks.total}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-600">Assignments</span>
            <span className="font-semibold text-slate-900">
              {progress.assignments.completed} / {progress.assignments.total}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-600">Study Streak</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {progress.studyStreak} days
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-200 h-1.5">
            <div
              className="bg-blue-600 h-1.5 transition-all duration-500 ease-out"
              style={{ width: `${dailyProgressPercent}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {dailyProgressPercent}% daily progress
          </div>
        </div>

        {/* Micro motivation */}
        <div className="text-[10px] text-slate-600 mt-2 italic">
          Complete today's goals to unlock more study tools.
        </div>
      </div>

      {/* Unlocked Features */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="text-[10px] font-semibold text-slate-900 uppercase tracking-wide mb-2">
          Active Features
        </div>
        <div className="space-y-1.5">
          {progress.unlockedFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-2 group"
              title="Unlocked by consistent activity"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-900">{feature}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locked Features */}
      {lockedFeatures.length > 0 && (
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="text-[10px] font-semibold text-slate-900 uppercase tracking-wide mb-2">
            Locked Features
          </div>
          <div className="space-y-2">
            {lockedFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-700 font-semibold">{feature.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                    {feature.requirement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Motivation Footer */}
      <div className="px-4 py-3 bg-blue-50">
        <div className="text-[10px] text-blue-900 font-medium text-center">
          {motivationalMessage}
        </div>
      </div>
    </div>
  );
}