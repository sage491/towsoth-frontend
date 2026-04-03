import { ArrowLeft, Target, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

interface MistakeCluster {
  cluster: string;
  topics: string[];
  frequency: number;
  severity: 'High' | 'Medium' | 'Low';
  impact: string;
}

interface FixPlanDetailProps {
  cluster: MistakeCluster;
  onBack: () => void;
}

export function FixPlanDetail({ cluster, onBack }: FixPlanDetailProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return { bg: '#fef2f2', text: '#991b1b', border: '#fca5a5' };
      case 'Medium':
        return { bg: '#fffbeb', text: '#92400e', border: '#fcd34d' };
      case 'Low':
        return { bg: '#f8fafc', text: '#475569', border: '#cbd5e1' };
      default:
        return { bg: '#f8fafc', text: '#475569', border: '#cbd5e1' };
    }
  };

  const colors = getSeverityColor(cluster.severity);

  // Generate fix steps based on cluster type
  const getFixSteps = () => {
    if (cluster.cluster === 'Conceptual Confusion') {
      return [
        'Watch 2 visual explainers on Lenz Law and Faraday Law',
        'Solve 10 guided conceptual problems with detailed solutions',
        'Complete EM Induction topic test (30 mins)',
        'Review all mistakes with step-by-step explanations'
      ];
    } else if (cluster.cluster === 'Calculation Errors') {
      return [
        'Review formula sheet for Rotational Dynamics',
        'Practice 15 numerical problems with increasing difficulty',
        'Complete timed practice set (20 mins)',
        'Analyze calculation patterns and common shortcuts'
      ];
    } else if (cluster.cluster === 'Time Mismanagement') {
      return [
        'Practice 5 complex word problems with time tracking',
        'Learn problem-solving frameworks',
        'Attempt timed mini-test (15 mins)',
        'Review time allocation strategies'
      ];
    } else if (cluster.cluster === 'Sign Convention Errors') {
      return [
        'Review sign convention rules for mirrors and lenses',
        'Practice 10 problems focusing on sign application',
        'Solve ray diagram problems',
        'Verify calculations with alternative methods'
      ];
    }
    return [];
  };

  const fixSteps = getFixSteps();

  // Calculate expected improvement and time
  const expectedImprovement = cluster.severity === 'High' ? '+12 marks' : 
                             cluster.severity === 'Medium' ? '+6 marks' : '+3 marks';
  const estimatedTime = cluster.severity === 'High' ? '3 hours' : 
                       cluster.severity === 'Medium' ? '2 hours' : '1 hour';

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-medium hover:opacity-70 transition-opacity mb-6"
        style={{ color: 'var(--accent-primary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Mistake Analysis</span>
      </button>

      {/* Fix Plan Header */}
      <div
        className="p-6 mb-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderTop: `4px solid ${colors.border}`,
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Fix: {cluster.cluster}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {cluster.topics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs font-semibold"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <Target className="w-6 h-6" style={{ color: colors.text }} />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Severity
            </div>
            <div
              className="inline-block px-2 py-1 text-xs font-bold"
              style={{
                background: colors.bg,
                color: colors.text,
              }}
            >
              {cluster.severity}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Frequency
            </div>
            <div className="text-lg font-bold" style={{ color: colors.text }}>
              {cluster.frequency}× errors
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Impact
            </div>
            <div className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
              {cluster.impact}
            </div>
          </div>
        </div>

        {/* Expected Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                Estimated Time
              </div>
              <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {estimatedTime}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
            <div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                Expected Gain
              </div>
              <div className="text-xs font-bold text-emerald-600">
                {expectedImprovement}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why These Mistakes Happen */}
      <div
        className="p-5 mb-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Why This Happens
        </div>
        <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {cluster.cluster === 'Conceptual Confusion' && (
            <>
              You're confusing the direction of induced current with the cause of induction. 
              Lenz's Law requires understanding that nature opposes change - this isn't intuitive 
              and requires deliberate visual practice with moving magnets and coils.
            </>
          )}
          {cluster.cluster === 'Calculation Errors' && (
            <>
              Rotational dynamics problems involve multiple angular quantities that are easy to mix up. 
              The mistake pattern shows you're applying linear motion formulas instead of rotational equivalents,
              particularly when switching between linear and angular momentum.
            </>
          )}
          {cluster.cluster === 'Time Mismanagement' && (
            <>
              Complex word problems require pattern recognition before calculation. You're spending 
              too much time on problem setup instead of recognizing standard problem types. 
              This is fixable with framework practice.
            </>
          )}
          {cluster.cluster === 'Sign Convention Errors' && (
            <>
              Optics sign conventions are arbitrary rules that must be memorized. Your errors show 
              inconsistent application - sometimes using real/virtual logic, sometimes distance-based logic. 
              This requires deliberate rule reinforcement.
            </>
          )}
        </div>
      </div>

      {/* Fix Steps - Actionable */}
      <div
        className="p-5 mb-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-tertiary)' }}>
          Exact Steps to Fix
        </div>
        <ol className="space-y-4">
          {fixSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent-primary)',
                }}
              >
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {step}
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--border-soft)' }} />
            </li>
          ))}
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          className="flex-1 px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
          style={{
            background: cluster.severity === 'High' ? '#dc2626' : 'var(--accent-primary)',
            color: '#ffffff',
          }}
        >
          Start Fix Plan Now
        </button>
        <button
          className="px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
          }}
        >
          Schedule for Later
        </button>
      </div>

      {/* Expected Outcome */}
      <div
        className="mt-6 p-4 text-xs"
        style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
        }}
      >
        <strong>Expected Outcome:</strong> After completing this fix plan, similar problems should 
        reduce by 70-80%. You'll see improvement in your next test on these topics.
      </div>
    </div>
  );
}
