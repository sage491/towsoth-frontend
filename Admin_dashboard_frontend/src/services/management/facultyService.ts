import type { DataContextType } from '../../contexts/DataContext';
import type {
  FacultyStats,
  FacultyTableRow,
  LoadDistributionItem,
  SubjectDistributionItem,
} from '../../types/management';

const formatLoad = (subjectCount: number): string => {
  const hours = subjectCount * 4;
  return `${hours} hrs/week`;
};

export const buildFacultyRows = (data: DataContextType): FacultyTableRow[] => {
  return data.faculty.map((facultyMember) => {
    const subjects = data.getFacultySubjects(facultyMember.id);
    const batchIds = new Set(data.subjectAssignments
      .filter((assignment) => assignment.facultyId === facultyMember.id)
      .map((assignment) => assignment.batchId));

    return {
      id: facultyMember.id,
      name: facultyMember.name,
      empId: facultyMember.employeeId,
      department: facultyMember.department,
      subjects: subjects.map((subject) => subject.name).join(', '),
      subjectCount: subjects.length,
      batches: batchIds.size,
      load: formatLoad(subjects.length),
      status: facultyMember.status,
      contact: facultyMember.email,
    };
  });
};

export const buildFacultyStats = (rows: FacultyTableRow[]): FacultyStats => {
  const totalFaculty = rows.length;
  const totalPresent = rows.filter((row) => row.status === 'Active').length;
  const totalAbsent = Math.max(0, totalFaculty - totalPresent);
  const averageLoadHours = totalFaculty
    ? rows.reduce((sum, row) => sum + Number.parseInt(row.load, 10), 0) / totalFaculty
    : 0;

  return {
    totalFaculty,
    totalPresent,
    totalAbsent,
    averageLoadHours,
  };
};

export const buildSubjectDistribution = (data: DataContextType): SubjectDistributionItem[] => {
  return data.subjects.slice(0, 6).map((subject) => {
    const assignments = data.subjectAssignments.filter((assignment) => assignment.subjectId === subject.id);
    const facultyCount = new Set(assignments.map((assignment) => assignment.facultyId)).size;
    const batchCount = new Set(assignments.map((assignment) => assignment.batchId)).size;

    return {
      subject: subject.name,
      faculty: facultyCount,
      batches: batchCount,
    };
  });
};

export const buildLoadDistribution = (rows: FacultyTableRow[]): LoadDistributionItem[] => {
  const total = rows.length || 1;
  const underloaded = rows.filter((row) => Number.parseInt(row.load, 10) < 8).length;
  const optimal = rows.filter((row) => Number.parseInt(row.load, 10) >= 8 && Number.parseInt(row.load, 10) <= 16).length;
  const overloaded = rows.filter((row) => Number.parseInt(row.load, 10) > 16).length;

  return [
    {
      label: 'Underloaded',
      count: underloaded,
      percent: Math.round((underloaded / total) * 100),
      colorClass: 'bg-[#3b82f6]',
    },
    {
      label: 'Optimal',
      count: optimal,
      percent: Math.round((optimal / total) * 100),
      colorClass: 'bg-[#059669]',
    },
    {
      label: 'Overloaded',
      count: overloaded,
      percent: Math.round((overloaded / total) * 100),
      colorClass: 'bg-[#dc2626]',
    },
  ];
};
