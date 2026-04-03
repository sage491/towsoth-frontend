import { useMemo, useState } from 'react';

interface StaffMember {
  id: string;
  name: string;
  staffId: string;
  role: string;
  department: string;
  workEfficiency: number;
  taskCompletionQuality: number;
  disciplinePunctuality: number;
  communication: number;
  responsiveness: number;
  overallPerformance: number;
  supervisorFeedback: number;
  attendanceConsistency: number;
}

const allStaff: StaffMember[] = [
  {
    id: 'STF001',
    name: 'Ramesh Kumar',
    staffId: 'EMP-ADM-001',
    role: 'Administrative Officer',
    department: 'Administration',
    workEfficiency: 4.8,
    taskCompletionQuality: 4.7,
    disciplinePunctuality: 4.9,
    communication: 4.6,
    responsiveness: 4.8,
    overallPerformance: 4.76,
    supervisorFeedback: 4.7,
    attendanceConsistency: 4.9,
  },
  {
    id: 'STF002',
    name: 'Priya Sharma',
    staffId: 'EMP-ACC-001',
    role: 'Accountant',
    department: 'Accounts & Finance',
    workEfficiency: 4.9,
    taskCompletionQuality: 4.8,
    disciplinePunctuality: 4.8,
    communication: 4.7,
    responsiveness: 4.9,
    overallPerformance: 4.82,
    supervisorFeedback: 4.8,
    attendanceConsistency: 4.8,
  },
  {
    id: 'STF003',
    name: 'Suresh Patel',
    staffId: 'EMP-LIB-001',
    role: 'Librarian',
    department: 'Library',
    workEfficiency: 4.6,
    taskCompletionQuality: 4.7,
    disciplinePunctuality: 4.7,
    communication: 4.5,
    responsiveness: 4.6,
    overallPerformance: 4.62,
    supervisorFeedback: 4.6,
    attendanceConsistency: 4.7,
  },
  {
    id: 'STF004',
    name: 'Anjali Verma',
    staffId: 'EMP-LAB-001',
    role: 'Lab Assistant',
    department: 'Laboratory',
    workEfficiency: 4.4,
    taskCompletionQuality: 4.5,
    disciplinePunctuality: 4.5,
    communication: 4.3,
    responsiveness: 4.4,
    overallPerformance: 4.42,
    supervisorFeedback: 4.4,
    attendanceConsistency: 4.5,
  },
  {
    id: 'STF005',
    name: 'Vikram Singh',
    staffId: 'EMP-IT-001',
    role: 'IT Support Specialist',
    department: 'IT Support',
    workEfficiency: 4.9,
    taskCompletionQuality: 4.9,
    disciplinePunctuality: 4.8,
    communication: 4.8,
    responsiveness: 5.0,
    overallPerformance: 4.88,
    supervisorFeedback: 4.9,
    attendanceConsistency: 4.9,
  },
  {
    id: 'STF006',
    name: 'Meena Reddy',
    staffId: 'EMP-ADM-002',
    role: 'Office Clerk',
    department: 'Administration',
    workEfficiency: 4.3,
    taskCompletionQuality: 4.4,
    disciplinePunctuality: 4.4,
    communication: 4.2,
    responsiveness: 4.3,
    overallPerformance: 4.32,
    supervisorFeedback: 4.3,
    attendanceConsistency: 4.5,
  },
  {
    id: 'STF007',
    name: 'Rajesh Nair',
    staffId: 'EMP-MNT-001',
    role: 'Maintenance Supervisor',
    department: 'Maintenance',
    workEfficiency: 4.5,
    taskCompletionQuality: 4.6,
    disciplinePunctuality: 4.6,
    communication: 4.4,
    responsiveness: 4.5,
    overallPerformance: 4.52,
    supervisorFeedback: 4.5,
    attendanceConsistency: 4.6,
  },
  {
    id: 'STF008',
    name: 'Kavita Joshi',
    staffId: 'EMP-SEC-001',
    role: 'Security Officer',
    department: 'Security',
    workEfficiency: 4.6,
    taskCompletionQuality: 4.7,
    disciplinePunctuality: 4.9,
    communication: 4.5,
    responsiveness: 4.6,
    overallPerformance: 4.66,
    supervisorFeedback: 4.6,
    attendanceConsistency: 4.9,
  },
];

export function useStaffPerformanceData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [minWorkEfficiency, setMinWorkEfficiency] = useState(1);
  const [minTaskQuality, setMinTaskQuality] = useState(1);
  const [minDiscipline, setMinDiscipline] = useState(1);
  const [minCommunication, setMinCommunication] = useState(1);
  const [minResponsiveness, setMinResponsiveness] = useState(1);
  const [minAttendance, setMinAttendance] = useState(1);
  const [sortBy, setSortBy] = useState<'performance' | 'efficiency' | 'attendance'>('performance');

  const departments = ['Administration', 'Accounts & Finance', 'Library', 'Laboratory', 'IT Support', 'Maintenance', 'Security', 'Transport'];

  const filteredStaff = useMemo(() => {
    return allStaff.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(staff.department);
      return (
        matchesSearch &&
        matchesDepartment &&
        staff.workEfficiency >= minWorkEfficiency &&
        staff.taskCompletionQuality >= minTaskQuality &&
        staff.disciplinePunctuality >= minDiscipline &&
        staff.communication >= minCommunication &&
        staff.responsiveness >= minResponsiveness &&
        staff.attendanceConsistency >= minAttendance
      );
    });
  }, [searchTerm, selectedDepartments, minWorkEfficiency, minTaskQuality, minDiscipline, minCommunication, minResponsiveness, minAttendance]);

  const sortedStaff = useMemo(() => {
    return [...filteredStaff].sort((first, second) => {
      switch (sortBy) {
        case 'performance':
          return second.overallPerformance - first.overallPerformance;
        case 'efficiency':
          return second.workEfficiency - first.workEfficiency;
        case 'attendance':
          return second.attendanceConsistency - first.attendanceConsistency;
        default:
          return 0;
      }
    });
  }, [filteredStaff, sortBy]);

  const activeFiltersCount =
    selectedDepartments.length +
    (minWorkEfficiency > 1 ? 1 : 0) +
    (minTaskQuality > 1 ? 1 : 0) +
    (minDiscipline > 1 ? 1 : 0) +
    (minCommunication > 1 ? 1 : 0) +
    (minResponsiveness > 1 ? 1 : 0) +
    (minAttendance > 1 ? 1 : 0);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepartments([]);
    setMinWorkEfficiency(1);
    setMinTaskQuality(1);
    setMinDiscipline(1);
    setMinCommunication(1);
    setMinResponsiveness(1);
    setMinAttendance(1);
    setSortBy('performance');
  };

  const toggleDepartment = (department: string) => {
    setSelectedDepartments((previous) =>
      previous.includes(department)
        ? previous.filter((value) => value !== department)
        : [...previous, department],
    );
  };

  return {
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    selectedDepartments,
    minWorkEfficiency,
    setMinWorkEfficiency,
    minTaskQuality,
    setMinTaskQuality,
    minDiscipline,
    setMinDiscipline,
    minCommunication,
    setMinCommunication,
    minResponsiveness,
    setMinResponsiveness,
    minAttendance,
    setMinAttendance,
    sortBy,
    setSortBy,
    departments,
    sortedStaff,
    allStaff,
    activeFiltersCount,
    resetFilters,
    toggleDepartment,
  };
}
