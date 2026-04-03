import { Search, X, Star, Users, Filter, SlidersHorizontal } from 'lucide-react';
import { useStaffPerformanceData } from '../../hooks/useStaffPerformanceData';

export function StaffPerformance() {
  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    selectedDepartments,
    minWorkEfficiency,
    setMinWorkEfficiency,
    minTaskQuality,
    setMinTaskQuality,
    minDiscipline,
    setMinDiscipline,
    minCommunication,
    setMinCommunication,
    minResponsiveness,
    setMinResponsiveness,
    minAttendance,
    setMinAttendance,
    sortBy,
    setSortBy,
    departments,
    sortedStaff,
    allStaff,
    activeFiltersCount,
    resetFilters,
    toggleDepartment,
  } = useStaffPerformanceData();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 flex-shrink-0 ${
              star <= Math.round(rating)
                ? 'fill-[#f59e0b] text-[#f59e0b]'
                : 'text-[#d1d5db]'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">Staff Performance & Evaluation</h1>
        <p className="text-[13px] text-[#6b7280]">
          Filter, compare, and evaluate staff based on performance metrics
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search by name, staff ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'performance' | 'efficiency' | 'attendance')}
          className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151] min-w-[200px]"
        >
          <option value="performance">Highest Performance First</option>
          <option value="efficiency">Best Work Efficiency</option>
          <option value="attendance">Best Attendance</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-[#111827] text-white text-[11px] px-1.5 py-0.5 rounded">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-[#d1d5db] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[15px] text-[#111827]">Filter Criteria</h2>
                <button
                  onClick={resetFilters}
                  className="text-[13px] text-[#6b7280] hover:text-[#111827] flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Department Filter */}
                <div>
                  <label className="text-[12px] text-[#374151] mb-3 block uppercase tracking-wider">
                    Department
                  </label>
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <label key={dept} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept)}
                          onChange={() => toggleDepartment(dept)}
                          className="w-4 h-4 border-[#d1d5db] text-[#111827] focus:ring-0"
                        />
                        <span className="text-[13px] text-[#374151]">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Work Efficiency Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Work Efficiency
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minWorkEfficiency.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minWorkEfficiency}
                    onChange={(e) => setMinWorkEfficiency(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Task Quality Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Task Quality
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minTaskQuality.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minTaskQuality}
                    onChange={(e) => setMinTaskQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Discipline Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Discipline & Punctuality
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minDiscipline.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minDiscipline}
                    onChange={(e) => setMinDiscipline(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Communication Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Communication
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minCommunication.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minCommunication}
                    onChange={(e) => setMinCommunication(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Responsiveness Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Responsiveness
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minResponsiveness.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minResponsiveness}
                    onChange={(e) => setMinResponsiveness(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Attendance Consistency Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Attendance Consistency
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minAttendance.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minAttendance}
                    onChange={(e) => setMinAttendance(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Performance Cards Grid */}
        <div className="flex-1">
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-[13px] text-[#6b7280]">
              Showing {sortedStaff.length} of {allStaff.length} staff members
            </p>
          </div>

          {/* Staff Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedStaff.map((staff) => (
              <div
                key={staff.id}
                className="bg-white border border-[#d1d5db] p-5 hover:border-[#9ca3af] transition-colors h-full flex flex-col overflow-hidden box-border"
              >
                {/* Staff Header with Avatar, Name, and Overall Performance */}
                <div className="flex items-start gap-4 mb-5 pb-5 border-b border-[#e5e7eb]">
                  {/* Avatar and Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-14 h-14 bg-[#e5e7eb] rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-[#6b7280]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] text-[#111827] mb-1 truncate">{staff.name}</h3>
                      <p className="text-[12px] text-[#6b7280] truncate">{staff.role}</p>
                      <p className="text-[11px] text-[#9ca3af] truncate">{staff.department}</p>
                    </div>
                  </div>

                  {/* Overall Performance */}
                  <div className="text-center flex-shrink-0 w-16">
                    <div className="text-[32px] text-[#111827] leading-none mb-1.5">
                      {staff.overallPerformance.toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-1">
                      {renderStars(staff.overallPerformance)}
                    </div>
                    <p className="text-[10px] text-[#6b7280] uppercase tracking-wider leading-tight">
                      Overall<br />Performance
                    </p>
                  </div>
                </div>

                {/* Performance Metrics - Stacked */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Work Efficiency</span>
                    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      <span className="text-[15px] text-[#111827] w-8 text-right">
                        {staff.workEfficiency.toFixed(1)}
                      </span>
                      {renderStars(staff.workEfficiency)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Task Quality</span>
                    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      <span className="text-[15px] text-[#111827] w-8 text-right">
                        {staff.taskCompletionQuality.toFixed(1)}
                      </span>
                      {renderStars(staff.taskCompletionQuality)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Discipline & Punctuality</span>
                    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      <span className="text-[15px] text-[#111827] w-8 text-right">
                        {staff.disciplinePunctuality.toFixed(1)}
                      </span>
                      {renderStars(staff.disciplinePunctuality)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Communication</span>
                    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      <span className="text-[15px] text-[#111827] w-8 text-right">
                        {staff.communication.toFixed(1)}
                      </span>
                      {renderStars(staff.communication)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Responsiveness</span>
                    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      <span className="text-[15px] text-[#111827] w-8 text-right">
                        {staff.responsiveness.toFixed(1)}
                      </span>
                      {renderStars(staff.responsiveness)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedStaff.length === 0 && (
            <div className="bg-white border border-[#d1d5db] p-12 text-center">
              <Filter className="w-12 h-12 text-[#d1d5db] mx-auto mb-4" />
              <h3 className="text-[15px] text-[#111827] mb-2">No staff found</h3>
              <p className="text-[13px] text-[#6b7280] mb-4">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
