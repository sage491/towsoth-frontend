import { useState } from 'react';
import { Search, Download, Plus, MoreVertical, GraduationCap, TrendingUp, TrendingDown, Circle, SlidersHorizontal, ChevronDown, Settings } from 'lucide-react';
import { AddStudentModal } from '../modals/AddStudentModal';
import { AddStudentWithJoiningLink } from '../students/AddStudentWithJoiningLink';
import { useStudentManagementTableData } from '../../hooks/useStudentManagementTableData';

export function StudentManagementTableConnected() {
  const {
    data,
    searchTerm,
    setSearchTerm,
    selectedBatch,
    setSelectedBatch,
    selectedStream,
    setSelectedStream,
    selectedRisk,
    setSelectedRisk,
    selectedStatus,
    setSelectedStatus,
    showMoreFilters,
    setShowMoreFilters,
    percentageRange,
    setPercentageRange,
    selectedTags,
    showColumnSettings,
    setShowColumnSettings,
    visibleColumns,
    filteredStudents,
    availableBatches,
    atRiskCount,
    resetFilters,
    activeFiltersCount,
    toggleTag,
    toggleColumn,
    enrichedStudents,
  } = useStudentManagementTableData();

  // Modal state
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddStudentWithLinkOpen, setIsAddStudentWithLinkOpen] = useState(false);

  const getTagColor = (tag: string): string => {
    switch (tag) {
      case 'Top Performer':
        return 'bg-[#dbeafe] text-[#1e40af] border-[#93c5fd]';
      case 'Research-Oriented':
        return 'bg-[#e0e7ff] text-[#4338ca] border-[#a5b4fc]';
      case 'Project-Focused':
        return 'bg-[#d1fae5] text-[#065f46] border-[#86efac]';
      case 'Innovation-Driven':
        return 'bg-[#fef3c7] text-[#92400e] border-[#fcd34d]';
      case 'Academically At Risk':
        return 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]';
      case 'Balanced Performer':
        return 'bg-[#e5e7eb] text-[#374151] border-[#d1d5db]';
      default:
        return 'bg-[#f3f4f6] text-[#6b7280] border-[#d1d5db]';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[20px] text-[#111827] mb-1">Student Management</h1>
            <p className="text-[13px] text-[#6b7280]">
              All data computed from central academic structure • Real-time calculations
            </p>
          </div>
          <button
            className="px-4 py-2 bg-[#111827] text-white text-[13px] font-normal hover:bg-[#374151] hover:font-semibold transition-all flex items-center gap-2"
            onClick={() => setIsAddStudentWithLinkOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add New Student
          </button>
        </div>
      </div>

      {/* Risk Alert Banner */}
      {atRiskCount > 0 && (
        <div className="bg-[#fef3c7] border border-[#fcd34d] p-4 mb-6 flex items-start gap-3">
          <div className="w-5 h-5 bg-[#d97706] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[11px]">!</span>
          </div>
          <div className="flex-1">
            <p className="text-[13px] text-[#111827] mb-1">
              <strong>{atRiskCount} students flagged for academic risk.</strong> Auto-detected based on GPA and attendance thresholds.
            </p>
            <button className="text-[13px] text-[#d97706] hover:underline">
              View detailed report →
            </button>
          </div>
        </div>
      )}

      {/* Basic Filters */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
            />
          </div>

          <select
            value={selectedStream}
            onChange={(e) => {
              setSelectedStream(e.target.value);
              setSelectedBatch('all'); // Reset batch when stream changes
            }}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Streams</option>
            {data.streams.filter(s => s.status === 'Active').map((stream) => (
              <option key={stream.id} value={stream.id}>
                {stream.code}
              </option>
            ))}
          </select>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
            disabled={selectedStream === 'all'}
          >
            <option value="all">All Batches</option>
            {availableBatches.filter(b => b.status === 'Active').map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-[13px] text-[#6b7280]">
              Showing {filteredStudents.length} of {enrichedStudents.length} students
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[13px] text-[#6b7280] hover:text-[#111827] underline"
              >
                Reset all filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Columns
              </button>
              {showColumnSettings && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-[#d1d5db] shadow-lg z-10 w-56">
                  <div className="p-3">
                    <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Toggle Columns</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.percentage}
                          onChange={() => toggleColumn('percentage')}
                          className="w-4 h-4"
                        />
                        Marks %
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.projectsCount}
                          onChange={() => toggleColumn('projectsCount')}
                          className="w-4 h-4"
                        />
                        Projects Count
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.researchPapersCount}
                          onChange={() => toggleColumn('researchPapersCount')}
                          className="w-4 h-4"
                        />
                        Research Papers
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.patentsCount}
                          onChange={() => toggleColumn('patentsCount')}
                          className="w-4 h-4"
                        />
                        Patents Count
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.academicTags}
                          onChange={() => toggleColumn('academicTags')}
                          className="w-4 h-4"
                        />
                        Academic Tags
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              More Filters
              {activeFiltersCount > 0 && (
                <span className="bg-[#111827] text-white text-[11px] px-1.5 py-0.5 rounded">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} />
            </button>
            <button className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showMoreFilters && (
        <div className="bg-white border border-[#d1d5db] p-6 mb-4">
          <h3 className="text-[14px] text-[#111827] mb-4">Advanced Academic Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[12px] text-[#374151] mb-2 block uppercase tracking-wider">
                Marks / Performance Range
              </label>
              <select
                value={percentageRange}
                onChange={(e) => setPercentageRange(e.target.value)}
                className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
              >
                <option value="all">All Ranges</option>
                <option value="90+">90% and above (Excellent)</option>
                <option value="75-90">75% - 90% (Good)</option>
                <option value="60-75">60% - 75% (Average)</option>
                <option value="40-60">40% - 60% (Needs Improvement)</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] text-[#374151] mb-2 block uppercase tracking-wider">
                Academic Classification Tags
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Top Performer', 'Research-Oriented', 'Project-Focused', 'Innovation-Driven', 'Academically At Risk', 'Balanced Performer'].map((tag) => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="w-4 h-4"
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Table */}
      <div className="bg-white border border-[#d1d5db]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Roll Number
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Student Name
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Batch
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Attendance
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  GPA
                </th>
                {visibleColumns.percentage && (
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Marks %
                  </th>
                )}
                {visibleColumns.projectsCount && (
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Projects
                  </th>
                )}
                {visibleColumns.researchPapersCount && (
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Research
                  </th>
                )}
                {visibleColumns.patentsCount && (
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Patents
                  </th>
                )}
                {visibleColumns.academicTags && (
                  <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Academic Tags
                  </th>
                )}
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Risk Level
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Trend
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{student.rollNo}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#e5e7eb] rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-[#6b7280]" />
                      </div>
                      <div>
                        <div className="text-[13px] text-[#111827]">{student.name}</div>
                        <div className="text-[11px] text-[#9ca3af]">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{student.batchName}</td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`text-[13px] ${
                        student.attendance >= 85
                          ? 'text-[#059669]'
                          : student.attendance >= 75
                          ? 'text-[#d97706]'
                          : 'text-[#dc2626]'
                      }`}
                    >
                      {student.attendance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`text-[13px] ${
                        student.gpa >= 8.0
                          ? 'text-[#059669]'
                          : student.gpa >= 7.0
                          ? 'text-[#d97706]'
                          : 'text-[#dc2626]'
                      }`}
                    >
                      {student.gpa.toFixed(1)}
                    </span>
                  </td>
                  {visibleColumns.percentage && (
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`text-[13px] ${
                          student.percentage >= 90
                            ? 'text-[#059669]'
                            : student.percentage >= 75
                            ? 'text-[#2563eb]'
                            : student.percentage >= 60
                            ? 'text-[#d97706]'
                            : 'text-[#dc2626]'
                        }`}
                      >
                        {student.percentage.toFixed(1)}%
                      </span>
                    </td>
                  )}
                  {visibleColumns.projectsCount && (
                    <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                      {student.projectsCount}
                    </td>
                  )}
                  {visibleColumns.researchPapersCount && (
                    <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                      {student.researchPapersCount}
                    </td>
                  )}
                  {visibleColumns.patentsCount && (
                    <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                      {student.patentsCount}
                    </td>
                  )}
                  {visibleColumns.academicTags && (
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.academicTags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className={`inline-block px-2 py-0.5 text-[10px] border ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {student.academicTags.length > 2 && (
                          <span className="inline-block px-2 py-0.5 text-[10px] text-[#6b7280]">
                            +{student.academicTags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-block px-2 py-1 text-[11px] border ${
                        student.riskLevel === 'High'
                          ? 'bg-[#fee2e2] border-[#fca5a5] text-[#dc2626]'
                          : student.riskLevel === 'Medium'
                          ? 'bg-[#fef3c7] border-[#fcd34d] text-[#d97706]'
                          : 'bg-[#d1fae5] border-[#86efac] text-[#059669]'
                      }`}
                    >
                      {student.riskLevel}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      {student.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-[#059669]" />
                      ) : student.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-[#dc2626]" />
                      ) : (
                        <div className="w-1 h-1 bg-[#6b7280] rounded-full" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Circle
                        className={`w-2 h-2 ${
                          student.status === 'Active' ? 'fill-[#059669] text-[#059669]' : 'fill-[#dc2626] text-[#dc2626]'
                        }`}
                      />
                      <span className="text-[13px] text-[#374151]">{student.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button className="text-[#6b7280] hover:text-[#111827]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      />
      <AddStudentWithJoiningLink
        isOpen={isAddStudentWithLinkOpen}
        onClose={() => setIsAddStudentWithLinkOpen(false)}
      />
    </div>
  );
}