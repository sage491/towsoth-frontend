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
} from './entities';

// =============================================================================
// SINGLE SOURCE OF TRUTH - ALL DATA CENTRALIZED
// Every module reads from this file. No hardcoded data elsewhere.
// =============================================================================

// -----------------------------------------------------------------------------
// INSTITUTION DATA
// -----------------------------------------------------------------------------

export const institution: Institution = {
  id: 'INST001',
  name: 'National Institute of Technology',
  tagline: 'Excellence in Education',
  establishedYear: 1965,
  type: 'College',
  address: '123 Academic Road, University District, State 560001',
  website: 'https://nit.edu',
  email: 'info@nit.edu',
  phone: '+91-80-12345678',
};

// -----------------------------------------------------------------------------
// ACADEMIC STRUCTURE - FOUNDATION OF THE SYSTEM
// -----------------------------------------------------------------------------

export const streams: Stream[] = [
  {
    id: 'STR001',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    programType: 'UG',
    duration: 4,
    status: 'Active',
    createdDate: '2020-06-15',
  },
  {
    id: 'STR002',
    name: 'Electronics & Communication Engineering',
    code: 'ECE',
    programType: 'UG',
    duration: 4,
    status: 'Active',
    createdDate: '2020-06-15',
  },
  {
    id: 'STR003',
    name: 'Mechanical Engineering',
    code: 'ME',
    programType: 'UG',
    duration: 4,
    status: 'Active',
    createdDate: '2020-06-15',
  },
  {
    id: 'STR004',
    name: 'Civil Engineering',
    code: 'CE',
    programType: 'UG',
    duration: 4,
    status: 'Active',
    createdDate: '2020-06-15',
  },
  {
    id: 'STR005',
    name: 'Master of Computer Applications',
    code: 'MCA',
    programType: 'PG',
    duration: 2,
    status: 'Active',
    createdDate: '2021-06-20',
  },
];

export const batches: Batch[] = [
  {
    id: 'BAT001',
    name: 'CS-A3 (2022-2026)',
    streamId: 'STR001',
    academicYear: '2024-2025',
    startYear: 2022,
    endYear: 2026,
    section: 'A',
    capacity: 60,
    status: 'Active',
  },
  {
    id: 'BAT002',
    name: 'CS-B3 (2022-2026)',
    streamId: 'STR001',
    academicYear: '2024-2025',
    startYear: 2022,
    endYear: 2026,
    section: 'B',
    capacity: 60,
    status: 'Active',
  },
  {
    id: 'BAT003',
    name: 'CS-A2 (2023-2027)',
    streamId: 'STR001',
    academicYear: '2024-2025',
    startYear: 2023,
    endYear: 2027,
    section: 'A',
    capacity: 60,
    status: 'Active',
  },
  {
    id: 'BAT004',
    name: 'ECE-A2 (2023-2027)',
    streamId: 'STR002',
    academicYear: '2024-2025',
    startYear: 2023,
    endYear: 2027,
    section: 'A',
    capacity: 50,
    status: 'Active',
  },
  {
    id: 'BAT005',
    name: 'ME-A1 (2024-2028)',
    streamId: 'STR003',
    academicYear: '2024-2025',
    startYear: 2024,
    endYear: 2028,
    section: 'A',
    capacity: 50,
    status: 'Active',
  },
];

export const subjects: Subject[] = [
  // Computer Science subjects
  {
    id: 'SUB001',
    name: 'Data Structures and Algorithms',
    code: 'CS-301',
    streamId: 'STR001',
    batchId: null, // applies to all CS batches
    semester: 3,
    credits: 4,
    type: 'Core',
  },
  {
    id: 'SUB002',
    name: 'Operating Systems',
    code: 'CS-302',
    streamId: 'STR001',
    batchId: null,
    semester: 3,
    credits: 4,
    type: 'Core',
  },
  {
    id: 'SUB003',
    name: 'Database Management Systems',
    code: 'CS-303',
    streamId: 'STR001',
    batchId: null,
    semester: 3,
    credits: 3,
    type: 'Core',
  },
  {
    id: 'SUB004',
    name: 'Computer Networks Lab',
    code: 'CS-304',
    streamId: 'STR001',
    batchId: null,
    semester: 3,
    credits: 2,
    type: 'Lab',
  },
  {
    id: 'SUB005',
    name: 'Machine Learning',
    code: 'CS-305',
    streamId: 'STR001',
    batchId: null,
    semester: 3,
    credits: 3,
    type: 'Elective',
  },
  // Electronics subjects
  {
    id: 'SUB006',
    name: 'Digital Signal Processing',
    code: 'EC-201',
    streamId: 'STR002',
    batchId: null,
    semester: 2,
    credits: 4,
    type: 'Core',
  },
  {
    id: 'SUB007',
    name: 'Communication Systems',
    code: 'EC-202',
    streamId: 'STR002',
    batchId: null,
    semester: 2,
    credits: 3,
    type: 'Core',
  },
  // Mechanical subjects
  {
    id: 'SUB008',
    name: 'Engineering Mechanics',
    code: 'ME-101',
    streamId: 'STR003',
    batchId: null,
    semester: 1,
    credits: 4,
    type: 'Core',
  },
  {
    id: 'SUB009',
    name: 'Thermodynamics',
    code: 'ME-102',
    streamId: 'STR003',
    batchId: null,
    semester: 1,
    credits: 4,
    type: 'Core',
  },
];

// -----------------------------------------------------------------------------
// USERS - STUDENTS
// -----------------------------------------------------------------------------

export const students: Student[] = [
  {
    id: 'STU001',
    rollNo: 'CS-A3-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@university.edu',
    streamId: 'STR001',
    batchId: 'BAT001',
    status: 'Active',
    enrollmentDate: '2022-07-15',
  },
  {
    id: 'STU002',
    rollNo: 'CS-A3-002',
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    streamId: 'STR001',
    batchId: 'BAT001',
    status: 'Active',
    enrollmentDate: '2022-07-15',
  },
  {
    id: 'STU003',
    rollNo: 'CS-A3-003',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@university.edu',
    streamId: 'STR001',
    batchId: 'BAT001',
    status: 'Active',
    enrollmentDate: '2022-07-15',
  },
  {
    id: 'STU004',
    rollNo: 'CS-B3-015',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@university.edu',
    streamId: 'STR001',
    batchId: 'BAT002',
    status: 'Active',
    enrollmentDate: '2022-07-15',
  },
  {
    id: 'STU005',
    rollNo: 'ECE-A2-042',
    name: 'Arjun Singh',
    email: 'arjun.singh@university.edu',
    streamId: 'STR002',
    batchId: 'BAT004',
    status: 'Active',
    enrollmentDate: '2023-07-15',
  },
  {
    id: 'STU006',
    rollNo: 'ECE-A2-043',
    name: 'Divya Menon',
    email: 'divya.menon@university.edu',
    streamId: 'STR002',
    batchId: 'BAT004',
    status: 'Active',
    enrollmentDate: '2023-07-15',
  },
  {
    id: 'STU007',
    rollNo: 'ME-A1-025',
    name: 'Karthik Iyer',
    email: 'karthik.iyer@university.edu',
    streamId: 'STR003',
    batchId: 'BAT005',
    status: 'Active',
    enrollmentDate: '2024-07-15',
  },
  {
    id: 'STU008',
    rollNo: 'ME-A1-026',
    name: 'Lakshmi Nair',
    email: 'lakshmi.nair@university.edu',
    streamId: 'STR003',
    batchId: 'BAT005',
    status: 'Active',
    enrollmentDate: '2024-07-15',
  },
];

// -----------------------------------------------------------------------------
// USERS - FACULTY
// -----------------------------------------------------------------------------

export const faculty: Faculty[] = [
  {
    id: 'FAC001',
    employeeId: 'FAC-CSE-001',
    name: 'Dr. Ramesh Sharma',
    email: 'ramesh.sharma@university.edu',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Data Structures, Algorithms',
    streamIds: ['STR001'],
    status: 'Active',
    joinedDate: '2015-08-01',
  },
  {
    id: 'FAC002',
    employeeId: 'FAC-CSE-002',
    name: 'Prof. Priya Kumar',
    email: 'priya.kumar@university.edu',
    department: 'Computer Science',
    designation: 'Professor',
    specialization: 'Operating Systems, Distributed Systems',
    streamIds: ['STR001'],
    status: 'Active',
    joinedDate: '2012-07-15',
  },
  {
    id: 'FAC003',
    employeeId: 'FAC-CSE-003',
    name: 'Dr. Anjali Patel',
    email: 'anjali.patel@university.edu',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Database Systems, Big Data',
    streamIds: ['STR001'],
    status: 'Active',
    joinedDate: '2018-08-01',
  },
  {
    id: 'FAC004',
    employeeId: 'FAC-CSE-004',
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@university.edu',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Machine Learning, AI',
    streamIds: ['STR001'],
    status: 'Active',
    joinedDate: '2016-07-20',
  },
  {
    id: 'FAC005',
    employeeId: 'FAC-ECE-001',
    name: 'Dr. Suresh Rao',
    email: 'suresh.rao@university.edu',
    department: 'Electronics',
    designation: 'Professor',
    specialization: 'Digital Signal Processing',
    streamIds: ['STR002'],
    status: 'Active',
    joinedDate: '2010-08-01',
  },
  {
    id: 'FAC006',
    employeeId: 'FAC-ME-001',
    name: 'Prof. Lakshmi Nair',
    email: 'lakshmi.nair.fac@university.edu',
    department: 'Mechanical',
    designation: 'Professor',
    specialization: 'Mechanics, Thermodynamics',
    streamIds: ['STR003'],
    status: 'Active',
    joinedDate: '2011-08-01',
  },
];

// -----------------------------------------------------------------------------
// USERS - STAFF
// -----------------------------------------------------------------------------

export const staff: Staff[] = [
  {
    id: 'STF001',
    employeeId: 'ADM-001',
    name: 'Rajesh Verma',
    email: 'rajesh.verma@university.edu',
    department: 'Administration',
    role: 'Administrative Officer',
    status: 'Active',
    joinedDate: '2018-06-01',
  },
  {
    id: 'STF002',
    employeeId: 'LIB-001',
    name: 'Meera Krishnan',
    email: 'meera.krishnan@university.edu',
    department: 'Library',
    role: 'Senior Librarian',
    status: 'Active',
    joinedDate: '2016-07-15',
  },
  {
    id: 'STF003',
    employeeId: 'IT-001',
    name: 'Amit Desai',
    email: 'amit.desai@university.edu',
    department: 'IT Services',
    role: 'System Administrator',
    status: 'Active',
    joinedDate: '2019-08-01',
  },
];

// -----------------------------------------------------------------------------
// SUBJECT ASSIGNMENTS
// -----------------------------------------------------------------------------

export const subjectAssignments: SubjectAssignment[] = [
  // BAT001 assignments
  { id: 'SA001', subjectId: 'SUB001', facultyId: 'FAC001', batchId: 'BAT001', academicYear: '2024-2025' },
  { id: 'SA002', subjectId: 'SUB002', facultyId: 'FAC002', batchId: 'BAT001', academicYear: '2024-2025' },
  { id: 'SA003', subjectId: 'SUB003', facultyId: 'FAC003', batchId: 'BAT001', academicYear: '2024-2025' },
  { id: 'SA004', subjectId: 'SUB005', facultyId: 'FAC004', batchId: 'BAT001', academicYear: '2024-2025' },
  // BAT002 assignments
  { id: 'SA005', subjectId: 'SUB001', facultyId: 'FAC001', batchId: 'BAT002', academicYear: '2024-2025' },
  { id: 'SA006', subjectId: 'SUB002', facultyId: 'FAC002', batchId: 'BAT002', academicYear: '2024-2025' },
  // BAT004 assignments
  { id: 'SA007', subjectId: 'SUB006', facultyId: 'FAC005', batchId: 'BAT004', academicYear: '2024-2025' },
  { id: 'SA008', subjectId: 'SUB007', facultyId: 'FAC005', batchId: 'BAT004', academicYear: '2024-2025' },
  // BAT005 assignments
  { id: 'SA009', subjectId: 'SUB008', facultyId: 'FAC006', batchId: 'BAT005', academicYear: '2024-2025' },
  { id: 'SA010', subjectId: 'SUB009', facultyId: 'FAC006', batchId: 'BAT005', academicYear: '2024-2025' },
];

// -----------------------------------------------------------------------------
// ATTENDANCE RECORDS
// -----------------------------------------------------------------------------

export const attendanceRecords: AttendanceRecord[] = [
  // STU001 - Aarav (92.5% attendance)
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `ATT001-${i}`,
    studentId: 'STU001',
    subjectId: 'SUB001',
    batchId: 'BAT001',
    date: `2024-${String(Math.floor(i / 20) + 8).padStart(2, '0')}-${String((i % 20) + 1).padStart(2, '0')}`,
    status: (i % 13 === 0 ? 'Absent' : 'Present') as 'Present' | 'Absent',
  })),
  // STU002 - Priya (88.2% attendance)
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `ATT002-${i}`,
    studentId: 'STU002',
    subjectId: 'SUB001',
    batchId: 'BAT001',
    date: `2024-${String(Math.floor(i / 20) + 8).padStart(2, '0')}-${String((i % 20) + 1).padStart(2, '0')}`,
    status: (i % 8 === 0 ? 'Absent' : 'Present') as 'Present' | 'Absent',
  })),
  // STU003 - Rahul (65.3% attendance - at risk)
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `ATT003-${i}`,
    studentId: 'STU003',
    subjectId: 'SUB001',
    batchId: 'BAT001',
    date: `2024-${String(Math.floor(i / 20) + 8).padStart(2, '0')}-${String((i % 20) + 1).padStart(2, '0')}`,
    status: (i % 3 === 0 ? 'Absent' : 'Present') as 'Present' | 'Absent',
  })),
  // STU004 - Sneha (94.7% attendance)
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `ATT004-${i}`,
    studentId: 'STU004',
    subjectId: 'SUB001',
    batchId: 'BAT002',
    date: `2024-${String(Math.floor(i / 20) + 8).padStart(2, '0')}-${String((i % 20) + 1).padStart(2, '0')}`,
    status: (i % 19 === 0 ? 'Absent' : 'Present') as 'Present' | 'Absent',
  })),
];

// -----------------------------------------------------------------------------
// ASSESSMENTS & MARKS
// -----------------------------------------------------------------------------

export const assessments: Assessment[] = [
  {
    id: 'ASS001',
    name: 'Quiz 1 - Data Structures',
    subjectId: 'SUB001',
    batchId: 'BAT001',
    type: 'Quiz',
    totalMarks: 20,
    weightage: 10,
    date: '2024-09-15',
  },
  {
    id: 'ASS002',
    name: 'Midterm - Data Structures',
    subjectId: 'SUB001',
    batchId: 'BAT001',
    type: 'Midterm',
    totalMarks: 50,
    weightage: 30,
    date: '2024-10-20',
  },
];

export const assessmentMarks: AssessmentMark[] = [
  // Quiz 1 marks
  { id: 'AM001', assessmentId: 'ASS001', studentId: 'STU001', marksObtained: 17, submittedDate: '2024-09-15' },
  { id: 'AM002', assessmentId: 'ASS001', studentId: 'STU002', marksObtained: 16, submittedDate: '2024-09-15' },
  { id: 'AM003', assessmentId: 'ASS001', studentId: 'STU003', marksObtained: 12, submittedDate: '2024-09-15' },
  { id: 'AM004', assessmentId: 'ASS001', studentId: 'STU004', marksObtained: 18, submittedDate: '2024-09-15' },
  // Midterm marks
  { id: 'AM005', assessmentId: 'ASS002', studentId: 'STU001', marksObtained: 42, submittedDate: '2024-10-20' },
  { id: 'AM006', assessmentId: 'ASS002', studentId: 'STU002', marksObtained: 41, submittedDate: '2024-10-20' },
  { id: 'AM007', assessmentId: 'ASS002', studentId: 'STU003', marksObtained: 30, submittedDate: '2024-10-20' },
  { id: 'AM008', assessmentId: 'ASS002', studentId: 'STU004', marksObtained: 46, submittedDate: '2024-10-20' },
];

// -----------------------------------------------------------------------------
// RESEARCH & INNOVATION
// -----------------------------------------------------------------------------

export const projects: Project[] = [
  {
    id: 'PRJ001',
    title: 'AI-Based Traffic Management System',
    studentId: 'STU001',
    type: 'Academic',
    status: 'Completed',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    evaluationScore: 85,
  },
  {
    id: 'PRJ002',
    title: 'E-Commerce Platform Development',
    studentId: 'STU001',
    type: 'Industry-based',
    status: 'Completed',
    startDate: '2023-08-01',
    endDate: '2024-01-30',
    evaluationScore: 88,
  },
  {
    id: 'PRJ003',
    title: 'Smart Campus Application',
    studentId: 'STU004',
    type: 'Capstone',
    status: 'In Progress',
    startDate: '2024-07-01',
  },
];

export const researchPapers: ResearchPaper[] = [
  {
    id: 'RP001',
    title: 'Machine Learning Approaches for Traffic Prediction',
    studentId: 'STU004',
    authorshipStatus: 'First author',
    publicationLevel: 'International',
    publicationDate: '2024-03-15',
    journalName: 'IEEE Transactions on Intelligent Transportation',
  },
  {
    id: 'RP002',
    title: 'Data Structures Optimization Techniques',
    studentId: 'STU001',
    authorshipStatus: 'Co-author',
    publicationLevel: 'National',
    publicationDate: '2024-05-20',
    journalName: 'Indian Journal of Computer Science',
  },
];

export const patents: Patent[] = [
  {
    id: 'PAT001',
    title: 'Smart Traffic Signal Control Algorithm',
    studentId: 'STU004',
    status: 'Filed',
    filedDate: '2024-06-10',
    patentNumber: 'IN202401234',
  },
];

export const innovationParticipations: InnovationParticipation[] = [
  {
    id: 'INV001',
    studentId: 'STU001',
    eventName: 'National Innovation Challenge 2024',
    participated: true,
    date: '2024-04-15',
  },
  {
    id: 'INV002',
    studentId: 'STU004',
    eventName: 'Smart India Hackathon',
    participated: true,
    date: '2024-09-20',
    award: 'Winner',
  },
];

// -----------------------------------------------------------------------------
// EVALUATIONS
// -----------------------------------------------------------------------------

export const facultyRatings: FacultyRating[] = [
  {
    id: 'FR001',
    facultyId: 'FAC001',
    studentId: 'STU001',
    subjectId: 'SUB001',
    academicYear: '2024-2025',
    teachingEffectiveness: 5,
    knowledgeLevel: 5,
    communication: 4,
    supportiveness: 5,
    overallRating: 4.75,
    submittedDate: '2024-11-15',
  },
  {
    id: 'FR002',
    facultyId: 'FAC001',
    studentId: 'STU002',
    subjectId: 'SUB001',
    academicYear: '2024-2025',
    teachingEffectiveness: 4,
    knowledgeLevel: 5,
    communication: 4,
    supportiveness: 4,
    overallRating: 4.25,
    submittedDate: '2024-11-15',
  },
];

export const staffPerformanceRecords: StaffPerformance[] = [
  {
    id: 'SP001',
    staffId: 'STF001',
    evaluatorId: 'ADM-DEAN-001',
    period: '2024-Q3',
    productivity: 4,
    punctuality: 5,
    teamwork: 4,
    initiative: 4,
    overallScore: 4.25,
    evaluatedDate: '2024-10-01',
  },
];

// -----------------------------------------------------------------------------
// TIMETABLE DATA
// -----------------------------------------------------------------------------

export const timeSlots: TimeSlot[] = [
  { id: 'TS001', name: 'Period 1', startTime: '09:00', endTime: '10:00', order: 1 },
  { id: 'TS002', name: 'Period 2', startTime: '10:00', endTime: '11:00', order: 2 },
  { id: 'TS003', name: 'Period 3', startTime: '11:15', endTime: '12:15', order: 3 },
  { id: 'TS004', name: 'Period 4', startTime: '12:15', endTime: '13:15', order: 4 },
  { id: 'TS005', name: 'Period 5', startTime: '14:00', endTime: '15:00', order: 5 },
  { id: 'TS006', name: 'Period 6', startTime: '15:00', endTime: '16:00', order: 6 },
];

export const timetableEntries: TimetableEntry[] = [
  // BAT001 (CS-A3) timetable - Monday
  {
    id: 'TTE001',
    batchId: 'BAT001',
    subjectId: 'SUB001', // Data Structures
    facultyId: 'FAC001',
    dayOfWeek: 'Monday',
    timeSlotId: 'TS001',
    room: 'Lab-301',
    semester: 3,
    academicYear: '2024-2025',
  },
  {
    id: 'TTE002',
    batchId: 'BAT001',
    subjectId: 'SUB002', // Operating Systems
    facultyId: 'FAC002',
    dayOfWeek: 'Monday',
    timeSlotId: 'TS002',
    room: 'Room-302',
    semester: 3,
    academicYear: '2024-2025',
  },
  {
    id: 'TTE003',
    batchId: 'BAT001',
    subjectId: 'SUB003', // DBMS
    facultyId: 'FAC003',
    dayOfWeek: 'Monday',
    timeSlotId: 'TS003',
    room: 'Room-303',
    semester: 3,
    academicYear: '2024-2025',
  },
  // BAT001 - Tuesday
  {
    id: 'TTE004',
    batchId: 'BAT001',
    subjectId: 'SUB005', // Machine Learning
    facultyId: 'FAC004',
    dayOfWeek: 'Tuesday',
    timeSlotId: 'TS001',
    room: 'Room-301',
    semester: 3,
    academicYear: '2024-2025',
  },
  {
    id: 'TTE005',
    batchId: 'BAT001',
    subjectId: 'SUB001', // Data Structures
    facultyId: 'FAC001',
    dayOfWeek: 'Tuesday',
    timeSlotId: 'TS002',
    room: 'Lab-301',
    semester: 3,
    academicYear: '2024-2025',
  },
  // BAT001 - Wednesday
  {
    id: 'TTE006',
    batchId: 'BAT001',
    subjectId: 'SUB002', // Operating Systems
    facultyId: 'FAC002',
    dayOfWeek: 'Wednesday',
    timeSlotId: 'TS001',
    room: 'Room-302',
    semester: 3,
    academicYear: '2024-2025',
  },
  {
    id: 'TTE007',
    batchId: 'BAT001',
    subjectId: 'SUB004', // Computer Networks Lab
    facultyId: 'FAC002',
    dayOfWeek: 'Wednesday',
    timeSlotId: 'TS003',
    room: 'Lab-304',
    semester: 3,
    academicYear: '2024-2025',
  },
  // BAT002 (CS-B3) timetable - Monday
  {
    id: 'TTE008',
    batchId: 'BAT002',
    subjectId: 'SUB002', // Operating Systems
    facultyId: 'FAC002',
    dayOfWeek: 'Monday',
    timeSlotId: 'TS004',
    room: 'Room-305',
    semester: 3,
    academicYear: '2024-2025',
  },
  {
    id: 'TTE009',
    batchId: 'BAT002',
    subjectId: 'SUB001', // Data Structures
    facultyId: 'FAC001',
    dayOfWeek: 'Monday',
    timeSlotId: 'TS005',
    room: 'Lab-302',
    semester: 3,
    academicYear: '2024-2025',
  },
  // BAT004 (ECE-A2) timetable - Monday
  {
    id: 'TTE010',
    batchId: 'BAT004',
    subjectId: 'SUB006', // Digital Signal Processing
    facultyId: 'FAC005',
    dayOfWeek: 'Monday',
    timeSlotId: 'TS001',
    room: 'Room-201',
    semester: 2,
    academicYear: '2024-2025',
  },
  {
    id: 'TTE011',
    batchId: 'BAT004',
    subjectId: 'SUB007', // Communication Systems
    facultyId: 'FAC005',
    dayOfWeek: 'Monday',
    timeSlotId: 'TS002',
    room: 'Room-202',
    semester: 2,
    academicYear: '2024-2025',
  },
];