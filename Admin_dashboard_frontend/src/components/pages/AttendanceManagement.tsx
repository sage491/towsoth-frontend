import { useAttendanceManagementData } from '../../hooks/useAttendanceManagementData';
import { Calendar, Users, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export function AttendanceManagement() {
  const {
    selectedStream,
    selectedBatch,
    selectedSubject,
    setSelectedSubject,
    handleStreamChange,
    handleBatchChange,
    availableBatches,
    availableSubjects,
    studentAttendanceData,
    batchSummary,
    selectedStreamData,
    selectedBatchData,
    selectedSubjectData,
    streams,
  } = useAttendanceManagementData();

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">Attendance Management</h1>
        <p className="text-[13px] text-[#6b7280]">View and analyze student attendance records</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#d1d5db] p-5 mb-6">
        <h2 className="text-[15px] text-[#111827] mb-4">Filter Attendance Records</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Stream Selector */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Academic Stream
            </label>
            <select
              value={selectedStream}
              onChange={(e) => handleStreamChange(e.target.value)}
              className="w-full px-3 py-2 border border-[#d1d5db] text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827]"
            >
              <option value="">Select Stream</option>
              {streams.map(stream => (
                <option key={stream.id} value={stream.id}>
                  {stream.name}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Selector */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Batch (Required)
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => handleBatchChange(e.target.value)}
              disabled={!selectedStream}
              className="w-full px-3 py-2 border border-[#d1d5db] text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af] disabled:cursor-not-allowed"
            >
              <option value="">Select Batch</option>
              {availableBatches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector (Optional) */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Subject (Optional)
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedBatch}
              className="w-full px-3 py-2 border border-[#d1d5db] text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af] disabled:cursor-not-allowed"
            >
              <option value="">All Subjects</option>
              {availableSubjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selection Info Display */}
        {selectedBatch && (
          <div className="mt-4 p-3 bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="flex items-center gap-6 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Stream:</span>
                <span className="text-[#111827]">{selectedStreamData?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Batch:</span>
                <span className="text-[#111827]">{selectedBatchData?.name}</span>
              </div>
              {selectedSubject && (
                <div className="flex items-center gap-2">
                  <span className="text-[#6b7280]">Subject:</span>
                  <span className="text-[#111827]">{selectedSubjectData?.code} - {selectedSubjectData?.name}</span>
                </div>
              )}
              {!selectedSubject && (
                <div className="flex items-center gap-2">
                  <span className="text-[#6b7280]">Showing:</span>
                  <span className="text-[#111827]">Overall Attendance</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      {selectedBatch && (
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white border border-[#d1d5db] p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#6b7280]" />
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider">Total Students</p>
            </div>
            <p className="text-[28px] text-[#111827]">{batchSummary.totalStudents}</p>
          </div>

          <div className="bg-white border border-[#d1d5db] p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-[#6b7280]" />
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider">Avg Attendance</p>
            </div>
            <p className="text-[28px] text-[#111827]">{batchSummary.avgAttendance}%</p>
          </div>

          <div className="bg-white border border-[#d1d5db] p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-[#059669]" />
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider">Excellent (≥95%)</p>
            </div>
            <p className="text-[28px] text-[#059669]">{batchSummary.excellent}</p>
          </div>

          <div className="bg-white border border-[#d1d5db] p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-[#3b82f6]" />
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider">Good (≥85%)</p>
            </div>
            <p className="text-[28px] text-[#3b82f6]">{batchSummary.good}</p>
          </div>

          <div className="bg-white border border-[#d1d5db] p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-[#d97706]" />
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider">Warning (≥75%)</p>
            </div>
            <p className="text-[28px] text-[#d97706]">{batchSummary.warning}</p>
          </div>

          <div className="bg-white border border-[#d1d5db] p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#dc2626]" />
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider">Critical (&lt;75%)</p>
            </div>
            <p className="text-[28px] text-[#dc2626]">{batchSummary.critical}</p>
          </div>
        </div>
      )}

      {/* Student Attendance Table */}
      {selectedBatch && (
        <div className="bg-white border border-[#d1d5db]">
          <div className="px-5 py-4 border-b border-[#d1d5db]">
            <h2 className="text-[15px] text-[#111827]">
              Student Attendance Records
              {selectedSubject && (
                <span className="text-[13px] text-[#6b7280] ml-2">
                  ({selectedSubjectData?.code})
                </span>
              )}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '11%' }} />
              </colgroup>
              <thead className="bg-[#f9fafb] border-b border-[#d1d5db]">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Present
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Absent
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Late
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Excused
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentAttendanceData.map((record) => (
                  <tr key={record.student.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors">
                    {/* Roll Number */}
                    <td className="px-5 py-4 align-middle">
                      <span className="text-[13px] text-[#6b7280] whitespace-nowrap">
                        {record.student.rollNo}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="px-5 py-4 align-middle">
                      <span className="text-[13px] text-[#111827]">
                        {record.student.name}
                      </span>
                    </td>

                    {/* Attendance Percentage */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span className={`text-[15px] ${
                          record.attendancePercentage >= 95 ? 'text-[#059669]' :
                          record.attendancePercentage >= 85 ? 'text-[#3b82f6]' :
                          record.attendancePercentage >= 75 ? 'text-[#d97706]' :
                          'text-[#dc2626]'
                        }`}>
                          {record.attendancePercentage}%
                        </span>
                      </div>
                    </td>

                    {/* Total Classes */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span className="text-[13px] text-[#111827]">
                          {record.totalClasses}
                        </span>
                      </div>
                    </td>

                    {/* Present Count */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span className="text-[13px] text-[#059669]">
                          {record.presentCount}
                        </span>
                      </div>
                    </td>

                    {/* Absent Count */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span className="text-[13px] text-[#dc2626]">
                          {record.absentCount}
                        </span>
                      </div>
                    </td>

                    {/* Late Count */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span className="text-[13px] text-[#d97706]">
                          {record.lateCount}
                        </span>
                      </div>
                    </td>

                    {/* Excused Count */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span className="text-[13px] text-[#6b7280]">
                          {record.excusedCount}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span className={`inline-block px-2.5 py-1 text-[11px] border whitespace-nowrap ${
                          record.status === 'Excellent'
                            ? 'bg-[#d1fae5] border-[#86efac] text-[#059669]'
                            : record.status === 'Good'
                            ? 'bg-[#dbeafe] border-[#93c5fd] text-[#3b82f6]'
                            : record.status === 'Warning'
                            ? 'bg-[#fef3c7] border-[#fcd34d] text-[#d97706]'
                            : 'bg-[#fee2e2] border-[#fca5a5] text-[#dc2626]'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedBatch && (
        <div className="bg-white border border-[#d1d5db] p-12 text-center">
          <Calendar className="w-12 h-12 text-[#d1d5db] mx-auto mb-4" />
          <h3 className="text-[15px] text-[#111827] mb-2">Select a Batch to View Attendance</h3>
          <p className="text-[13px] text-[#6b7280] max-w-md mx-auto">
            Choose a stream and batch to view attendance records for all students. 
            Optionally filter by subject to see subject-specific attendance.
          </p>
        </div>
      )}
    </div>
  );
}