import { TrendingUp, TrendingDown } from 'lucide-react';
import type { SubjectDomain } from './types/subject';

interface SubjectCardProps {
  subject: SubjectDomain;
}

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-700' },
  cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', icon: 'text-cyan-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-700' },
  lime: { bg: 'bg-lime-50', border: 'border-lime-200', icon: 'text-lime-700' },
};

const comprehensionColor = {
  High: 'text-emerald-700 bg-emerald-100',
  Medium: 'text-orange-700 bg-orange-100',
  Low: 'text-red-700 bg-red-100',
};

const retentionIcon = {
  Improving: TrendingUp,
  Stable: null,
  Dropping: TrendingDown,
};

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = subject.icon;
  const colors = colorMap[subject.color];
  const RetentionIcon = retentionIcon[subject.retention];
  const isNegativeRank = subject.rankContribution.startsWith('-');

  return (
    <div className={`border ${colors.border} bg-white hover:shadow-sm transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`${colors.bg} w-10 h-10 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{subject.name}</h3>
            <p className="text-xs text-slate-500">{subject.chapter} • {subject.topic}</p>
          </div>
        </div>
        
        {/* Rank Contribution */}
        <div className={`px-2 py-1 text-xs font-bold ${
          isNegativeRank ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {subject.rankContribution}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {/* AI Mastery Index */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">AI Mastery</div>
          <div className="text-2xl font-bold text-slate-900">{subject.mastery}<span className="text-sm text-slate-500">/100</span></div>
        </div>

        {/* Comprehension */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Comprehension</div>
          <span className={`inline-block px-2 py-1 text-xs font-semibold ${comprehensionColor[subject.comprehension]}`}>
            {subject.comprehension}
          </span>
        </div>

        {/* Weakness Severity */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Weakness Cluster</div>
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-4 h-4 ${
                  level <= subject.weaknessSeverity
                    ? level <= 2 ? 'bg-red-600' : level === 3 ? 'bg-orange-500' : 'bg-yellow-500'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="text-[9px] text-slate-400">Severity: {subject.weaknessSeverity}/5</div>
        </div>

        {/* Retention */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Retention</div>
          <div className="flex items-center gap-1">
            {RetentionIcon && (
              <RetentionIcon className={`w-4 h-4 ${
                subject.retention === 'Improving' ? 'text-emerald-600' :
                subject.retention === 'Dropping' ? 'text-red-600' : 'text-slate-400'
              }`} />
            )}
            <span className={`text-xs font-medium ${
              subject.retention === 'Improving' ? 'text-emerald-700' :
              subject.retention === 'Dropping' ? 'text-red-700' : 'text-slate-700'
            }`}>
              {subject.retention}
            </span>
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">(AI-Predicted)</div>
        </div>
      </div>

      {/* Action */}
      <div className="p-4 pt-0">
        <button className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold uppercase tracking-wide transition-colors">
          Review Weak Areas
        </button>
      </div>
    </div>
  );
}