import { createContext, useContext, ReactNode } from 'react';
import * as mockData from '../data/mockData';
import * as calculations from '../utils/calculations';
import {
  Stream,
  Batch,
  Subject,
  Student,
  Faculty,
  Staff,
  SubjectAssignment,
  AttendanceRecord,
  Assessment,
  AssessmentMark,
  Project,
  ResearchPaper,
  Patent,
  InnovationParticipation,
  FacultyRating,
  StaffPerformance,
  Institution,
  TimeSlot,
  TimetableEntry,
} from '../data/entities';

// =============================================================================
// DATA CONTEXT - SINGLE SOURCE OF TRUTH ACCESS
// All components must consume data through this context
// =============================================================================

export interface DataContextType {
  // Core entities (READ-ONLY from single source)
  institution: Institution;
  streams: Stream[];
  batches: Batch[];
  subjects: Subject[];
  students: Student[];
  faculty: Faculty[];
  staff: Staff[];
  subjectAssignments: SubjectAssignment[];
  attendanceRecords: AttendanceRecord[];
  assessments: Assessment[];
  assessmentMarks: AssessmentMark[];
  projects: Project[];
  researchPapers: ResearchPaper[];
  patents: Patent[];
  innovationParticipations: InnovationParticipation[];
  facultyRatings: FacultyRating[];
  staffPerformanceRecords: StaffPerformance[];
  timeSlots: TimeSlot[];
  timetableEntries: TimetableEntry[];

  // Lookup functions (by ID)
  getStreamById: (id: string) => Stream | undefined;
  getBatchById: (id: string) => Batch | undefined;
  getSubjectById: (id: string) => Subject | undefined;
  getStudentById: (id: string) => Student | undefined;
  getFacultyById: (id: string) => Faculty | undefined;
  getStaffById: (id: string) => Staff | undefined;
  getTimeSlotById: (id: string) => TimeSlot | undefined;

  // Relationship queries
  getBatchesByStream: (streamId: string) => Batch[];
  getSubjectsByStream: (streamId: string) => Subject[];
  getSubjectsByBatch: (batchId: string) => Subject[];
  getStudentsByBatch: (batchId: string) => Student[];
  getStudentsByStream: (streamId: string) => Student[];
  getFacultyByStream: (streamId: string) => Faculty[];
  
  // Timetable queries
  getTimetableByBatch: (batchId: string) => TimetableEntry[];
  getTimetableByDay: (batchId: string, day: string) => TimetableEntry[];
  getTimeSlotsByBatch: (batchId: string) => TimeSlot[];
  
  // Student metrics (derived values)
  getStudentAttendance: (studentId: string) => number;
  getStudentGPA: (studentId: string) => number;
  getStudentPercentage: (studentId: string) => number;
  getStudentRiskLevel: (studentId: string) => 'Low' | 'Medium' | 'High';
  getStudentTrend: (studentId: string) => 'up' | 'down' | 'neutral';
  getStudentAcademicTags: (studentId: string) => string[];
  getStudentProjects: (studentId: string) => Project[];
  getStudentResearchPapers: (studentId: string) => ResearchPaper[];
  getStudentPatents: (studentId: string) => Patent[];
  
  // Faculty metrics
  getFacultyAverageRating: (facultyId: string) => number;
  getFacultySubjects: (facultyId: string) => Subject[];
  getFacultyStudents: (facultyId: string) => Student[];
  
  // Staff metrics
  getStaffAveragePerformance: (staffId: string) => number;
  
  // Institutional analytics
  getInstitutionMetrics: () => {
    totalStudents: number;
    totalFaculty: number;
    totalStaff: number;
    totalStreams: number;
    totalBatches: number;
    averageAttendance: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Load all data from single source
  const institution = mockData.institution;
  const streams = mockData.streams;
  const batches = mockData.batches;
  const subjects = mockData.subjects;
  const students = mockData.students;
  const faculty = mockData.faculty;
  const staff = mockData.staff;
  const subjectAssignments = mockData.subjectAssignments;
  const attendanceRecords = mockData.attendanceRecords;
  const assessments = mockData.assessments;
  const assessmentMarks = mockData.assessmentMarks;
  const projects = mockData.projects;
  const researchPapers = mockData.researchPapers;
  const patents = mockData.patents;
  const innovationParticipations = mockData.innovationParticipations;
  const facultyRatings = mockData.facultyRatings;
  const staffPerformanceRecords = mockData.staffPerformanceRecords;
  const timeSlots = mockData.timeSlots;
  const timetableEntries = mockData.timetableEntries;

  // Lookup functions
  const getStreamById = (id: string) => streams.find((s) => s.id === id);
  const getBatchById = (id: string) => batches.find((b) => b.id === id);
  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);
  const getStudentById = (id: string) => students.find((s) => s.id === id);
  const getFacultyById = (id: string) => faculty.find((f) => f.id === id);
  const getStaffById = (id: string) => staff.find((s) => s.id === id);
  const getTimeSlotById = (id: string) => timeSlots.find((ts) => ts.id === id);

  // Relationship queries
  const getBatchesByStream = (streamId: string) => 
    batches.filter((b) => b.streamId === streamId);
  
  const getSubjectsByStream = (streamId: string) => 
    subjects.filter((s) => s.streamId === streamId);
  
  const getSubjectsByBatch = (batchId: string) => {
    const batch = getBatchById(batchId);
    if (!batch) return [];
    return subjects.filter((s) => 
      s.streamId === batch.streamId && (s.batchId === batchId || s.batchId === null)
    );
  };
  
  const getStudentsByBatch = (batchId: string) => 
    calculations.getBatchStudents(batchId, students);
  
  const getStudentsByStream = (streamId: string) => 
    calculations.getStreamStudents(streamId, students);
  
  const getFacultyByStream = (streamId: string) => 
    faculty.filter((f) => f.streamIds.includes(streamId));

  // Timetable queries
  const getTimetableByBatch = (batchId: string) => 
    timetableEntries.filter((te) => te.batchId === batchId);
  
  const getTimetableByDay = (batchId: string, day: string) => 
    timetableEntries.filter((te) => te.batchId === batchId && te.dayOfWeek === day);
  
  const getTimeSlotsByBatch = (batchId: string) => {
    const entries = getTimetableByBatch(batchId);
    const slotIds = [...new Set(entries.map(e => e.timeSlotId))];
    return timeSlots.filter(ts => slotIds.includes(ts.id)).sort((a, b) => a.order - b.order);
  };

  // Student metrics
  const getStudentAttendance = (studentId: string) => 
    calculations.calculateOverallAttendance(studentId, attendanceRecords);
  
  const getStudentGPA = (studentId: string) => {
    const student = getStudentById(studentId);
    if (!student) return 0;
    return calculations.calculateOverallGPA(
      studentId,
      student.batchId,
      assessmentMarks,
      assessments,
      subjects
    );
  };
  
  const getStudentPercentage = (studentId: string) => {
    const gpa = getStudentGPA(studentId);
    return calculations.calculatePercentage(gpa);
  };
  
  const getStudentRiskLevel = (studentId: string) => {
    const gpa = getStudentGPA(studentId);
    const attendance = getStudentAttendance(studentId);
    return calculations.calculateRiskLevel(gpa, attendance);
  };
  
  const getStudentTrend = (studentId: string) => {
    // For now, return a calculated trend based on current vs previous period
    // In a real system, this would compare historical data
    const gpa = getStudentGPA(studentId);
    const previousGPA = gpa - (Math.random() * 0.5 - 0.25); // Mock previous GPA
    return calculations.calculateTrend(gpa, previousGPA);
  };
  
  const getStudentAcademicTags = (studentId: string) => {
    const gpa = getStudentGPA(studentId);
    const attendance = getStudentAttendance(studentId);
    return calculations.generateAcademicTags(
      studentId,
      gpa,
      attendance,
      projects,
      researchPapers,
      patents,
      innovationParticipations
    );
  };
  
  const getStudentProjects = (studentId: string) => 
    calculations.getStudentProjects(studentId, projects);
  
  const getStudentResearchPapers = (studentId: string) => 
    calculations.getStudentResearchPapers(studentId, researchPapers);
  
  const getStudentPatents = (studentId: string) => 
    calculations.getStudentPatents(studentId, patents);

  // Faculty metrics
  const getFacultyAverageRating = (facultyId: string) => 
    calculations.calculateFacultyAverageRating(facultyId, facultyRatings);
  
  const getFacultySubjects = (facultyId: string) => 
    calculations.getFacultySubjects(facultyId, subjectAssignments, subjects);
  
  const getFacultyStudents = (facultyId: string) => 
    calculations.getFacultyStudents(facultyId, subjectAssignments, students);

  // Staff metrics
  const getStaffAveragePerformance = (staffId: string) => 
    calculations.calculateStaffAveragePerformance(staffId, staffPerformanceRecords);

  // Institutional analytics
  const getInstitutionMetrics = () => 
    calculations.calculateInstitutionMetrics(
      students,
      faculty,
      staff,
      attendanceRecords,
      batches,
      streams
    );

  const value: DataContextType = {
    // Core entities
    institution,
    streams,
    batches,
    subjects,
    students,
    faculty,
    staff,
    subjectAssignments,
    attendanceRecords,
    assessments,
    assessmentMarks,
    projects,
    researchPapers,
    patents,
    innovationParticipations,
    facultyRatings,
    staffPerformanceRecords,
    timeSlots,
    timetableEntries,

    // Lookups
    getStreamById,
    getBatchById,
    getSubjectById,
    getStudentById,
    getFacultyById,
    getStaffById,
    getTimeSlotById,

    // Relationships
    getBatchesByStream,
    getSubjectsByStream,
    getSubjectsByBatch,
    getStudentsByBatch,
    getStudentsByStream,
    getFacultyByStream,

    // Timetable queries
    getTimetableByBatch,
    getTimetableByDay,
    getTimeSlotsByBatch,

    // Student metrics
    getStudentAttendance,
    getStudentGPA,
    getStudentPercentage,
    getStudentRiskLevel,
    getStudentTrend,
    getStudentAcademicTags,
    getStudentProjects,
    getStudentResearchPapers,
    getStudentPatents,

    // Faculty metrics
    getFacultyAverageRating,
    getFacultySubjects,
    getFacultyStudents,

    // Staff metrics
    getStaffAveragePerformance,

    // Institutional
    getInstitutionMetrics,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}