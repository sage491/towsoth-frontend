import { CheckSquare, FileCheck, RotateCcw } from 'lucide-react';
import { useStudentProgress } from '../hooks/useStudentProgress';

export function StudentProgressActions() {
  const { completeTask, submitAssignment, resetDailyProgress } = useStudentProgress();

  return (
    <div className="bg-white border border-slate-200 p-4">
      <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
        Quick Actions
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={completeTask}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Complete Task</span>
        </button>
        <button
          onClick={submitAssignment}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors"
        >
          <FileCheck className="w-4 h-4" />
          <span>Submit Assignment</span>
        </button>
        <button
          onClick={resetDailyProgress}
          className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 text-sm hover:bg-slate-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Daily (Demo)</span>
        </button>
      </div>
      <div className="text-[10px] text-slate-500 mt-3 italic">
        Use these actions to test the unlock system. Progress persists on refresh.
      </div>
    </div>
  );
}
