import { Calendar, Clock, Users, BookOpen, Download, Plus } from 'lucide-react';
import { TimetableEntry } from '../../data/entities';
import { DAYS, useTimetableManagementData } from '../../hooks/useTimetableManagementData';

export function TimetableManagement() {
  const {
    data,
    selectedStream,
    selectedBatch,
    selectedSemester,
    viewMode,
    selectedDay,
    setSelectedSemester,
    setViewMode,
    setSelectedDay,
    availableBatches,
    timetableEntries,
    allTimeSlots,
    timetableGrid,
    facultyWorkload,
    subjectDistribution,
    utilizationMetrics,
    handleStreamChange,
    handleBatchChange,
    selectedStreamData,
    selectedBatchData,
    streams,
  } = useTimetableManagementData();

  const handleExportSchedule = () => {
    if (!selectedBatch) {
      alert('Please select a batch to export.');
      return;
    }

    // TODO: In production, generate PDF/Excel export
    console.log('Exporting timetable for batch:', selectedBatch);
    alert('Timetable export feature - Coming soon!');
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderTimetableCell = (entry: TimetableEntry | null) => {
    if (!entry) {
      return (
        <div className="h-24 border border-[#e5e7eb] bg-[#f9fafb] p-2 flex items-center justify-center">
          <span className="text-[11px] text-[#d1d5db]">—</span>
        </div>
      );
    }

    const subject = data.getSubjectById(entry.subjectId);
    const faculty = data.getFacultyById(entry.facultyId);

    return (
      <div className="h-24 border border-[#d1d5db] bg-white p-2 hover:bg-[#f9fafb] transition-colors cursor-pointer">
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="text-[13px] text-[#111827] mb-1 truncate" title={subject?.name}>
              {subject?.code}
            </div>
            <div className="text-[11px] text-[#6b7280] truncate" title={faculty?.name}>
              {faculty?.name}
            </div>
          </div>
          {entry.room && (
            <div className="text-[10px] text-[#9ca3af] truncate">
              {entry.room}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">Timetable Management</h1>
        <p className="text-[13px] text-[#6b7280]">Create and manage academic schedules</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#d1d5db] p-5 mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
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
              Batch
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

          {/* Semester Filter */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Semester (Optional)
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value ? Number(e.target.value) : '')}
              disabled={!selectedBatch}
              className="w-full px-3 py-2 border border-[#d1d5db] text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af] disabled:cursor-not-allowed"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              View Mode
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('week')}
                className={`flex-1 px-3 py-2 text-[13px] border transition-colors ${
                  viewMode === 'week'
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-white text-[#6b7280] border-[#d1d5db] hover:bg-[#f9fafb]'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`flex-1 px-3 py-2 text-[13px] border transition-colors ${
                  viewMode === 'day'
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-white text-[#6b7280] border-[#d1d5db] hover:bg-[#f9fafb]'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* Day Selector for Day View */}
        {viewMode === 'day' && selectedBatch && (
          <div className="flex gap-2">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 text-[12px] border transition-colors ${
                  selectedDay === day
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-white text-[#6b7280] border-[#d1d5db] hover:bg-[#f9fafb]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        {/* Batch Info Display */}
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
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Academic Year:</span>
                <span className="text-[#111827]">{selectedBatchData?.academicYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Total Periods:</span>
                <span className="text-[#111827]">{timetableEntries.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timetable Grid - Week View */}
      {selectedBatch && viewMode === 'week' && (
        <div className="bg-white border border-[#d1d5db] mb-6 overflow-x-auto">
          <div className="p-5 border-b border-[#d1d5db] flex items-center justify-between">
            <h2 className="text-[15px] text-[#111827]">Weekly Timetable</h2>
            <button
              onClick={handleExportSchedule}
              className="px-3 py-1.5 bg-white border border-[#d1d5db] text-[12px] text-[#374151] hover:bg-[#f9fafb] transition-colors flex items-center gap-2"
            >
              <Download className="w-3 h-3" />
              Export Schedule
            </button>
          </div>

          <div className="p-5">
            <div className="grid" style={{ gridTemplateColumns: '120px repeat(6, 1fr)' }}>
              {/* Header Row */}
              <div className="bg-[#f9fafb] border border-[#d1d5db] p-3">
                <span className="text-[11px] text-[#6b7280] uppercase tracking-wider">Time / Day</span>
              </div>
              {DAYS.map(day => (
                <div key={day} className="bg-[#f9fafb] border border-[#d1d5db] p-3">
                  <span className="text-[12px] text-[#111827]">{day}</span>
                </div>
              ))}

              {/* Time Slot Rows */}
              {allTimeSlots.map(slot => (
                <div key={slot.id} className="contents">
                  {/* Time Slot Label */}
                  <div className="bg-[#f9fafb] border border-[#d1d5db] p-3 flex flex-col justify-center">
                    <div className="text-[12px] text-[#111827]">{slot.name}</div>
                    <div className="text-[10px] text-[#6b7280] mt-1">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>

                  {/* Cells for each day */}
                  {DAYS.map(day => (
                    <div key={`${day}-${slot.id}`}>
                      {renderTimetableCell(timetableGrid[day][slot.id])}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timetable Grid - Day View */}
      {selectedBatch && viewMode === 'day' && (
        <div className="bg-white border border-[#d1d5db] mb-6">
          <div className="p-5 border-b border-[#d1d5db] flex items-center justify-between">
            <h2 className="text-[15px] text-[#111827]">{selectedDay} Schedule</h2>
            <button
              onClick={handleExportSchedule}
              className="px-3 py-1.5 bg-white border border-[#d1d5db] text-[12px] text-[#374151] hover:bg-[#f9fafb] transition-colors flex items-center gap-2"
            >
              <Download className="w-3 h-3" />
              Export Schedule
            </button>
          </div>

          <div className="divide-y divide-[#e5e7eb]">
            {allTimeSlots.map(slot => {
              const entry = timetableGrid[selectedDay][slot.id];
              const subject = entry ? data.getSubjectById(entry.subjectId) : null;
              const faculty = entry ? data.getFacultyById(entry.facultyId) : null;

              return (
                <div key={slot.id} className="p-5 hover:bg-[#f9fafb] transition-colors">
                  <div className="flex items-center gap-6">
                    {/* Time Slot Info */}
                    <div className="w-32 flex-shrink-0">
                      <div className="flex items-center gap-2 text-[13px] text-[#111827] mb-1">
                        <Clock className="w-4 h-4 text-[#6b7280]" />
                        {slot.name}
                      </div>
                      <div className="text-[11px] text-[#6b7280]">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>

                    {/* Class Info */}
                    {entry ? (
                      <div className="flex-1 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#6b7280]" />
                          <div>
                            <div className="text-[13px] text-[#111827]">{subject?.name}</div>
                            <div className="text-[11px] text-[#6b7280]">{subject?.code}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#6b7280]" />
                          <div>
                            <div className="text-[13px] text-[#111827]">{faculty?.name}</div>
                            <div className="text-[11px] text-[#6b7280]">{faculty?.designation}</div>
                          </div>
                        </div>

                        {entry.room && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#6b7280]" />
                            <div className="text-[13px] text-[#111827]">{entry.room}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1">
                        <span className="text-[13px] text-[#9ca3af] italic">No class scheduled</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Insights Panels */}
      {selectedBatch && (
        <div className="grid grid-cols-3 gap-6">
          {/* Faculty Workload */}
          <div className="bg-white border border-[#d1d5db] p-5">
            <h3 className="text-[15px] text-[#111827] mb-4">Faculty Workload</h3>
            <div className="space-y-3">
              {facultyWorkload.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#111827] truncate">{item.faculty.name}</div>
                    <div className="text-[11px] text-[#6b7280]">{item.subjects} subjects</div>
                  </div>
                  <div className="text-[13px] text-[#111827] ml-3">
                    {item.hours} hrs/week
                  </div>
                </div>
              ))}
              {facultyWorkload.length === 0 && (
                <p className="text-[12px] text-[#9ca3af] italic">No faculty assigned yet</p>
              )}
            </div>
          </div>

          {/* Subject Distribution */}
          <div className="bg-white border border-[#d1d5db] p-5">
            <h3 className="text-[15px] text-[#111827] mb-4">Subject Distribution</h3>
            <div className="space-y-3">
              {subjectDistribution.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] text-[#374151] truncate">{item.subject.code}</span>
                    <span className="text-[13px] text-[#6b7280] ml-2">{item.periods} periods</span>
                  </div>
                  <div className="h-2 bg-[#e5e7eb]">
                    <div
                      className="h-full bg-[#3b82f6]"
                      style={{ width: `${(item.periods / timetableEntries.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {subjectDistribution.length === 0 && (
                <p className="text-[12px] text-[#9ca3af] italic">No subjects scheduled yet</p>
              )}
            </div>
          </div>

          {/* Batch Utilization */}
          <div className="bg-white border border-[#d1d5db] p-5">
            <h3 className="text-[15px] text-[#111827] mb-4">Batch Utilization</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
                <span className="text-[13px] text-[#374151]">Total Slots</span>
                <span className="text-[13px] text-[#111827]">{utilizationMetrics.totalSlots}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
                <span className="text-[13px] text-[#374151]">Filled Slots</span>
                <span className="text-[13px] text-[#059669]">{utilizationMetrics.filledSlots}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
                <span className="text-[13px] text-[#374151]">Free Slots</span>
                <span className="text-[13px] text-[#6b7280]">{utilizationMetrics.freeSlots}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#374151]">Utilization Rate</span>
                <span className="text-[15px] text-[#111827]">{utilizationMetrics.utilizationRate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedBatch && (
        <div className="bg-white border border-[#d1d5db] p-12 text-center">
          <Calendar className="w-12 h-12 text-[#d1d5db] mx-auto mb-4" />
          <h3 className="text-[15px] text-[#111827] mb-2">Select a Batch to View Timetable</h3>
          <p className="text-[13px] text-[#6b7280] max-w-md mx-auto">
            Choose a stream and batch from the filters above to view and manage the academic timetable. 
            The timetable drives attendance marking and class schedules across the system.
          </p>
        </div>
      )}
    </div>
  );
}
