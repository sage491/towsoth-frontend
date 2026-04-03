# ERP System Architecture - Single Source of Truth

## 🎯 Core Principle: No Duplicate Data, Only References

This ERP system is built on a **fully interconnected architecture** where all data flows from a centralized source. No page owns its own data—all pages consume from core entities and derive values through calculations.

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SINGLE SOURCE OF TRUTH                   │
│                     /data/mockData.ts                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Streams (Program/Department)                        │  │
│  │ • Batches (Cohorts)                                   │  │
│  │ • Subjects (Courses)                                  │  │
│  │ • Students                                            │  │
│  │ • Faculty                                             │  │
│  │ • Staff                                               │  │
│  │ • Attendance Records                                  │  │
│  │ • Assessments & Marks                                 │  │
│  │ • Projects, Research, Patents                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  DERIVATION LAYER                            │
│                  /utils/calculations.ts                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • calculateAttendance()                              │  │
│  │ • calculateGPA()                                      │  │
│  │ • calculateRiskLevel()                                │  │
│  │ • generateAcademicTags()                              │  │
│  │ • getFacultyStudents()                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA CONTEXT LAYER                         │
│                   /contexts/DataContext.tsx                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Provides unified access to all data and derived      │  │
│  │ values through React Context API                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      UI COMPONENTS                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • StudentManagementTableConnected                    │  │
│  │ • Dashboard                                           │  │
│  │ • Faculty Pages                                       │  │
│  │ • Analytics                                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 Core Entity Relationships

### Academic Structure (Foundation)
```
Institution
  └── Stream (STR001: Computer Science)
        ├── Batches
        │     ├── BAT001: CS-A3 (2022-2026)
        │     └── BAT002: CS-B3 (2022-2026)
        └── Subjects
              ├── SUB001: Data Structures (applies to all batches)
              └── SUB002: Operating Systems
```

### Student Linkage
```
Student (STU001: Aarav Sharma)
  ├── streamId: STR001 (Computer Science)
  ├── batchId: BAT001 (CS-A3)
  ├── Attendance Records → calculateAttendance() → 92.5%
  ├── Assessment Marks → calculateGPA() → 8.5
  ├── Projects → getStudentProjects() → 4 projects
  ├── Research Papers → getStudentResearchPapers() → 2 papers
  └── DERIVED VALUES:
        ├── Risk Level: Low (from GPA + Attendance)
        ├── Academic Tags: ["Top Performer", "Project-Focused"]
        └── Percentage: 85% (from GPA)
```

### Faculty Linkage
```
Faculty (FAC001: Dr. Ramesh Sharma)
  ├── streamIds: [STR001]
  ├── Subject Assignments:
  │     └── SUB001 (Data Structures) → BAT001, BAT002
  ├── DERIVED VALUES:
        ├── Assigned Students → getFacultyStudents() → [STU001, STU002, ...]
        ├── Average Rating → calculateFacultyAverageRating() → 4.75
        └── Subject Performance → calculated from student results
```

---

## ⚡ Key Features of This Architecture

### 1. **Cascading Filters**
```typescript
// Stream changes → Batch options update automatically
selectedStream → getBatchesByStream(streamId) → Available Batches

// Batch changes → Subject options update automatically  
selectedBatch → getSubjectsByBatch(batchId) → Available Subjects
```

### 2. **Auto-Calculated Derived Values**
No manual entry. All computed from source data:
- **Attendance %**: From attendance records
- **GPA**: From assessment marks + subject credits
- **Risk Level**: From GPA + attendance thresholds
- **Academic Tags**: From GPA + projects + research + patents
- **Faculty Rating**: From student feedback records

### 3. **Real-Time Updates**
When source data changes, ALL dependent views update automatically:
```
Attendance Record Added
  → Student attendance % recalculated
  → Risk level reassessed
  → Dashboard metrics updated
  → Faculty view updated
  → Analytics refreshed
```

### 4. **Data Integrity**
- Cannot delete Stream if Batches exist
- Cannot delete Batch if Students exist
- Cannot delete Subject if Attendance/Assessment records exist
- All relationships enforced through IDs, not text values

---

## 🧮 Calculation Examples

### Student GPA Calculation
```typescript
// Pulls from:
// 1. Student's batch subjects
// 2. Assessment marks for each subject
// 3. Subject credits

calculateOverallGPA(studentId, batchId, marks, assessments, subjects)
  → For each subject in batch:
      → Get student's marks
      → Calculate weighted score
      → Sum (GPA × Credits) / Total Credits
  → Returns: 8.5
```

### Risk Level Calculation
```typescript
calculateRiskLevel(gpa, attendance)
  → If GPA < 6.0 OR attendance < 70%: HIGH
  → If GPA < 7.5 OR attendance < 80%: MEDIUM
  → Otherwise: LOW
```

### Academic Tags Generation
```typescript
generateAcademicTags(studentId, gpa, attendance, projects, papers, patents)
  → GPA >= 8.5 AND attendance >= 90%: "Top Performer"
  → Has research papers: "Research-Oriented"
  → Has 3+ projects: "Project-Focused"
  → Has patents OR innovations: "Innovation-Driven"
  → GPA < 7.0 OR attendance < 75%: "Academically At Risk"
```

---

## 🔐 Access Control Implementation

### Role-Based Data Access
```typescript
// Admin: Full access
const allStudents = data.students;

// Faculty: Only assigned students
const myStudents = data.getFacultyStudents(facultyId);

// Student: Only own data
const myData = data.getStudentById(currentStudentId);
```

---

## 📝 How to Add a New Derived Value

### Example: Add "Study Hours" Metric

#### Step 1: Add to Entity (if needed)
```typescript
// /data/entities.ts
export interface StudyLog {
  id: string;
  studentId: string;
  subjectId: string;
  hours: number;
  date: string;
}
```

#### Step 2: Add Mock Data
```typescript
// /data/mockData.ts
export const studyLogs: StudyLog[] = [
  { id: 'SL001', studentId: 'STU001', subjectId: 'SUB001', hours: 3, date: '2024-12-01' },
  // ...
];
```

#### Step 3: Add Calculation Function
```typescript
// /utils/calculations.ts
export function calculateStudyHours(
  studentId: string,
  studyLogs: StudyLog[]
): number {
  const logs = studyLogs.filter(l => l.studentId === studentId);
  return logs.reduce((sum, log) => sum + log.hours, 0);
}
```

#### Step 4: Add to Data Context
```typescript
// /contexts/DataContext.tsx
interface DataContextType {
  // ... existing
  studyLogs: StudyLog[];
  getStudentStudyHours: (studentId: string) => number;
}

// In provider:
const getStudentStudyHours = (studentId: string) => 
  calculations.calculateStudyHours(studentId, studyLogs);
```

#### Step 5: Use in Components
```typescript
// Any component
const studyHours = data.getStudentStudyHours(studentId);
```

---

## 🚀 Benefits of This Architecture

### ✅ **Single Source of Truth**
- No duplicate data
- No synchronization issues
- Consistent across all pages

### ✅ **Automatic Updates**
- Change data once → reflects everywhere
- No manual refresh needed
- Real-time consistency

### ✅ **Reduced Bugs**
- No hardcoded values
- No manual calculations
- Type-safe with TypeScript

### ✅ **Easy to Extend**
- Add new entity → available everywhere
- Add new calculation → accessible by all
- Add new page → use existing data

### ✅ **Performance**
- Memoized calculations
- Efficient filtering
- No redundant API calls (in production)

---

## 🔄 Event-Based Updates (Future Implementation)

When connected to a real backend:

```typescript
// Event: Student batch changed
onBatchChange(studentId, newBatchId) {
  → Update student.batchId
  → Trigger recalculation:
      ├── Student's subject list
      ├── Faculty assignments
      ├── Attendance records
      ├── Risk level
      └── Dashboard metrics
}

// Event: Marks updated
onMarksUpdated(studentId, assessmentId) {
  → Recalculate GPA
  → Reassess risk level
  → Update academic tags
  → Refresh dashboards
  → Notify faculty
}
```

---

## 📊 Data Consumption Patterns

### Pattern 1: List All with Derived Values
```typescript
const enrichedStudents = data.students.map(student => ({
  ...student,
  attendance: data.getStudentAttendance(student.id),
  gpa: data.getStudentGPA(student.id),
  riskLevel: data.getStudentRiskLevel(student.id),
}));
```

### Pattern 2: Filter by Relationship
```typescript
const csBatches = data.getBatchesByStream('STR001');
const csStudents = data.getStudentsByStream('STR001');
const batchStudents = data.getStudentsByBatch('BAT001');
```

### Pattern 3: Lookup with Cascade
```typescript
const student = data.getStudentById('STU001');
const batch = data.getBatchById(student.batchId);
const stream = data.getStreamById(batch.streamId);
const subjects = data.getSubjectsByBatch(batch.id);
```

---

## 🔍 Debugging & Verification

### Verify Data Integrity
```typescript
// Check all students have valid batches
data.students.forEach(student => {
  const batch = data.getBatchById(student.batchId);
  if (!batch) console.error(`Student ${student.id} has invalid batch`);
});

// Check all batches have valid streams
data.batches.forEach(batch => {
  const stream = data.getStreamById(batch.streamId);
  if (!stream) console.error(`Batch ${batch.id} has invalid stream`);
});
```

### Monitor Derived Values
```typescript
// Log all students with their computed metrics
data.students.forEach(student => {
  console.log({
    id: student.id,
    name: student.name,
    attendance: data.getStudentAttendance(student.id),
    gpa: data.getStudentGPA(student.id),
    riskLevel: data.getStudentRiskLevel(student.id),
    tags: data.getStudentAcademicTags(student.id),
  });
});
```

---

## 🎓 Best Practices

### ✅ DO:
- Always use `useData()` hook to access data
- Reference entities by ID, never by name
- Use lookup functions for relationships
- Let calculations derive values
- Memoize expensive computations

### ❌ DON'T:
- Hardcode dropdown values
- Store derived values in state
- Duplicate data across components
- Calculate values in UI components
- Create independent data models per page

---

## 📚 File Structure

```
/data/
  ├── entities.ts          # TypeScript interfaces (contracts)
  └── mockData.ts          # Single source of truth data

/utils/
  └── calculations.ts      # All derived value computations

/contexts/
  └── DataContext.tsx      # Centralized data access layer

/components/pages/
  ├── StudentManagementTableConnected.tsx  # Example connected component
  ├── StreamsManagement.tsx
  ├── BatchesManagement.tsx
  └── SubjectsManagement.tsx
```

---

## 🔮 Future Enhancements

### Database Integration
Replace `/data/mockData.ts` with API calls:
```typescript
// Instead of:
const students = mockData.students;

// Use:
const { data: students } = await api.get('/students');
```

### Real-Time Sync
Add WebSocket support for live updates:
```typescript
socket.on('student_updated', (student) => {
  // Update context → All components refresh automatically
});
```

### Caching Layer
Add React Query for efficient data management:
```typescript
const { data: students } = useQuery('students', fetchStudents, {
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## ✅ Verification Checklist

- [x] All data stored in `/data/mockData.ts`
- [x] All calculations in `/utils/calculations.ts`
- [x] All access through `DataContext`
- [x] No hardcoded student/stream/batch names
- [x] Filters cascade properly (Stream → Batch → Subject)
- [x] All derived values computed automatically
- [x] Risk levels calculated, not stored
- [x] Academic tags generated on-the-fly
- [x] GPA calculated from marks + credits
- [x] Attendance calculated from records

---

**This architecture ensures the ERP system behaves like a true enterprise platform with consistent, reliable, and interconnected data across all modules.**
