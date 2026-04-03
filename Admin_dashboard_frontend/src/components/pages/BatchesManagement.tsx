import { useState } from 'react';
import { Plus, Edit2, Archive, AlertTriangle, X, Check, Users } from 'lucide-react';

interface Batch {
  id: string;
  name: string;
  streamId: string;
  streamName: string;
  academicYear: string;
  startYear: number;
  endYear: number;
  section: string;
  capacity: number;
  enrolled: number;
  subjectsCount: number;
  status: 'Active' | 'Completed' | 'Archived';
}

export function BatchesManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<Batch | null>(null);
  const [selectedStream, setSelectedStream] = useState<string>('all');

  const [formData, setFormData] = useState({
    streamId: '',
    name: '',
    academicYear: '2024-2025',
    startYear: 2024,
    endYear: 2028,
    section: 'A',
    capacity: 60,
    status: 'Active' as 'Active' | 'Completed' | 'Archived',
  });

  // Mock data
  const streams = [
    { id: 'STR001', name: 'Computer Science & Engineering', code: 'CSE' },
    { id: 'STR002', name: 'Electronics & Communication Engineering', code: 'ECE' },
    { id: 'STR003', name: 'Mechanical Engineering', code: 'ME' },
    { id: 'STR004', name: 'Civil Engineering', code: 'CE' },
    { id: 'STR005', name: 'Master of Computer Applications', code: 'MCA' },
  ];

  const batches: Batch[] = [
    {
      id: 'BAT001',
      name: 'CS-A3 (2022-2026)',
      streamId: 'STR001',
      streamName: 'Computer Science & Engineering',
      academicYear: '2024-2025',
      startYear: 2022,
      endYear: 2026,
      section: 'A',
      capacity: 60,
      enrolled: 58,
      subjectsCount: 8,
      status: 'Active',
    },
    {
      id: 'BAT002',
      name: 'CS-B3 (2022-2026)',
      streamId: 'STR001',
      streamName: 'Computer Science & Engineering',
      academicYear: '2024-2025',
      startYear: 2022,
      endYear: 2026,
      section: 'B',
      capacity: 60,
      enrolled: 55,
      subjectsCount: 8,
      status: 'Active',
    },
    {
      id: 'BAT003',
      name: 'CS-A2 (2023-2027)',
      streamId: 'STR001',
      streamName: 'Computer Science & Engineering',
      academicYear: '2024-2025',
      startYear: 2023,
      endYear: 2027,
      section: 'A',
      capacity: 60,
      enrolled: 60,
      subjectsCount: 7,
      status: 'Active',
    },
    {
      id: 'BAT004',
      name: 'ECE-A2 (2023-2027)',
      streamId: 'STR002',
      streamName: 'Electronics & Communication Engineering',
      academicYear: '2024-2025',
      startYear: 2023,
      endYear: 2027,
      section: 'A',
      capacity: 50,
      enrolled: 48,
      subjectsCount: 7,
      status: 'Active',
    },
    {
      id: 'BAT005',
      name: 'ME-A1 (2024-2028)',
      streamId: 'STR003',
      streamName: 'Mechanical Engineering',
      academicYear: '2024-2025',
      startYear: 2024,
      endYear: 2028,
      section: 'A',
      capacity: 50,
      enrolled: 45,
      subjectsCount: 6,
      status: 'Active',
    },
    {
      id: 'BAT006',
      name: 'CS-A4 (2018-2022)',
      streamId: 'STR001',
      streamName: 'Computer Science & Engineering',
      academicYear: '2021-2022',
      startYear: 2018,
      endYear: 2022,
      section: 'A',
      capacity: 60,
      enrolled: 58,
      subjectsCount: 0,
      status: 'Completed',
    },
  ];

  const handleOpenModal = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        streamId: batch.streamId,
        name: batch.name,
        academicYear: batch.academicYear,
        startYear: batch.startYear,
        endYear: batch.endYear,
        section: batch.section,
        capacity: batch.capacity,
        status: batch.status,
      });
    } else {
      setEditingBatch(null);
      setFormData({
        streamId: '',
        name: '',
        academicYear: '2024-2025',
        startYear: 2024,
        endYear: 2028,
        section: 'A',
        capacity: 60,
        status: 'Active',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBatch(null);
  };

  const handleSave = () => {
    // Save logic would go here
    console.log('Saving batch:', formData);
    handleCloseModal();
  };

  const handleArchive = (batch: Batch) => {
    if (batch.enrolled > 0) {
      setDeleteWarning(batch);
    } else {
      // Archive directly
      console.log('Archiving batch:', batch.id);
    }
  };

  const filteredBatches = selectedStream === 'all'
    ? batches
    : batches.filter(b => b.streamId === selectedStream);

  const activeBatches = filteredBatches.filter(b => b.status === 'Active');
  const completedBatches = filteredBatches.filter(b => b.status === 'Completed');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[20px] text-[#111827] mb-1">Batches Management</h1>
            <p className="text-[13px] text-[#6b7280]">
              Manage student batches and cohorts across all streams
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Batch
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Batches</p>
          <p className="text-[32px] text-[#111827] leading-none">{batches.length}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Active Batches</p>
          <p className="text-[32px] text-[#111827] leading-none">{activeBatches.length}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Enrolled</p>
          <p className="text-[32px] text-[#111827] leading-none">
            {batches.reduce((acc, b) => acc + b.enrolled, 0)}
          </p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Avg. Capacity</p>
          <p className="text-[32px] text-[#111827] leading-none">
            {Math.round(batches.reduce((acc, b) => acc + (b.enrolled / b.capacity * 100), 0) / batches.length)}%
          </p>
        </div>
      </div>

      {/* Stream Filter */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-[13px] text-[#374151]">Filter by Stream:</label>
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151] min-w-[300px]"
          >
            <option value="all">All Streams</option>
            {streams.map((stream) => (
              <option key={stream.id} value={stream.id}>
                {stream.name} ({stream.code})
              </option>
            ))}
          </select>
          <div className="flex-1"></div>
          <p className="text-[13px] text-[#6b7280]">
            Showing {filteredBatches.length} batches
          </p>
        </div>
      </div>

      {/* Active Batches Table */}
      <div className="bg-white border border-[#d1d5db] mb-6">
        <div className="p-5 border-b border-[#e5e7eb]">
          <h2 className="text-[15px] text-[#111827]">Active Batches</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Batch Name
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Stream
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Academic Year
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Year Range
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Section
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Enrollment
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Subjects
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {activeBatches.map((batch) => (
                <tr key={batch.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                  <td className="px-5 py-4 text-[13px] text-[#111827]">{batch.name}</td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{batch.streamName}</td>
                  <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                    {batch.academicYear}
                  </td>
                  <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                    {batch.startYear} - {batch.endYear}
                  </td>
                  <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                    {batch.section}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4 text-[#6b7280]" />
                      <span className={`text-[13px] ${
                        batch.enrolled >= batch.capacity ? 'text-[#dc2626]' : 'text-[#374151]'
                      }`}>
                        {batch.enrolled}/{batch.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                    {batch.subjectsCount}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(batch)}
                        className="p-1.5 hover:bg-[#f3f4f6] rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-[#6b7280]" />
                      </button>
                      <button
                        onClick={() => handleArchive(batch)}
                        className="p-1.5 hover:bg-[#f3f4f6] rounded"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4 text-[#6b7280]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Batches */}
      {completedBatches.length > 0 && (
        <div className="bg-white border border-[#d1d5db]">
          <div className="p-5 border-b border-[#e5e7eb]">
            <h2 className="text-[15px] text-[#111827]">Completed Batches</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Batch Name
                  </th>
                  <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Stream
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Year Range
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Students
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedBatches.map((batch) => (
                  <tr key={batch.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                    <td className="px-5 py-4 text-[13px] text-[#6b7280]">{batch.name}</td>
                    <td className="px-5 py-4 text-[13px] text-[#6b7280]">{batch.streamName}</td>
                    <td className="px-5 py-4 text-center text-[13px] text-[#6b7280]">
                      {batch.startYear} - {batch.endYear}
                    </td>
                    <td className="px-5 py-4 text-center text-[13px] text-[#6b7280]">
                      {batch.enrolled}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-[13px] text-[#3b82f6] hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="p-6 border-b border-[#e5e7eb]">
              <h2 className="text-[18px] text-[#111827]">
                {editingBatch ? 'Edit Batch' : 'Add New Batch'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[13px] text-[#374151] mb-2 block">
                  Select Stream <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={formData.streamId}
                  onChange={(e) => setFormData({ ...formData, streamId: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                >
                  <option value="">Select a stream</option>
                  {streams.map((stream) => (
                    <option key={stream.id} value={stream.id}>
                      {stream.name} ({stream.code})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Batch will be created under the selected stream
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    Start Year <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                    min="2000"
                    max="2030"
                  />
                </div>

                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    End Year <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                    min="2000"
                    max="2035"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    Section <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                    placeholder="e.g., A, B, C"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    Capacity <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                    min="1"
                    max="200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] text-[#374151] mb-2 block">
                  Academic Year <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                  placeholder="e.g., 2024-2025"
                />
              </div>

              <div>
                <label className="text-[13px] text-[#374151] mb-2 block">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-[#e5e7eb] flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.streamId}
                className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {editingBatch ? 'Update Batch' : 'Create Batch'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Warning Modal */}
      {deleteWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#fef3c7] rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-[#d97706]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] text-[#111827] mb-2">Cannot Archive Batch</h3>
                  <p className="text-[13px] text-[#6b7280] mb-4">
                    This batch has <strong>{deleteWarning.enrolled} enrolled students</strong>. Please move all
                    students to another batch before archiving.
                  </p>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] p-3 text-[12px] text-[#374151]">
                    <p className="mb-1">To archive this batch:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Transfer all students to another batch, or</li>
                      <li>Mark the batch as "Completed" instead</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e5e7eb] flex items-center justify-end">
              <button
                onClick={() => setDeleteWarning(null)}
                className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151]"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
