import {
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  UserCog,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';
import { useAdminIntelligence } from '../../contexts/AdminIntelligenceContext';
import { useAdminModeEngine } from '../../contexts/AdminModeEngine';
import { useData } from '../../contexts/DataContext';
import type {
  DashboardActionItem,
  DashboardActivityItem,
  DashboardStatItem,
  DashboardViewData,
} from './types';

const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMinutes = Math.max(1, Math.floor((now - date.getTime()) / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

export function useDashboardData(): DashboardViewData {
  const { state } = useAdminModeEngine();
  const { intelligence } = useAdminIntelligence();
  const { students, faculty, batches, getInstitutionMetrics, getStudentRiskLevel } = useData();

  return useMemo(() => {
    const institutionMetrics = getInstitutionMetrics();
    const highRiskStudentCount = students.filter((student) => getStudentRiskLevel(student.id) === 'High').length;
    const pendingIssueCount = intelligence.systemHealth.issues.filter(
      (issue) => issue.severity === 'critical' || issue.severity === 'warning',
    ).length;

    const actionCards: DashboardActionItem[] = [
      {
        id: 'pending-approvals',
        title: 'Pending Approvals',
        description: `${pendingIssueCount} operational items require review`,
        icon: Clock,
        tone: 'warning',
        ctaLabel: 'Review Now',
        target: '/notifications',
        count: pendingIssueCount,
      },
      {
        id: 'at-risk-students',
        title: 'At-Risk Students',
        description: `${highRiskStudentCount} students need intervention`,
        icon: AlertTriangle,
        tone: highRiskStudentCount > 0 ? 'danger' : 'success',
        ctaLabel: 'View Students',
        target: '/students',
        count: highRiskStudentCount,
        urgent: highRiskStudentCount > 0,
      },
      {
        id: 'attendance-overview',
        title: 'Attendance Watch',
        description: `${institutionMetrics.averageAttendance.toFixed(1)}% average attendance`,
        icon: Calendar,
        tone: institutionMetrics.averageAttendance < 80 ? 'warning' : 'info',
        ctaLabel: 'Open Attendance',
        target: '/attendance',
      },
      {
        id: 'insights',
        title: 'AI Insights',
        description: `${intelligence.smartWidgets.filter((widget) => widget.visible).length} active dashboard insights`,
        icon: TrendingUp,
        tone: 'info',
        ctaLabel: 'Open Analytics',
        target: '/analytics',
      },
    ];

    const statCards: DashboardStatItem[] = [
      {
        id: 'total-students',
        label: 'Total Students',
        value: institutionMetrics.totalStudents.toLocaleString(),
        icon: Users,
        target: '/students',
      },
      {
        id: 'active-faculty',
        label: 'Active Faculty',
        value: institutionMetrics.totalFaculty.toLocaleString(),
        icon: UserCog,
        target: '/faculty',
      },
      {
        id: 'avg-attendance',
        label: 'Avg. Attendance',
        value: `${institutionMetrics.averageAttendance.toFixed(1)}%`,
        icon: Calendar,
        target: '/attendance',
      },
      {
        id: 'active-batches',
        label: 'Active Batches',
        value: batches.length.toLocaleString(),
        icon: FileText,
        target: '/batches',
      },
    ];

    const activityItems: DashboardActivityItem[] = state.auditLog.slice(0, 8).map((entry) => ({
      id: entry.id,
      action: entry.action.replace('-', ' '),
      user: entry.adminName,
      time: formatRelativeTime(entry.timestamp),
      category: entry.source,
      status:
        entry.action === 'mode-changed'
          ? 'info'
          : entry.action === 'reset-visibility'
            ? 'warning'
            : 'default',
    }));

    const activityFilterOptions = [
      { label: 'All Activity', value: 'all' },
      { label: 'Manual', value: 'manual' },
      { label: 'Auto Detected', value: 'auto-detected' },
      { label: 'System', value: 'system-reset' },
    ];

    return {
      title: 'Welcome back, Admin',
      subtitle: `Institution snapshot for ${faculty.length} faculty and ${students.length} students`,
      actionCards,
      statCards,
      activityItems,
      activityFilterOptions,
    };
  }, [
    batches.length,
    faculty.length,
    getInstitutionMetrics,
    getStudentRiskLevel,
    intelligence.smartWidgets,
    intelligence.systemHealth.issues,
    state.auditLog,
    students,
  ]);
}
