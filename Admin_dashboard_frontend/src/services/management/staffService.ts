import {
  Building2,
  CheckCircle,
  Clock,
  FileCheck,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import type {
  DepartmentPerformanceRow,
  StaffActivityItem,
  StaffOperationalMetric,
  StaffSummaryStat,
} from '../../types/operations';

export const getStaffDashboardSummaryStats = (): StaffSummaryStat[] => [
  {
    label: 'Total Staff',
    value: '247',
    trend: '+12',
    trendUp: true,
    icon: Users,
    description: 'All staff members',
  },
  {
    label: 'Active Staff',
    value: '238',
    trend: '+8',
    trendUp: true,
    icon: UserCheck,
    description: 'Currently active',
  },
  {
    label: 'Departments Covered',
    value: '18',
    trend: '+2',
    trendUp: true,
    icon: Building2,
    description: 'Operational units',
  },
  {
    label: 'Task Completion Rate',
    value: '94.2%',
    trend: '+2.3%',
    trendUp: true,
    icon: CheckCircle,
    description: 'Average completion',
  },
];

export const getStaffOperationalMetrics = (): StaffOperationalMetric[] => [
  {
    label: 'Attendance Rate',
    value: '96.8%',
    change: '+1.2%',
    positive: true,
    icon: UserCheck,
  },
  {
    label: 'Task / Duty Completion',
    value: '94.2%',
    change: '+2.3%',
    positive: true,
    icon: FileCheck,
  },
  {
    label: 'Average Response Time',
    value: '2.4 hrs',
    change: '-0.5 hrs',
    positive: true,
    icon: Clock,
  },
  {
    label: 'AI Operational Insights',
    value: '156',
    change: '+24',
    positive: true,
    icon: Zap,
  },
];

export const getDepartmentPerformanceRows = (): DepartmentPerformanceRow[] => [
  { dept: 'Administration', staff: 45, completion: 96.5, attendance: 98.2 },
  { dept: 'Accounts & Finance', staff: 28, completion: 97.8, attendance: 97.5 },
  { dept: 'Library', staff: 22, completion: 95.2, attendance: 96.8 },
  { dept: 'Laboratory', staff: 38, completion: 93.4, attendance: 95.6 },
  { dept: 'IT Support', staff: 18, completion: 98.1, attendance: 97.9 },
  { dept: 'Maintenance', staff: 32, completion: 91.7, attendance: 94.3 },
  { dept: 'Security', staff: 24, completion: 94.8, attendance: 99.1 },
  { dept: 'Transport', staff: 20, completion: 92.5, attendance: 96.2 },
];

export const getStaffActivityItems = (): StaffActivityItem[] => [
  { activity: 'Monthly attendance reports generated', time: '2 hours ago', type: 'report' },
  { activity: '12 new staff onboarded successfully', time: '5 hours ago', type: 'success' },
  { activity: 'Performance evaluations completed for Q4', time: '1 day ago', type: 'evaluation' },
  { activity: 'Department duty rosters updated', time: '2 days ago', type: 'update' },
  { activity: 'Staff training session scheduled', time: '3 days ago', type: 'schedule' },
];
