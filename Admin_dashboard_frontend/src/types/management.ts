export interface FacultyTableRow {
  id: string;
  name: string;
  empId: string;
  department: string;
  subjects: string;
  subjectCount: number;
  batches: number;
  load: string;
  status: string;
  contact: string;
}

export interface SubjectDistributionItem {
  subject: string;
  faculty: number;
  batches: number;
}

export interface LoadDistributionItem {
  label: string;
  count: number;
  percent: number;
  colorClass: string;
}

export interface FacultyStats {
  totalFaculty: number;
  totalPresent: number;
  totalAbsent: number;
  averageLoadHours: number;
}

export interface StudentSummaryStats {
  totalStudents: number;
  activeStudents: number;
  averageAttendance: number;
  averageGpa: number;
  atRiskStudents: number;
}
