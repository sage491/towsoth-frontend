import { Plus, Calendar, Users, FileText } from 'lucide-react';
import { useState } from 'react';
import { CreateAssessmentModal } from '../modals/CreateAssessmentModal';
import { FilterBar } from '../filters/FilterBar';
import { useAssessmentManagementData } from '../../hooks/useAssessmentManagementData';

export function AssessmentManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    setActiveFilters,
    assessments,
    filteredAssessments,
    filterConfigs,
  } = useAssessmentManagementData();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] text-[#111827] mb-1">Assessment Management</h1>
          <p className="text-[13px] text-[#6b7280]">Create and manage assessments with AI-assisted question tagging</p>
        </div>
        <button className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Assessment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Assessments</p>
          <p className="text-[28px] text-[#111827]">68</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Published</p>
          <p className="text-[28px] text-[#111827]">12</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Question Bank</p>
          <p className="text-[28px] text-[#111827]">1,842</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Avg. Completion</p>
          <p className="text-[28px] text-[#111827]">91%</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Pending Review</p>
          <p className="text-[28px] text-[#d97706]">8</p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterConfigs}
        onFiltersChange={setActiveFilters}
        resultCount={filteredAssessments.length}
        totalCount={assessments.length}
        storageKey="assessment-filters"
      />

      {/* Assessment List */}
      <div className="bg-white border border-[#d1d5db] mb-6">
        {filteredAssessments.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[15px] text-[#6b7280] mb-2">No assessments match your filters</p>
            <p className="text-[13px] text-[#9ca3af]">Try adjusting or clearing your filters to see more results</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '15%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>
              <thead className="bg-[#f9fafb] border-b border-[#d1d5db]">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors cursor-pointer">
                    {/* Type - single line with ellipsis */}
                    <td className="px-5 py-4 align-middle">
                      <span className="text-[13px] text-[#6b7280] block truncate" title={assessment.type}>
                        {assessment.type}
                      </span>
                    </td>
                    
                    {/* Subject - single line */}
                    <td className="px-5 py-4 align-middle">
                      <span className="text-[13px] text-[#374151] block truncate">
                        {assessment.subject}
                      </span>
                    </td>
                    
                    {/* Schedule - vertically centered */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#6b7280] flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[13px] text-[#374151] whitespace-nowrap">{assessment.date}</p>
                          <p className="text-[11px] text-[#6b7280] whitespace-nowrap">{assessment.duration}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Questions - centered */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span className="text-[13px] text-[#374151] whitespace-nowrap">
                          {assessment.questions}
                        </span>
                      </div>
                    </td>
                    
                    {/* Marks - centered */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span className="text-[13px] text-[#374151] whitespace-nowrap">
                          {assessment.totalMarks}
                        </span>
                      </div>
                    </td>
                    
                    {/* Progress - centered with icon */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4 text-[#6b7280] flex-shrink-0" />
                        <span className="text-[13px] text-[#374151] whitespace-nowrap">
                          {assessment.completed}/{assessment.total}
                        </span>
                      </div>
                    </td>
                    
                    {/* Status Badge - centered in fixed container */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-block px-2.5 py-1 text-[11px] border whitespace-nowrap ${
                            assessment.status === 'Published'
                              ? 'bg-[#d1fae5] border-[#86efac] text-[#059669]'
                              : assessment.status === 'Completed'
                              ? 'bg-[#e0e7ff] border-[#a5b4fc] text-[#4f46e5]'
                              : 'bg-[#f3f4f6] border-[#d1d5db] text-[#6b7280]'
                          }`}
                        >
                          {assessment.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* Question Bank Stats */}
        <div className="bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">Question Bank Distribution</h2>
          <div className="space-y-4">
            {[
              { category: 'Previous Year Questions (PYQ)', count: 842, aiTagged: 842 },
              { category: 'Internal Questions', count: 624, aiTagged: 598 },
              { category: 'Custom Questions', count: 376, aiTagged: 312 },
            ].map((item, i) => (
              <div key={i} className="border border-[#e5e7eb] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-[#374151]">{item.category}</span>
                  <span className="text-[13px] text-[#111827]">{item.count}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#6b7280]">
                  <FileText className="w-3 h-3" />
                  <span>AI Tagged: {item.aiTagged}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">Difficulty Distribution</h2>
          <div className="space-y-4">
            {[
              { level: 'Easy', count: 628, percentage: 34 },
              { level: 'Medium', count: 812, percentage: 44 },
              { level: 'Hard', count: 402, percentage: 22 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-[13px] text-[#374151]">{item.level}</span>
                  <span className="text-[13px] text-[#6b7280]">{item.count} questions</span>
                </div>
                <div className="h-2 bg-[#e5e7eb]">
                  <div
                    className={`h-full ${
                      item.level === 'Easy'
                        ? 'bg-[#059669]'
                        : item.level === 'Medium'
                        ? 'bg-[#d97706]'
                        : 'bg-[#dc2626]'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Assessment Modal */}
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // TODO: Refresh assessment list
          console.log('Assessment created successfully!');
        }}
      />
    </div>
  );
}