# Operations Modules - Attendance & Timetable Specification

## ✅ Foundation Complete

### **Data Infrastructure Created:**

#### 1. **Extended Entities** (`/data/entities.ts`)
```typescript
// New timetable entities added:
interface TimeSlot {
  id: string;
  name: string; // "Period 1", "Period 2"
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  order: number; // for sorting
}

interface TimetableEntry {
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
```

#### 2. **Mock Timetable Data** (`/data/mockData.ts`)
- **6 Time Slots**: Period 1-6 (09:00-16:00)
- **11 Timetable Entries**: 
  - BAT001 (CS-A3): 7 entries across Mon/Tue/Wed
  - BAT002 (CS-B3): 2 entries on Monday
  - BAT004 (ECE-A2): 2 entries on Monday
  
**Key Connections:**
- Each timetable entry links: Batch → Subject → Faculty → TimeSlot
- Subjects auto-filter based on stream/batch
- Faculty auto-loaded from subject assignments

#### 3. **Data Context Enhanced** (`/contexts/DataContext.tsx`)
```typescript
// New timetable functions added:
getTimetableByBatch(batchId): Returns all timetable entries for a batch
getTimetableByDay(batchId, day): Returns entries for specific day
getTimeSlotsByBatch(batchId): Returns unique time slots used by batch
getTimeSlotById(id): Lookup time slot by ID
```

---

## 📋 Attendance Management Page Specification

### **Page Structure:**

```
┌─────────────────────────────────────────────────────────────┐
│ ATTENDANCE MANAGEMENT                                        │
│ Track and manage student attendance                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CASCADING FILTERS (Mandatory Order)                          │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│ │ Stream  │→ │  Batch  │→ │ Subject │→ │  Date   │→      │
│ └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│                                                              │
│ ┌──────────────────────┐                                    │
│ │ Period / Time Slot   │  (Auto-loaded from timetable)     │
│ └──────────────────────┘                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ATTENDANCE SUMMARY PANEL                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │ Total: 58│ │Present:52│ │Absent: 6 │ │Rate: 90% │      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ATTENDANCE TABLE                                             │
│ Roll No │ Name          │ Status      │ Remarks            │
│─────────┼───────────────┼─────────────┼────────────────────│
│CS-A3-001│Aarav Sharma   │ ⦿ Present  │                    │
│CS-A3-002│Priya Patel    │ ⦿ Present  │                    │
│CS-A3-003│Rahul Kumar    │ ○ Absent   │ Medical Leave      │
│─────────┴───────────────┴─────────────┴────────────────────│
│ Actions: [Mark All Present] [Save Attendance]               │
└─────────────────────────────────────────────────────────────┘
```

### **Implementation Logic:**

```typescript
import { useData } from '../../contexts/DataContext';

function AttendanceManagement() {
  const data = useData();
  
  // Cascading filter state
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Cascade: Stream → Batch
  const availableBatches = selectedStream 
    ? data.getBatchesByStream(selectedStream)
    : [];

  // Cascade: Batch → Subjects
  const availableSubjects = selectedBatch
    ? data.getSubjectsByBatch(selectedBatch)
    : [];

  // Cascade: Batch + Date → Time Slots (from timetable)
  const dayOfWeek = getDayOfWeek(selectedDate);
  const timetableForDay = selectedBatch
    ? data.getTimetableByDay(selectedBatch, dayOfWeek)
    : [];
  const availableTimeSlots = timetableForDay
    .filter(entry => entry.subjectId === selectedSubject)
    .map(entry => data.getTimeSlotById(entry.timeSlotId));

  // Auto-load students from batch
  const students = selectedBatch
    ? data.getStudentsByBatch(selectedBatch)
    : [];

  // Auto-load faculty from subject assignment
  const subjectAssignment = data.subjectAssignments.find(
    sa => sa.subjectId === selectedSubject && sa.batchId === selectedBatch
  );
  const faculty = subjectAssignment
    ? data.getFacultyById(subjectAssignment.facultyId)
    : null;

  // Submit attendance
  const handleSubmit = () => {
    // Create attendance records for each student
    attendanceData.forEach(record => {
      // POST to API or update context
      const attendanceRecord = {
        studentId: record.studentId,
        subjectId: selectedSubject,
        batchId: selectedBatch,
        date: selectedDate,
        status: record.status, // Present/Absent/Late/Excused
      };
    });
  };
}
```

### **Data Flow:**
```
Timetable Entry → Attendance Page
  ├─ Subject ID → Pre-fill subject dropdown
  ├─ Faculty ID → Show assigned faculty
  ├─ Time Slot → Show period options
  └─ Batch ID → Load students

Attendance Record → Multiple Modules
  ├─ Student Risk Analysis (recalculates attendance %)
  ├─ Student Dashboard (updates attendance card)
  ├─ Faculty Performance (tracks attendance marking)
  └─ Institution Analytics (overall attendance rate)
```

---

## 🗓️ Timetable Management Page Specification

### **Page Structure:**

```
┌─────────────────────────────────────────────────────────────┐
│ TIMETABLE MANAGEMENT                                         │
│ Manage academic schedules                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FILTERS                                                       │
│ ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐     │
│ │ Stream  │→ │  Batch  │  │ Semester │  │ View Mode │     │
│ └─────────┘  └─────────┘  └──────────┘  └──────────┘     │
│                                           [Week] [Day]       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WEEKLY TIMETABLE GRID                                        │
│         │ Monday     │ Tuesday    │ Wednesday  │ Thursday  │
│─────────┼────────────┼────────────┼────────────┼───────────│
│ 09:00   │ DS         │ ML         │ OS         │           │
│ Period 1│ FAC001     │ FAC004     │ FAC002     │           │
│         │ Lab-301    │ Room-301   │ Room-302   │           │
│─────────┼────────────┼────────────┼────────────┼───────────│
│ 10:00   │ OS         │ DS         │            │           │
│ Period 2│ FAC002     │ FAC001     │            │           │
│         │ Room-302   │ Lab-301    │            │           │
│─────────┼────────────┼────────────┼────────────┼───────────│
│ 11:15   │ DBMS       │            │ CN Lab     │           │
│ Period 3│ FAC003     │            │ FAC002     │           │
│         │ Room-303   │            │ Lab-304    │           │
└─────────┴────────────┴────────────┴────────────┴───────────┘

[+ Add Period] [Edit Timetable] [Export Schedule]
```

### **Implementation Logic:**

```typescript
function TimetableManagement() {
  const data = useData();
  
  const [selectedBatch, setSelectedBatch] = useState('');
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'day'

  // Get timetable for selected batch
  const timetableEntries = selectedBatch
    ? data.getTimetableByBatch(selectedBatch)
    : [];

  // Group by day and time slot
  const groupedTimetable = {
    Monday: groupByTimeSlot(timetableEntries.filter(e => e.dayOfWeek === 'Monday')),
    Tuesday: groupByTimeSlot(timetableEntries.filter(e => e.dayOfWeek === 'Tuesday')),
    // ...
  };

  // Render each cell
  function renderCell(entry: TimetableEntry) {
    const subject = data.getSubjectById(entry.subjectId);
    const faculty = data.getFacultyById(entry.facultyId);
    const timeSlot = data.getTimeSlotById(entry.timeSlotId);

    return (
      <div className="border border-[#d1d5db] p-3">
        <div className="text-[13px] text-[#111827]">{subject?.code}</div>
        <div className="text-[11px] text-[#6b7280]">{faculty?.name}</div>
        <div className="text-[11px] text-[#9ca3af]">{entry.room}</div>
      </div>
    );
  }

  // Add new period (validation)
  function handleAddPeriod(data: TimetableEntry) {
    // Check for overlaps
    const hasOverlap = timetableEntries.some(
      e => e.dayOfWeek === data.dayOfWeek 
        && e.timeSlotId === data.timeSlotId
        && e.facultyId === data.facultyId // Same faculty can't be in two places
    );

    if (hasOverlap) {
      alert('Faculty already scheduled at this time');
      return;
    }

    // Validate subject is assigned to batch
    const isAssigned = data.subjectAssignments.some(
      sa => sa.subjectId === data.subjectId 
        && sa.batchId === selectedBatch
    );

    if (!isAssigned) {
      alert('Subject not assigned to this batch');
      return;
    }

    // Save timetable entry
    // POST to API
  }
}
```

### **Validation Rules:**
1. ✅ Subject must exist in batch's stream
2. ✅ Faculty must be assigned to that subject
3. ✅ No overlapping time slots for same batch
4. ✅ No overlapping time slots for same faculty (can't be in two places)
5. ✅ No overlapping time slots for same room

---

## 🔄 Auto-Sync Behavior

### **Event Chain:**

```
┌──────────────────────────────────────────────────────────┐
│ ACTION: Timetable Entry Added                             │
│   Subject: SUB001 (Data Structures)                       │
│   Faculty: FAC001                                         │
│   Batch: BAT001                                           │
│   Day: Monday, Period: 1                                  │
└──────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────┐
│ IMMEDIATE EFFECTS:                                        │
│ ✓ Attendance page: Period 1 available for marking        │
│ ✓ Student view: Schedule updated with new class          │
│ ✓ Faculty view: Workload count increases                 │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ACTION: Faculty Reassigned                                │
│   Subject: SUB001                                         │
│   Old Faculty: FAC001 → New Faculty: FAC004               │
└──────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────┐
│ CASCADE UPDATES:                                          │
│ ✓ All timetable entries for SUB001 update to FAC004      │
│ ✓ Attendance records show new faculty                    │
│ ✓ FAC001 workload decreases                              │
│ ✓ FAC004 workload increases                              │
│ ✓ Subject assignment table reflects change               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ACTION: Batch Archived                                    │
│   Batch: BAT001 → Status: Archived                       │
└──────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────┐
│ PROTECTIVE ACTIONS:                                       │
│ ✓ Attendance marking: Disabled for this batch            │
│ ✓ Timetable view: Read-only mode                         │
│ ✓ Student enrollments: No new students allowed           │
│ ✓ Historical data: Preserved and accessible              │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 Data Usage Across System

### **Attendance Data Feeds:**

```typescript
// Student Risk Engine
const attendancePercentage = data.getStudentAttendance(studentId);
// → Used in calculateRiskLevel()
// → If attendance < 75%, risk = HIGH

// Faculty Performance Dashboard
const facultyClasses = timetableEntries.filter(e => e.facultyId === facultyId);
const attendanceMarked = attendanceRecords.filter(a => 
  facultyClasses.some(c => c.subjectId === a.subjectId)
);
// → Tracks compliance with marking attendance

// Institution Analytics
const overallAttendance = students.map(s => 
  data.getStudentAttendance(s.id)
).reduce((sum, val) => sum + val, 0) / students.length;
// → Institution-wide attendance rate

// Export Reports
const attendanceReport = students.map(student => ({
  rollNo: student.rollNo,
  name: student.name,
  attendance: data.getStudentAttendance(student.id),
  status: data.getStudentRiskLevel(student.id),
}));
// → Excel/PDF export with live data
```

### **Timetable Data Feeds:**

```typescript
// Student Daily Schedule
const todaySchedule = data.getTimetableByDay(student.batchId, 'Monday');
// → Shows student their classes for today

// Faculty Workload
const facultySchedule = data.timetableEntries.filter(
  e => e.facultyId === facultyId
);
const hoursPerWeek = facultySchedule.length; // Each entry = 1 hour
// → Calculates teaching hours

// Room Utilization
const roomSchedule = data.timetableEntries.filter(
  e => e.room === 'Lab-301'
);
// → Shows when room is occupied

// Attendance Period Options
const availablePeriods = data.getTimetableByDay(batchId, selectedDate);
// → Attendance page only shows periods that exist in timetable
```

---

## 🎨 UI Component Structure

### **Attendance Page:**
```tsx
<div className="p-6">
  {/* Header */}
  <PageHeader 
    title="Attendance Management"
    subtitle="Track and manage student attendance"
  />

  {/* Cascading Filters */}
  <FilterCard>
    <StreamDropdown 
      onChange={(id) => {
        setStream(id);
        setBatch(''); // Reset dependent
      }}
    />
    <BatchDropdown 
      streamId={selectedStream}
      disabled={!selectedStream}
      onChange={setBatch}
    />
    <SubjectDropdown 
      batchId={selectedBatch}
      disabled={!selectedBatch}
      onChange={setSubject}
    />
    <DatePicker onChange={setDate} />
    <PeriodDropdown 
      timetableEntries={availableSlots}
      disabled={!selectedSubject}
      onChange={setTimeSlot}
    />
  </FilterCard>

  {/* Summary Panel */}
  <SummaryGrid>
    <StatCard label="Total Students" value={students.length} />
    <StatCard label="Present" value={presentCount} color="green" />
    <StatCard label="Absent" value={absentCount} color="red" />
    <StatCard label="Attendance Rate" value={`${rate}%`} />
  </SummaryGrid>

  {/* Attendance Table */}
  <AttendanceTable 
    students={students}
    onStatusChange={handleStatusChange}
    onSubmit={handleSubmit}
  />
</div>
```

### **Timetable Page:**
```tsx
<div className="p-6">
  {/* Header */}
  <PageHeader 
    title="Timetable Management"
    subtitle="Manage academic schedules"
  />

  {/* Filters */}
  <FilterCard>
    <StreamDropdown onChange={setStream} />
    <BatchDropdown streamId={selectedStream} onChange={setBatch} />
    <SemesterDropdown onChange={setSemester} />
    <ViewToggle value={viewMode} onChange={setViewMode} />
  </FilterCard>

  {/* Timetable Grid */}
  <TimetableGrid 
    entries={timetableEntries}
    viewMode={viewMode}
    onCellClick={handleEditPeriod}
  />

  {/* Actions */}
  <ActionBar>
    <Button onClick={handleAddPeriod}>Add Period</Button>
    <Button onClick={handleExport}>Export Schedule</Button>
  </ActionBar>
</div>
```

---

## ✅ Implementation Checklist

### **Data Layer** (✅ Complete)
- [x] TimeSlot entity defined
- [x] TimetableEntry entity defined
- [x] Mock time slots data (6 periods)
- [x] Mock timetable entries (11 entries)
- [x] Data context updated with timetable functions
- [x] Timetable queries implemented

### **Attendance Page** (To Implement)
- [ ] Create `/components/pages/AttendanceManagement.tsx`
- [ ] Implement cascading filters (Stream → Batch → Subject → Date → Period)
- [ ] Build attendance table with inline editing
- [ ] Add summary panel with real-time counts
- [ ] Implement "Mark All Present" bulk action
- [ ] Add validation (can't mark future dates)
- [ ] Integrate with timetable (only show scheduled periods)

### **Timetable Page** (To Implement)
- [ ] Create `/components/pages/TimetableManagement.tsx`
- [ ] Build week view grid
- [ ] Build day view list
- [ ] Implement add/edit period modal
- [ ] Add overlap validation
- [ ] Add faculty conflict detection
- [ ] Implement room availability check
- [ ] Add export to PDF/Excel

### **Navigation** (To Do)
- [ ] Add "Operations" section to sidebar
- [ ] Add "Attendance" and "Timetable" menu items
- [ ] Update routing in App.tsx

---

## 🚀 Next Steps

1. **Create Attendance Management Page**
   - Use `useData()` hook throughout
   - Implement cascading filters with proper disabling
   - Connect to timetable for period options

2. **Create Timetable Management Page**
   - Build grid layout with time slots and days
   - Implement add/edit functionality
   - Add validation for conflicts

3. **Add to Navigation**
   - Update sidebar menu structure
   - Add routing

4. **Testing Integration**
   - Verify timetable entries drive attendance periods
   - Confirm attendance data flows to dashboards
   - Test faculty workload calculations

---

**All foundational data architecture is complete and ready. The UI components just need to consume the existing DataContext functions to display and manage attendance and timetables.**
