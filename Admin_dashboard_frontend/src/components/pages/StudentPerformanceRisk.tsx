import { useState } from 'react';
import { Search, X, GraduationCap, ArrowLeft, AlertTriangle, TrendingUp, TrendingDown, Calendar, Award, BookOpen, Target, Bell, FileText, MessageSquare } from 'lucide-react';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  batch: string;
  program: string;
  department: string;
  attendance: number;
  gpa: number;
  assessmentCompletion: number;
  engagementScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskReasons: string[];
  email: string;
  phone: string;
}

export function StudentPerformanceRisk() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');

  // Mock student data
  const allStudents: Student[] = [
    {
      id: 'STU001',
      rollNo: 'CS-A3-001',
      name: 'Aarav Sharma',
      batch: 'CS-A3',
      program: 'B.Tech Computer Science',
      department: 'Computer Science',
      attendance: 92.5,
      gpa: 8.5,
      assessmentCompletion: 95.0,
      engagementScore: 88.0,
      riskLevel: 'Low',
      riskReasons: [],
      email: 'aarav.sharma@university.edu',
      phone: '+91 98765 43210',
    },
    {
      id: 'STU003',
      rollNo: 'CS-A3-003',
      name: 'Rahul Kumar',
      batch: 'CS-A3',
      program: 'B.Tech Computer Science',
      department: 'Computer Science',
      attendance: 65.3,
      gpa: 6.1,
      assessmentCompletion: 72.0,
      engagementScore: 58.0,
      riskLevel: 'High',
      riskReasons: ['Low attendance (<75%)', 'GPA below 7.0', 'Missed 3 consecutive assessments', 'Low engagement score'],
      email: 'rahul.kumar@university.edu',
      phone: '+91 98765 43212',
    },
    {
      id: 'STU005',
      rollNo: 'ECE-A2-042',
      name: 'Arjun Singh',
      batch: 'ECE-A2',
      program: 'B.Tech Electronics',
      department: 'Electronics',
      attendance: 78.4,
      gpa: 7.3,
      assessmentCompletion: 85.0,
      engagementScore: 75.0,
      riskLevel: 'Medium',
      riskReasons: ['Attendance slightly below target', 'GPA trending downward'],
      email: 'arjun.singh@university.edu',
      phone: '+91 98765 43214',
    },
    {
      id: 'STU007',
      rollNo: 'ME-A1-025',
      name: 'Karthik Iyer',
      batch: 'ME-A1',
      program: 'B.Tech Mechanical',
      department: 'Mechanical',
      attendance: 72.8,
      gpa: 6.8,
      assessmentCompletion: 78.0,
      engagementScore: 65.0,
      riskLevel: 'Medium',
      riskReasons: ['Low attendance (<75%)', 'GPA below 7.0', 'Declining engagement'],
      email: 'karthik.iyer@university.edu',
      phone: '+91 98765 43216',
    },
    {
      id: 'STU004',
      rollNo: 'CS-B3-015',
      name: 'Sneha Reddy',
      batch: 'CS-B3',
      program: 'B.Tech Computer Science',
      department: 'Computer Science',
      attendance: 94.7,
      gpa: 9.1,
      assessmentCompletion: 98.0,
      engagementScore: 92.0,
      riskLevel: 'Low',
      riskReasons: [],
      email: 'sneha.reddy@university.edu',
      phone: '+91 98765 43213',
    },
    {
      id: 'STU006',
      rollNo: 'ECE-A2-043',
      name: 'Divya Menon',
      batch: 'ECE-A2',
      program: 'B.Tech Electronics',
      department: 'Electronics',
      attendance: 91.2,
      gpa: 8.7,
      assessmentCompletion: 96.0,
      engagementScore: 89.0,
      riskLevel: 'Low',
      riskReasons: [],
      email: 'divya.menon@university.edu',
      phone: '+91 98765 43215',
    },
  ];

  const batches = ['All', 'CS-A3', 'CS-B3', 'ECE-A2', 'ECE-B2', 'ME-A1', 'ME-B1'];

  // Filter students
  const filteredStudents = allStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch;
    const matchesRisk = selectedRisk === 'all' || student.riskLevel === selectedRisk;

    return matchesSearch && matchesBatch && matchesRisk;
  });

  // Mock performance trend data
  const performanceTrend = [
    { month: 'Aug', gpa: 7.2, attendance: 82 },
    { month: 'Sep', gpa: 6.8, attendance: 75 },
    { month: 'Oct', gpa: 6.5, attendance: 68 },
    { month: 'Nov', gpa: 6.1, attendance: 65 },
  ];

  if (selectedStudent) {
    return (
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedStudent(null)}
          className="flex items-center gap-2 text-[13px] text-[#6b7280] hover:text-[#111827] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Student List
        </button>

        {/* Student Profile Header */}
        <div className="bg-white border border-[#d1d5db] p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-[#e5e7eb] rounded-full flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-10 h-10 text-[#6b7280]" />
            </div>
            <div className="flex-1">
              <h1 className="text-[20px] text-[#111827] mb-1">{selectedStudent.name}</h1>
              <p className="text-[13px] text-[#6b7280] mb-3">
                {selectedStudent.rollNo} • {selectedStudent.program}
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">Batch</p>
                  <p className="text-[13px] text-[#111827]">{selectedStudent.batch}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">Email</p>
                  <p className="text-[13px] text-[#111827]">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-[13px] text-[#111827]">{selectedStudent.phone}</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div
                className={`px-4 py-2 border ${
                  selectedStudent.riskLevel === 'High'
                    ? 'bg-[#fee2e2] border-[#fca5a5] text-[#dc2626]'
                    : selectedStudent.riskLevel === 'Medium'
                    ? 'bg-[#fef3c7] border-[#fcd34d] text-[#d97706]'
                    : 'bg-[#d1fae5] border-[#86efac] text-[#059669]'
                }`}
              >
                <p className="text-[11px] uppercase tracking-wider mb-1">Risk Level</p>
                <p className="text-[18px]">{selectedStudent.riskLevel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-[#d1d5db] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#f3f4f6] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#374151]" />
              </div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-wider">Attendance</div>
            </div>
            <div className="text-[32px] text-[#111827] leading-none mb-1">
              {selectedStudent.attendance.toFixed(1)}%
            </div>
            <div className={`text-[12px] ${
              selectedStudent.attendance >= 85 ? 'text-[#059669]' : 'text-[#dc2626]'
            }`}>
              Target: 85%
            </div>
          </div>

          <div className="bg-white border border-[#d1d5db] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#f3f4f6] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#374151]" />
              </div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-wider">GPA</div>
            </div>
            <div className="text-[32px] text-[#111827] leading-none mb-1">
              {selectedStudent.gpa.toFixed(1)}
            </div>
            <div className={`text-[12px] ${
              selectedStudent.gpa >= 7.5 ? 'text-[#059669]' : 'text-[#dc2626]'
            }`}>
              Target: 7.5
            </div>
          </div>

          <div className="bg-white border border-[#d1d5db] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#f3f4f6] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#374151]" />
              </div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-wider">Assessment Completion</div>
            </div>
            <div className="text-[32px] text-[#111827] leading-none mb-1">
              {selectedStudent.assessmentCompletion.toFixed(0)}%
            </div>
            <div className={`text-[12px] ${
              selectedStudent.assessmentCompletion >= 90 ? 'text-[#059669]' : 'text-[#dc2626]'
            }`}>
              Target: 90%
            </div>
          </div>

          <div className="bg-white border border-[#d1d5db] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#f3f4f6] flex items-center justify-center">
                <Target className="w-5 h-5 text-[#374151]" />
              </div>
              <div className="text-[11px] text-[#6b7280] uppercase tracking-wider">Engagement Score</div>
            </div>
            <div className="text-[32px] text-[#111827] leading-none mb-1">
              {selectedStudent.engagementScore.toFixed(0)}%
            </div>
            <div className={`text-[12px] ${
              selectedStudent.engagementScore >= 80 ? 'text-[#059669]' : 'text-[#dc2626]'
            }`}>
              Target: 80%
            </div>
          </div>
        </div>

        {/* Risk Analysis & Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Risk Analysis */}
          <div className="bg-white border border-[#d1d5db] p-6">
            <h2 className="text-[15px] text-[#111827] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#d97706]" />
              Risk Analysis
            </h2>
            {selectedStudent.riskReasons.length > 0 ? (
              <div className="space-y-3">
                {selectedStudent.riskReasons.map((reason, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#dc2626] rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-[13px] text-[#374151]">{reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-[#d1fae5] rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-[#059669]" />
                </div>
                <p className="text-[13px] text-[#6b7280]">No risk factors identified</p>
                <p className="text-[12px] text-[#9ca3af] mt-1">Student performance is on track</p>
              </div>
            )}
          </div>

          {/* Performance Trend */}
          <div className="bg-white border border-[#d1d5db] p-6">
            <h2 className="text-[15px] text-[#111827] mb-4">Performance Trend (Last 4 Months)</h2>
            <div className="space-y-4">
              {performanceTrend.map((month, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-[#6b7280]">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] text-[#374151]">GPA: {month.gpa}</span>
                      <span className="text-[12px] text-[#374151]">Att: {month.attendance}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        month.attendance >= 85 ? 'bg-[#059669]' : month.attendance >= 75 ? 'bg-[#d97706]' : 'bg-[#dc2626]'
                      }`}
                      style={{ width: `${month.attendance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="px-4 py-3 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2 justify-center">
              <AlertTriangle className="w-4 h-4" />
              {selectedStudent.riskLevel === 'Low' ? 'Flag as At Risk' : 'Remove Risk Flag'}
            </button>
            <button className="px-4 py-3 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2 justify-center">
              <Bell className="w-4 h-4" />
              Notify Faculty
            </button>
            <button className="px-4 py-3 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2 justify-center">
              <MessageSquare className="w-4 h-4" />
              Notify Parent
            </button>
            <button className="px-4 py-3 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2 justify-center">
              <FileText className="w-4 h-4" />
              Add Internal Note
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">Student Performance & Risk</h1>
        <p className="text-[13px] text-[#6b7280]">
          Monitor individual student performance and identify at-risk students
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          />
        </div>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151] min-w-[150px]"
        >
          <option value="all">All Batches</option>
          {batches.filter(b => b !== 'All').map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151] min-w-[150px]"
        >
          <option value="all">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-[13px] text-[#6b7280]">
          Showing {filteredStudents.length} of {allStudents.length} students
        </p>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => setSelectedStudent(student)}
            className="bg-white border border-[#d1d5db] p-5 hover:border-[#9ca3af] transition-colors cursor-pointer h-full flex flex-col overflow-hidden box-border"
          >
            {/* Student Header */}
            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-[#e5e7eb]">
              <div className="w-14 h-14 bg-[#e5e7eb] rounded-full flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-7 h-7 text-[#6b7280]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] text-[#111827] mb-1 truncate">{student.name}</h3>
                <p className="text-[12px] text-[#6b7280] truncate">{student.rollNo}</p>
                <p className="text-[11px] text-[#9ca3af] truncate">{student.batch}</p>
              </div>
              <div
                className={`px-2 py-1 text-[11px] border flex-shrink-0 ${
                  student.riskLevel === 'High'
                    ? 'bg-[#fee2e2] border-[#fca5a5] text-[#dc2626]'
                    : student.riskLevel === 'Medium'
                    ? 'bg-[#fef3c7] border-[#fcd34d] text-[#d97706]'
                    : 'bg-[#d1fae5] border-[#86efac] text-[#059669]'
                }`}
              >
                {student.riskLevel}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Attendance</span>
                <span className={`text-[15px] flex-shrink-0 ${
                  student.attendance >= 85 ? 'text-[#059669]' : student.attendance >= 75 ? 'text-[#d97706]' : 'text-[#dc2626]'
                }`}>
                  {student.attendance.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#6b7280] flex-shrink truncate">GPA</span>
                <span className={`text-[15px] flex-shrink-0 ${
                  student.gpa >= 8.0 ? 'text-[#059669]' : student.gpa >= 7.0 ? 'text-[#d97706]' : 'text-[#dc2626]'
                }`}>
                  {student.gpa.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Assessment Completion</span>
                <span className={`text-[15px] flex-shrink-0 ${
                  student.assessmentCompletion >= 90 ? 'text-[#059669]' : student.assessmentCompletion >= 80 ? 'text-[#d97706]' : 'text-[#dc2626]'
                }`}>
                  {student.assessmentCompletion.toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Engagement Score</span>
                <span className={`text-[15px] flex-shrink-0 ${
                  student.engagementScore >= 80 ? 'text-[#059669]' : student.engagementScore >= 70 ? 'text-[#d97706]' : 'text-[#dc2626]'
                }`}>
                  {student.engagementScore.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
