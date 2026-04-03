import { useState, useEffect } from 'react';
import { useAdminIntelligence } from '../../contexts/AdminIntelligenceContext';
import {
  Activity,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

export function SystemHealthMonitor() {
  const { intelligence, refreshSystemHealth, dismissIssue } = useAdminIntelligence();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    refreshSystemHealth();
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-[#059669]';
    if (score >= 60) return 'text-[#f59e0b]';
    return 'text-[#dc2626]';
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return 'bg-[#d1fae5]';
    if (score >= 60) return 'bg-[#fef3c7]';
    return 'bg-[#fee2e2]';
  };

  const getHealthBorder = (score: number) => {
    if (score >= 80) return 'border-[#86efac]';
    if (score >= 60) return 'border-[#fcd34d]';
    return 'border-[#fca5a5]';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-[#dc2626]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />;
      case 'info':
        return <Info className="w-4 h-4 text-[#3b82f6]" />;
      default:
        return <Info className="w-4 h-4 text-[#6b7280]" />;
    }
  };

  const { systemHealth } = intelligence;

  return (
    <div className="bg-white border border-[#d1d5db]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-[#f9fafb] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Activity className={`w-5 h-5 ${getHealthColor(systemHealth.score)}`} />
          <div className="text-left">
            <h3 className="text-[13px] text-[#111827]">System Setup Health</h3>
            <p className="text-[11px] text-[#6b7280]">
              {systemHealth.score}% Complete
              {systemHealth.issues.length > 0 &&
                ` • ${systemHealth.issues.length} ${
                  systemHealth.issues.length === 1 ? 'item' : 'items'
                } need attention`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 ${getHealthBg(systemHealth.score)} border ${getHealthBorder(
              systemHealth.score
            )}`}
          >
            <span className={`text-[13px] ${getHealthColor(systemHealth.score)}`}>
              {systemHealth.score}%
            </span>
          </div>

          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#6b7280]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#6b7280]" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-[#d1d5db]">
          <div className="px-5 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#6b7280]">Setup Progress</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  refreshSystemHealth();
                }}
                className="flex items-center gap-1 text-[11px] text-[#3b82f6] hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
            <div className="h-2 bg-[#e5e7eb]">
              <div
                className={`h-full transition-all duration-500 ${
                  systemHealth.score >= 80
                    ? 'bg-[#059669]'
                    : systemHealth.score >= 60
                    ? 'bg-[#f59e0b]'
                    : 'bg-[#dc2626]'
                }`}
                style={{ width: `${systemHealth.score}%` }}
              />
            </div>
          </div>

          {systemHealth.issues.length > 0 ? (
            <div className="p-5 space-y-3">
              {systemHealth.issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-3 border ${
                    issue.severity === 'critical'
                      ? 'bg-[#fee2e2] border-[#fca5a5]'
                      : issue.severity === 'warning'
                      ? 'bg-[#fef3c7] border-[#fcd34d]'
                      : 'bg-[#f0f9ff] border-[#bae6fd]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[13px] text-[#111827] mb-1">{issue.title}</h5>
                      <p className="text-[11px] text-[#6b7280] mb-2 leading-relaxed">
                        {issue.description}
                      </p>
                      <p className="text-[11px] text-[#3b82f6]">→ {issue.resolution}</p>
                    </div>
                    <button
                      onClick={() => dismissIssue(issue.id)}
                      className="p-1 hover:bg-white transition-colors flex-shrink-0"
                    >
                      <X className="w-3 h-3 text-[#6b7280]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center">
              <CheckCircle className="w-8 h-8 text-[#059669] mx-auto mb-2" />
              <h4 className="text-[13px] text-[#111827] mb-1">All Systems Healthy</h4>
              <p className="text-[11px] text-[#6b7280]">
                Your institution setup is complete and optimized
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
