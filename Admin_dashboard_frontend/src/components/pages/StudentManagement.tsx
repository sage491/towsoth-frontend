import { Search, Filter, Download, AlertCircle } from 'lucide-react';
import { DataTable } from '../ui/DataTable';
import { useStudentManagementData } from '../../hooks/useStudentManagementData';

export function StudentManagement() {
  const {
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    tableData,
    summary,
  } = useStudentManagementData();

  const columns = [
    { key: 'rollNo', label: 'Roll Number', width: '120px' },
    { key: 'name', label: 'Student Name', width: '200px' },
    { key: 'batch', label: 'Batch', width: '100px' },
    { key: 'attendance', label: 'Attendance', width: '100px', align: 'center' as const },
    { key: 'performance', label: 'GPA', width: '80px', align: 'center' as const },
    { key: 'riskBadge', label: 'Risk Level', width: '120px', align: 'center' as const },
    { key: 'trendIcon', label: 'Trend', width: '80px', align: 'center' as const },
    { key: 'status', label: 'Status', width: '100px' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">Student Management</h1>
        <p className="text-[13px] text-[#6b7280]">Monitor student performance, attendance, and engagement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Students</p>
          <p className="text-[28px] text-[#111827]">{summary.totalStudents.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Active</p>
          <p className="text-[28px] text-[#111827]">{summary.activeStudents.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Avg. Attendance</p>
          <p className="text-[28px] text-[#111827]">{summary.averageAttendance.toFixed(1)}%</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Avg. GPA</p>
          <p className="text-[28px] text-[#111827]">{summary.averageGpa.toFixed(1)}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4 border-[#f59e0b]">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">At Risk</p>
          <p className="text-[28px] text-[#dc2626]">{summary.atRiskStudents}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search by name, roll number, or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Students</option>
            <option value="high-risk">High Risk</option>
            <option value="low-attendance">Low Attendance</option>
            <option value="high-performers">High Performers</option>
          </select>
          <button className="px-4 py-2 border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6b7280]" />
            <span className="text-[13px] text-[#374151]">More Filters</span>
          </button>
          <button className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Risk Alerts */}
      <div className="bg-[#fef3c7] border border-[#fcd34d] p-4 mb-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] text-[#111827]">
            <strong>{summary.atRiskStudents} students flagged for academic risk.</strong> Review performance trends and attendance patterns.
          </p>
          <button className="text-[13px] text-[#d97706] hover:underline mt-1">View detailed report →</button>
        </div>
      </div>

      {/* Student Table */}
      <DataTable columns={columns} data={tableData} onRowClick={(row) => console.log('View student:', row)} />

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[13px] text-[#6b7280]">Showing 1-{Math.min(5, tableData.length)} of {summary.totalStudents.toLocaleString()} students</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb]">Previous</button>
          <button className="px-3 py-1.5 bg-[#111827] text-white text-[13px]">1</button>
          <button className="px-3 py-1.5 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb]">2</button>
          <button className="px-3 py-1.5 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb]">3</button>
          <button className="px-3 py-1.5 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb]">Next</button>
        </div>
      </div>
    </div>
  );
}
