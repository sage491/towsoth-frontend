import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { DataTable } from '../ui/DataTable';
import { AddFacultyModal } from '../modals/AddFacultyModal';
import { useFacultyManagementData } from '../../hooks/useFacultyManagementData';

export function FacultyManagement() {
  const [isAddFacultyModalOpen, setIsAddFacultyModalOpen] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    filteredRows,
    stats,
    subjectDistribution,
    loadDistribution,
  } = useFacultyManagementData();

  const columns = [
    { key: 'empId', label: 'Employee ID', width: '120px' },
    { key: 'name', label: 'Faculty Name', width: '200px' },
    { key: 'department', label: 'Department', width: '150px' },
    { key: 'subjects', label: 'Subjects', width: '250px' },
    { key: 'batches', label: 'Batches', width: '80px', align: 'center' as const },
    { key: 'load', label: 'Teaching Load', width: '120px', align: 'center' as const },
    { key: 'status', label: 'Status', width: '100px' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] text-[#111827] mb-1">Faculty Management</h1>
          <p className="text-[13px] text-[#6b7280]">Manage faculty profiles, assignments, and performance</p>
        </div>
        <button
          className="px-4 py-2 bg-[#111827] text-white text-[13px] font-normal hover:bg-[#374151] hover:font-semibold transition-all flex items-center gap-2"
          onClick={() => setIsAddFacultyModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Faculty
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Faculty</p>
          <p className="text-[28px] text-[#111827]">{stats.totalFaculty}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Faculty Present</p>
          <p className="text-[28px] text-[#111827]">{stats.totalPresent}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Faculty Absent</p>
          <p className="text-[28px] text-[#111827]">{stats.totalAbsent}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Avg. Load</p>
          <p className="text-[28px] text-[#111827]">{stats.averageLoadHours.toFixed(1)}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">hrs/week</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search by name, employee ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(event) => setSelectedDepartment(event.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department === 'all' ? 'All Departments' : department}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Table */}
      <DataTable columns={columns} data={filteredRows} onRowClick={(row) => console.log('View faculty:', row)} />

      {/* Faculty Details Panel */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">Subject Distribution</h2>
          <div className="space-y-3">
            {subjectDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-[#e5e7eb]">
                <span className="text-[13px] text-[#374151]">{item.subject}</span>
                <div className="flex items-center gap-6">
                  <span className="text-[12px] text-[#6b7280]">{item.faculty} faculty</span>
                  <span className="text-[12px] text-[#6b7280]">{item.batches} batches</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">Teaching Load Distribution</h2>
          <div className="space-y-4">
            {loadDistribution.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] text-[#6b7280]">{item.label}</span>
                  <span className="text-[12px] text-[#6b7280]">{item.count}</span>
                </div>
                <div className="h-2 bg-[#e5e7eb]">
                  <div className={`h-full ${item.colorClass}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[13px] text-[#6b7280]">Showing 1-{Math.min(filteredRows.length, 10)} of {stats.totalFaculty} faculty</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb]">Previous</button>
          <button className="px-3 py-1.5 bg-[#111827] text-white text-[13px]">1</button>
          <button className="px-3 py-1.5 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb]">2</button>
          <button className="px-3 py-1.5 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb]">Next</button>
        </div>
      </div>

      {/* Add Faculty Modal */}
      <AddFacultyModal
        isOpen={isAddFacultyModalOpen}
        onClose={() => setIsAddFacultyModalOpen(false)}
      />
    </div>
  );
}