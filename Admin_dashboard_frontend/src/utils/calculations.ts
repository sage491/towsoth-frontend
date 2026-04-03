import {
  Student,
  AttendanceRecord,
  AssessmentMark,
  Assessment,
  Subject,
  Project,
  ResearchPaper,
  Patent,
  InnovationParticipation,
  FacultyRating,
  StaffPerformance,
  Batch,
  Stream,
} from '../data/entities';

// =============================================================================
// DERIVED VALUE CALCULATIONS - AUTO-COMPUTED FROM BASE DATA
// No manual entry allowed. All values are computed from source entities.
// =============================================================================

// -----------------------------------------------------------------------------
// ATTENDANCE CALCULATIONS
// -----------------------------------------------------------------------------

export function calculateAttendancePercentage(
  studentId: string,
  attendanceRecords: AttendanceRecord[],
  subjectId?: string
): number {
  const records = attendanceRecords.filter(
    (r) => r.studentId === studentId && (!subjectId || r.subjectId === subjectId)
  );

  if (records.length === 0) return 0;

  const presentCount = records.filter(
    (r) => r.status === 'Present' || r.status === 'Late'
  ).length;

  return (presentCount / records.length) * 100;
}

export function calculateOverallAttendance(
  studentId: string,
  attendanceRecords: AttendanceRecord[]
): number {
  return calculateAttendancePercentage(studentId, attendanceRecords);
}

// -----------------------------------------------------------------------------
// GPA & MARKS CALCULATIONS
// -----------------------------------------------------------------------------

export function calculateSubjectGrade(
  studentId: string,
  subjectId: string,
  assessmentMarks: AssessmentMark[],
  assessments: Assessment[],
  subjects: Subject[]
): { marks: number; grade: string; gpa: number } {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return { marks: 0, grade: 'F', gpa: 0 };

  const subjectAssessments = assessments.filter((a) => a.subjectId === subjectId);
  
  let totalWeightedMarks = 0;
  let totalWeightage = 0;

  for (const assessment of subjectAssessments) {
    const mark = assessmentMarks.find(
      (m) => m.assessmentId === assessment.id && m.studentId === studentId
    );

    if (mark) {
      const percentage = (mark.marksObtained / assessment.totalMarks) * 100;
      totalWeightedMarks += percentage * (assessment.weightage / 100);
      totalWeightage += assessment.weightage;
    }
  }

  const finalMarks = totalWeightage > 0 ? totalWeightedMarks : 0;

  // Calculate grade and GPA
  let grade = 'F';
  let gpa = 0;

  if (finalMarks >= 90) { grade = 'A+'; gpa = 10; }
  else if (finalMarks >= 85) { grade = 'A'; gpa = 9; }
  else if (finalMarks >= 80) { grade = 'A-'; gpa = 8.5; }
  else if (finalMarks >= 75) { grade = 'B+'; gpa = 8; }
  else if (finalMarks >= 70) { grade = 'B'; gpa = 7.5; }
  else if (finalMarks >= 65) { grade = 'B-'; gpa = 7; }
  else if (finalMarks >= 60) { grade = 'C+'; gpa = 6.5; }
  else if (finalMarks >= 55) { grade = 'C'; gpa = 6; }
  else if (finalMarks >= 50) { grade = 'C-'; gpa = 5.5; }
  else if (finalMarks >= 40) { grade = 'D'; gpa = 5; }

  return { marks: finalMarks, grade, gpa };
}

export function calculateOverallGPA(
  studentId: string,
  batchId: string,
  assessmentMarks: AssessmentMark[],
  assessments: Assessment[],
  subjects: Subject[]
): number {
  // Get all subjects for the student's stream/batch
  const batchSubjects = subjects.filter(
    (s) => s.batchId === batchId || s.batchId === null
  );

  let totalCredits = 0;
  let totalWeightedGPA = 0;

  for (const subject of batchSubjects) {
    const { gpa } = calculateSubjectGrade(
      studentId,
      subject.id,
      assessmentMarks,
      assessments,
      subjects
    );

    totalWeightedGPA += gpa * subject.credits;
    totalCredits += subject.credits;
  }

  return totalCredits > 0 ? totalWeightedGPA / totalCredits : 0;
}

export function calculatePercentage(gpa: number): number {
  // Convert 10-point GPA to percentage
  return (gpa / 10) * 100;
}

export function getAcademicClassification(percentage: number): string {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 75) return 'Good';
  if (percentage >= 60) return 'Average';
  return 'Needs Improvement';
}

// -----------------------------------------------------------------------------
// RESEARCH & INNOVATION METRICS
// -----------------------------------------------------------------------------

export function getStudentProjects(
  studentId: string,
  projects: Project[]
): Project[] {
  return projects.filter((p) => p.studentId === studentId);
}

export function getStudentResearchPapers(
  studentId: string,
  papers: ResearchPaper[]
): ResearchPaper[] {
  return papers.filter((p) => p.studentId === studentId);
}

export function getStudentPatents(
  studentId: string,
  patents: Patent[]
): Patent[] {
  return patents.filter((p) => p.studentId === studentId);
}

export function hasInnovationParticipation(
  studentId: string,
  participations: InnovationParticipation[]
): boolean {
  return participations.some((p) => p.studentId === studentId && p.participated);
}

// -----------------------------------------------------------------------------
// STUDENT CLASSIFICATION & TAGS
// -----------------------------------------------------------------------------

export function generateAcademicTags(
  studentId: string,
  gpa: number,
  attendance: number,
  projects: Project[],
  papers: ResearchPaper[],
  patents: Patent[],
  innovations: InnovationParticipation[]
): string[] {
  const tags: string[] = [];

  // Top Performer: GPA >= 8.5 AND attendance >= 90%
  if (gpa >= 8.5 && attendance >= 90) {
    tags.push('Top Performer');
  }

  // Research-Oriented: Has research papers
  const studentPapers = getStudentResearchPapers(studentId, papers);
  if (studentPapers.length > 0) {
    tags.push('Research-Oriented');
  }

  // Project-Focused: Has 3+ projects
  const studentProjects = getStudentProjects(studentId, projects);
  if (studentProjects.length >= 3) {
    tags.push('Project-Focused');
  }

  // Innovation-Driven: Has patents OR innovation participation
  const studentPatents = getStudentPatents(studentId, patents);
  const hasInnovation = hasInnovationParticipation(studentId, innovations);
  if (studentPatents.length > 0 || hasInnovation) {
    tags.push('Innovation-Driven');
  }

  // Academically At Risk: GPA < 7.0 OR attendance < 75%
  if (gpa < 7.0 || attendance < 75) {
    tags.push('Academically At Risk');
  }

  // Balanced Performer: GPA between 7-8.5, attendance 80-90%, has projects
  if (
    gpa >= 7.0 &&
    gpa < 8.5 &&
    attendance >= 80 &&
    attendance < 90 &&
    studentProjects.length > 0 &&
    !tags.includes('Academically At Risk')
  ) {
    tags.push('Balanced Performer');
  }

  return tags;
}

// -----------------------------------------------------------------------------
// RISK ANALYSIS
// -----------------------------------------------------------------------------

export function calculateRiskLevel(
  gpa: number,
  attendance: number
): 'Low' | 'Medium' | 'High' {
  // High Risk: GPA < 6.0 OR attendance < 70%
  if (gpa < 6.0 || attendance < 70) return 'High';
  
  // Medium Risk: GPA < 7.5 OR attendance < 80%
  if (gpa < 7.5 || attendance < 80) return 'Medium';
  
  // Low Risk: Otherwise
  return 'Low';
}

export function calculateTrend(
  currentValue: number,
  previousValue: number
): 'up' | 'down' | 'neutral' {
  const diff = currentValue - previousValue;
  if (diff > 2) return 'up';
  if (diff < -2) return 'down';
  return 'neutral';
}

// -----------------------------------------------------------------------------
// FACULTY METRICS
// -----------------------------------------------------------------------------

export function calculateFacultyAverageRating(
  facultyId: string,
  ratings: FacultyRating[]
): number {
  const facultyRatings = ratings.filter((r) => r.facultyId === facultyId);
  
  if (facultyRatings.length === 0) return 0;

  const sum = facultyRatings.reduce((acc, r) => acc + r.overallRating, 0);
  return sum / facultyRatings.length;
}

export function getFacultySubjects(
  facultyId: string,
  subjectAssignments: any[],
  subjects: Subject[]
): Subject[] {
  const assignedSubjectIds = subjectAssignments
    .filter((sa) => sa.facultyId === facultyId)
    .map((sa) => sa.subjectId);

  return subjects.filter((s) => assignedSubjectIds.includes(s.id));
}

export function getFacultyStudents(
  facultyId: string,
  subjectAssignments: any[],
  students: Student[]
): Student[] {
  const assignedBatchIds = subjectAssignments
    .filter((sa) => sa.facultyId === facultyId)
    .map((sa) => sa.batchId);

  return students.filter((s) => assignedBatchIds.includes(s.batchId));
}

// -----------------------------------------------------------------------------
// STAFF METRICS
// -----------------------------------------------------------------------------

export function calculateStaffAveragePerformance(
  staffId: string,
  performances: StaffPerformance[]
): number {
  const staffPerformances = performances.filter((p) => p.staffId === staffId);
  
  if (staffPerformances.length === 0) return 0;

  const sum = staffPerformances.reduce((acc, p) => acc + p.overallScore, 0);
  return sum / staffPerformances.length;
}

// -----------------------------------------------------------------------------
// INSTITUTIONAL ANALYTICS
// -----------------------------------------------------------------------------

export function calculateInstitutionMetrics(
  students: Student[],
  faculty: any[],
  staff: any[],
  attendanceRecords: AttendanceRecord[],
  batches: Batch[],
  streams: Stream[]
) {
  const activeStudents = students.filter((s) => s.status === 'Active');
  const activeFaculty = faculty.filter((f) => f.status === 'Active');
  const activeStaff = staff.filter((s) => s.status === 'Active');

  // Calculate overall attendance
  const uniqueStudents = [...new Set(attendanceRecords.map((r) => r.studentId))];
  const totalAttendance = uniqueStudents.reduce((acc, studentId) => {
    return acc + calculateOverallAttendance(studentId, attendanceRecords);
  }, 0);
  const avgAttendance = uniqueStudents.length > 0 ? totalAttendance / uniqueStudents.length : 0;

  return {
    totalStudents: activeStudents.length,
    totalFaculty: activeFaculty.length,
    totalStaff: activeStaff.length,
    totalStreams: streams.filter((s) => s.status === 'Active').length,
    totalBatches: batches.filter((b) => b.status === 'Active').length,
    averageAttendance: avgAttendance,
  };
}

// -----------------------------------------------------------------------------
// BATCH ANALYTICS
// -----------------------------------------------------------------------------

export function getBatchStudents(batchId: string, students: Student[]): Student[] {
  return students.filter((s) => s.batchId === batchId);
}

export function getBatchEnrollmentRate(
  batch: Batch,
  students: Student[]
): number {
  const enrolledCount = getBatchStudents(batch.id, students).length;
  return (enrolledCount / batch.capacity) * 100;
}

// -----------------------------------------------------------------------------
// STREAM ANALYTICS
// -----------------------------------------------------------------------------

export function getStreamBatches(streamId: string, batches: Batch[]): Batch[] {
  return batches.filter((b) => b.streamId === streamId);
}

export function getStreamStudents(streamId: string, students: Student[]): Student[] {
  return students.filter((s) => s.streamId === streamId);
}