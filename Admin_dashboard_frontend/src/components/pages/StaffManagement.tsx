import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical, Users, Circle } from 'lucide-react';
import { useStaffManagementData } from '../../hooks/useStaffManagementData';

export function StaffManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const {
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    selectedRole,
    setSelectedRole,
    selectedEmploymentType,
    setSelectedEmploymentType,
    selectedStatus,
    setSelectedStatus,
    allStaff,
    filteredStaff,
    departments,
    roles,
  } = useStaffManagementData();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[20px] text-[#111827] mb-1">Staff Management</h1>
            <p className="text-[13px] text-[#6b7280]">
              Manage administrative and operational staff members
            </p>
          </div>
          <button className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Staff
          </button>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Departments</option>
            {departments.filter(d => d !== 'All').map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Roles</option>
            {roles.filter(r => r !== 'All').map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            value={selectedEmploymentType}
            onChange={(e) => setSelectedEmploymentType(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Employment Types</option>
            <option value="Permanent">Permanent</option>
            <option value="Contract">Contract</option>
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
          <p className="text-[13px] text-[#6b7280]">
            Showing {filteredStaff.length} of {allStaff.length} staff members
          </p>
          <button className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-[#d1d5db]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Staff Name
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Staff ID
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Role
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Department
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Employment Type
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Attendance
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
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#e5e7eb] rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-[#6b7280]" />
                      </div>
                      <div>
                        <div className="text-[13px] text-[#111827]">{staff.name}</div>
                        <div className="text-[11px] text-[#9ca3af]">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{staff.staffId}</td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{staff.role}</td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{staff.department}</td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-block px-2 py-1 text-[11px] ${
                        staff.employmentType === 'Permanent'
                          ? 'bg-[#dbeafe] text-[#1e40af]'
                          : 'bg-[#fef3c7] text-[#92400e]'
                      }`}
                    >
                      {staff.employmentType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`text-[13px] ${
                        staff.attendance >= 97
                          ? 'text-[#059669]'
                          : staff.attendance >= 95
                          ? 'text-[#d97706]'
                          : 'text-[#dc2626]'
                      }`}
                    >
                      {staff.attendance}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Circle
                        className={`w-2 h-2 ${
                          staff.status === 'Active' ? 'fill-[#059669] text-[#059669]' : 'fill-[#dc2626] text-[#dc2626]'
                        }`}
                      />
                      <span className="text-[13px] text-[#374151]">{staff.status}</span>
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
    </div>
  );
}
