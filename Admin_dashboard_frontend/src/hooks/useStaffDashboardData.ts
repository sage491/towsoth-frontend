import { useMemo } from 'react';
import {
  getDepartmentPerformanceRows,
  getStaffActivityItems,
  getStaffDashboardSummaryStats,
  getStaffOperationalMetrics,
} from '../services/management/staffService';

export function useStaffDashboardData() {
  const summaryStats = useMemo(() => getStaffDashboardSummaryStats(), []);
  const operationalMetrics = useMemo(() => getStaffOperationalMetrics(), []);
  const departmentPerformance = useMemo(() => getDepartmentPerformanceRows(), []);
  const recentActivities = useMemo(() => getStaffActivityItems(), []);

  return {
    summaryStats,
    operationalMetrics,
    departmentPerformance,
    recentActivities,
  };
}
