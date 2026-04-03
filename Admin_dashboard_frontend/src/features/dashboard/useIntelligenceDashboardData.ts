import { useMemo } from 'react';
import { useAdminIntelligence } from '../../contexts/AdminIntelligenceContext';
import { useData } from '../../contexts/DataContext';

export interface IntelligenceWidgetMetric {
  value: string;
  trend?: string;
  tone: 'default' | 'info' | 'success' | 'warning' | 'danger';
}

export function useIntelligenceDashboardData() {
  const { intelligence } = useAdminIntelligence();
  const { students, faculty, getInstitutionMetrics } = useData();

  const metrics = useMemo<Record<string, IntelligenceWidgetMetric>>(() => {
    const institutionMetrics = getInstitutionMetrics();
    const warningIssueCount = intelligence.systemHealth.issues.filter(
      (issue) => issue.severity === 'warning' || issue.severity === 'critical',
    ).length;

    return {
      'total-students': {
        value: students.length.toLocaleString(),
        tone: 'default',
      },
      'total-faculty': {
        value: faculty.length.toLocaleString(),
        tone: 'default',
      },
      'attendance-rate': {
        value: `${institutionMetrics.averageAttendance.toFixed(1)}%`,
        tone: institutionMetrics.averageAttendance < 80 ? 'warning' : 'success',
      },
      'academic-session': {
        value: '2024-2025',
        tone: 'info',
      },
      'at-risk-students': {
        value: warningIssueCount.toLocaleString(),
        tone: warningIssueCount > 0 ? 'danger' : 'success',
      },
      'pending-approvals': {
        value: intelligence.systemHealth.issues.length.toLocaleString(),
        tone: intelligence.systemHealth.issues.length > 0 ? 'warning' : 'success',
      },
      'ai-insights': {
        value: intelligence.smartWidgets.filter((widget) => widget.visible).length.toLocaleString(),
        tone: 'info',
      },
    };
  }, [faculty.length, getInstitutionMetrics, intelligence.smartWidgets, intelligence.systemHealth.issues, students.length]);

  return {
    layers: intelligence.dashboardLayers.filter((layer) => layer.visible),
    widgets: intelligence.smartWidgets,
    showExplanations: intelligence.preferences.showExplanations,
    metrics,
  };
}
