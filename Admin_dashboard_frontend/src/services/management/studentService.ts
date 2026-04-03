import type { DataContextType } from '../../contexts/DataContext';
import type { StudentSummaryStats } from '../../types/management';

export const buildStudentSummaryStats = (data: DataContextType): StudentSummaryStats => {
  const totalStudents = data.students.length;
  const activeStudents = data.students.filter((student) => student.status === 'Active').length;

  const attendanceValues = data.students.map((student) => data.getStudentAttendance(student.id));
  const averageAttendance = attendanceValues.length
    ? attendanceValues.reduce((sum, value) => sum + value, 0) / attendanceValues.length
    : 0;

  const gpaValues = data.students.map((student) => data.getStudentGPA(student.id));
  const averageGpa = gpaValues.length
    ? gpaValues.reduce((sum, value) => sum + value, 0) / gpaValues.length
    : 0;

  const atRiskStudents = data.students.filter((student) => {
    const riskLevel = data.getStudentRiskLevel(student.id);
    return riskLevel === 'High' || riskLevel === 'Medium';
  }).length;

  return {
    totalStudents,
    activeStudents,
    averageAttendance,
    averageGpa,
    atRiskStudents,
  };
};
