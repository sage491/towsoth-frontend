import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, Eye } from 'lucide-react';
import { UploadContentModal } from '../modals/UploadContentModal';
import { FilterBar } from '../filters/FilterBar';
import { useContentManagementData } from '../../hooks/useContentManagementData';

export function ContentManagement() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const {
    selectedTab,
    setSelectedTab,
    setActiveFilters,
    content,
    filteredContent,
    filterConfigs,
  } = useContentManagementData();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] text-[#111827] mb-1">Course Content Management</h1>
          <p className="text-[13px] text-[#6b7280]">Upload, review, and manage learning materials with AI verification</p>
        </div>
        <button
          className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="w-4 h-4" />
          Upload Content
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Content</p>
          <p className="text-[28px] text-[#111827]">342</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">AI Verified</p>
          <p className="text-[28px] text-[#059669]">308</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Pending Review</p>
          <p className="text-[28px] text-[#d97706]">18</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Avg. AI Score</p>
          <p className="text-[28px] text-[#111827]">92</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">This Month</p>
          <p className="text-[28px] text-[#111827]">24</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#d1d5db] mb-4">
        <div className="flex gap-6 px-6">
          {[
            { id: 'all', label: 'All Content' },
            { id: 'verified', label: 'Verified' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'rejected', label: 'Flagged' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-3 text-[13px] border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-[#111827] text-[#111827]'
                  : 'border-transparent text-[#6b7280] hover:text-[#374151]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterConfigs}
        onFiltersChange={setActiveFilters}
        resultCount={filteredContent.length}
        totalCount={content.length}
        storageKey="content-filters"
      />

      {/* Content List */}
      <div className="bg-white border border-[#d1d5db]">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '32%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '8%' }} />
            </colgroup>
            <thead className="bg-[#f9fafb] border-b border-[#d1d5db]">
              <tr>
                <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                  Content Title
                </th>
                <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                  AI Score
                </th>
                <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item) => (
                <tr key={item.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors">
                  {/* Content Title - allows wrapping */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-[#6b7280] flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-[#111827] leading-relaxed">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  
                  {/* Type - single line with ellipsis */}
                  <td className="px-5 py-4 align-middle">
                    <span className="text-[13px] text-[#6b7280] block truncate">
                      {item.type}
                    </span>
                  </td>
                  
                  {/* Subject - single line */}
                  <td className="px-5 py-4 align-middle">
                    <span className="text-[13px] text-[#374151] block truncate">
                      {item.subject}
                    </span>
                  </td>
                  
                  {/* Uploaded By - single line with ellipsis */}
                  <td className="px-5 py-4 align-middle">
                    <span className="text-[13px] text-[#374151] block truncate" title={item.uploadedBy}>
                      {item.uploadedBy}
                    </span>
                  </td>
                  
                  {/* Date - single line */}
                  <td className="px-5 py-4 align-middle">
                    <span className="text-[13px] text-[#6b7280] whitespace-nowrap">
                      {item.uploadDate}
                    </span>
                  </td>
                  
                  {/* AI Score - centered */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center justify-center">
                      {item.aiScore ? (
                        <span
                          className={`text-[13px] whitespace-nowrap ${
                            item.aiScore >= 90
                              ? 'text-[#059669]'
                              : item.aiScore >= 70
                              ? 'text-[#d97706]'
                              : 'text-[#dc2626]'
                          }`}
                        >
                          {item.aiScore}
                        </span>
                      ) : (
                        <span className="text-[13px] text-[#9ca3af]">—</span>
                      )}
                    </div>
                  </td>
                  
                  {/* Status Badge - centered in fixed container */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center justify-center">
                      {item.status === 'Published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#d1fae5] border border-[#86efac] text-[#059669] text-[11px] whitespace-nowrap">
                          <CheckCircle className="w-3 h-3 flex-shrink-0" />
                          Verified
                        </span>
                      ) : item.status === 'Draft' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fef3c7] border border-[#fcd34d] text-[#d97706] text-[11px] whitespace-nowrap">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fee2e2] border border-[#fca5a5] text-[#dc2626] text-[11px] whitespace-nowrap">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          Flagged
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Actions - centered */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center justify-center">
                      <button className="text-[12px] text-[#3b82f6] hover:underline inline-flex items-center gap-1 whitespace-nowrap">
                        <Eye className="w-3 h-3 flex-shrink-0" />
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Verification Details */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">AI Verification Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
              <span className="text-[13px] text-[#374151]">Content Accuracy</span>
              <span className="text-[13px] text-[#111827]">94%</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
              <span className="text-[13px] text-[#374151]">Plagiarism Check</span>
              <span className="text-[13px] text-[#059669]">Passed</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
              <span className="text-[13px] text-[#374151]">Curriculum Alignment</span>
              <span className="text-[13px] text-[#111827]">91%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#374151]">Difficulty Level Match</span>
              <span className="text-[13px] text-[#111827]">Appropriate</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">Content by Type</h2>
          <div className="space-y-3">
            {[
              { type: 'Lecture Notes', count: 142, percentage: 41 },
              { type: 'Video Lectures', count: 89, percentage: 26 },
              { type: 'Practice Sets', count: 76, percentage: 22 },
              { type: 'References', count: 35, percentage: 11 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-[13px] text-[#374151]">{item.type}</span>
                  <span className="text-[13px] text-[#6b7280]">{item.count}</span>
                </div>
                <div className="h-2 bg-[#e5e7eb]">
                  <div className="h-full bg-[#3b82f6]" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Content Modal */}
      <UploadContentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          // TODO: Refresh content list
          console.log('Content uploaded successfully!');
        }}
      />
    </div>
  );
}