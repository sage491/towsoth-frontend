// =============================================================================
// CORE ENTITY DEFINITIONS - SINGLE SOURCE OF TRUTH
// All modules must reference these entities by ID, not by hardcoded values
// =============================================================================

// -----------------------------------------------------------------------------
// ACADEMIC STRUCTURE ENTITIES
// -----------------------------------------------------------------------------

export interface Stream {
  id: string;
  name: string;
  code: string;
  programType: 'UG' | 'PG' | 'Diploma';
  duration: number; // years
  status: 'Active' | 'Archived';
  createdDate: string;
}

export interface Batch {
  id: string;
  name: string;
  streamId: string; // FK to Stream
  academicYear: string;
  startYear: number;
  endYear: number;
  section: string;
  capacity: number;
  status: 'Active' | 'Completed' | 'Archived';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  streamId: string; // FK to Stream
  batchId: string | null; // FK to Batch (null = applies to all batches)
  semester: number;
  credits: number;
  type: 'Core' | 'Elective' | 'Lab';
}

// -----------------------------------------------------------------------------
// USER ENTITIES
// -----------------------------------------------------------------------------

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  streamId: string; // FK to Stream
  batchId: string; // FK to Batch
  status: 'Active' | 'Inactive';
  enrollmentDate: string;
  profileImage?: string;
}

export interface Faculty {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  specialization: string;
  streamIds: string[]; // FK to Streams (can teach multiple)
  status: 'Active' | 'On Leave' | 'Inactive';
  joinedDate: string;
  profileImage?: string;
}

export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinedDate: string;
  profileImage?: string;
}

// -----------------------------------------------------------------------------
// ASSIGNMENT ENTITIES (RELATIONSHIPS)
// -----------------------------------------------------------------------------

export interface SubjectAssignment {
  id: string;
  subjectId: string; // FK to Subject
  facultyId: string; // FK to Faculty
  batchId: string; // FK to Batch
  academicYear: string;
}

// -----------------------------------------------------------------------------
// ACADEMIC PERFORMANCE ENTITIES
// -----------------------------------------------------------------------------

export interface AttendanceRecord {
  id: string;
  studentId: string; // FK to Student
  subjectId: string; // FK to Subject
  batchId: string; // FK to Batch
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

export interface Assessment {
  id: string;
  name: string;
  subjectId: string; // FK to Subject
  batchId: string; // FK to Batch
  type: 'Quiz' | 'Assignment' | 'Midterm' | 'Final' | 'Project';
  totalMarks: number;
  weightage: number; // percentage contribution to final grade
  date: string;
}

export interface AssessmentMark {
  id: string;
  assessmentId: string; // FK to Assessment
  studentId: string; // FK to Student
  marksObtained: number;
  submittedDate?: string;
  feedback?: string;
}

// -----------------------------------------------------------------------------
// RESEARCH & INNOVATION ENTITIES
// -----------------------------------------------------------------------------

export interface Project {
  id: string;
  title: string;
  studentId: string; // FK to Student
  type: 'Academic' | 'Industry-based' | 'Capstone';
  status: 'In Progress' | 'Completed' | 'Abandoned';
  startDate: string;
  endDate?: string;
  evaluationScore?: number;
  description?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  studentId: string; // FK to Student
  authorshipStatus: 'None' | 'Co-author' | 'First author';
  publicationLevel: 'None' | 'College' | 'National' | 'International';
  publicationDate?: string;
  journalName?: string;
}

export interface Patent {
  id: string;
  title: string;
  studentId: string; // FK to Student
  status: 'None' | 'Filed' | 'Published' | 'Granted';
  filedDate?: string;
  grantedDate?: string;
  patentNumber?: string;
}

export interface InnovationParticipation {
  id: string;
  studentId: string; // FK to Student
  eventName: string;
  participated: boolean;
  date: string;
  award?: string;
}

// -----------------------------------------------------------------------------
// EVALUATION ENTITIES
// -----------------------------------------------------------------------------

export interface FacultyRating {
  id: string;
  facultyId: string; // FK to Faculty
  studentId: string; // FK to Student
  subjectId: string; // FK to Subject
  academicYear: string;
  teachingEffectiveness: number; // 1-5
  knowledgeLevel: number; // 1-5
  communication: number; // 1-5
  supportiveness: number; // 1-5
  overallRating: number; // calculated average
  comments?: string;
  submittedDate: string;
}

export interface StaffPerformance {
  id: string;
  staffId: string; // FK to Staff
  evaluatorId: string; // FK to evaluator (admin/manager)
  period: string; // e.g., "2024-Q1"
  productivity: number; // 1-5
  punctuality: number; // 1-5
  teamwork: number; // 1-5
  initiative: number; // 1-5
  overallScore: number; // calculated average
  comments?: string;
  evaluatedDate: string;
}

// -----------------------------------------------------------------------------
// AI & ANALYTICS ENTITIES
// -----------------------------------------------------------------------------

export interface StudentRiskFlag {
  id: string;
  studentId: string; // FK to Student
  riskLevel: 'Low' | 'Medium' | 'High';
  factors: RiskFactor[];
  trend: 'up' | 'down' | 'neutral';
  lastCalculated: string;
}

export interface RiskFactor {
  type: 'attendance' | 'gpa' | 'assessment' | 'engagement';
  severity: 'low' | 'medium' | 'high';
  description: string;
  value: number;
}

// -----------------------------------------------------------------------------
// INSTITUTION CONFIGURATION
// -----------------------------------------------------------------------------

export interface Institution {
  id: string;
  name: string;
  logo?: string;
  tagline?: string;
  establishedYear: number;
  type: 'School' | 'College' | 'University';
  address: string;
  website?: string;
  email: string;
  phone: string;
}

// -----------------------------------------------------------------------------
// TIMETABLE & SCHEDULE ENTITIES
// -----------------------------------------------------------------------------

export interface TimeSlot {
  id: string;
  name: string; // e.g., "Period 1", "Morning Session"
  startTime: string; // HH:MM format
  endTime: string;
  order: number; // for sorting
}

export interface TimetableEntry {
  id: string;
  batchId: string; // FK to Batch
  subjectId: string; // FK to Subject
  facultyId: string; // FK to Faculty
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlotId: string; // FK to TimeSlot
  room?: string;
  semester: number;
  academicYear: string;
}