import { useState } from 'react';
import { Plus, Edit2, Archive, AlertTriangle, X, Check } from 'lucide-react';

interface Stream {
  id: string;
  name: string;
  code: string;
  programType: 'UG' | 'PG' | 'Diploma';
  duration: number;
  status: 'Active' | 'Archived';
  batchesCount: number;
  studentsCount: number;
  createdDate: string;
}

export function StreamsManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<Stream | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    programType: 'UG' as 'UG' | 'PG' | 'Diploma',
    duration: 4,
    status: 'Active' as 'Active' | 'Archived',
  });

  // Mock data
  const streams: Stream[] = [
    {
      id: 'STR001',
      name: 'Computer Science & Engineering',
      code: 'CSE',
      programType: 'UG',
      duration: 4,
      status: 'Active',
      batchesCount: 8,
      studentsCount: 480,
      createdDate: '2020-06-15',
    },
    {
      id: 'STR002',
      name: 'Electronics & Communication Engineering',
      code: 'ECE',
      programType: 'UG',
      duration: 4,
      status: 'Active',
      batchesCount: 6,
      studentsCount: 360,
      createdDate: '2020-06-15',
    },
    {
      id: 'STR003',
      name: 'Mechanical Engineering',
      code: 'ME',
      programType: 'UG',
      duration: 4,
      status: 'Active',
      batchesCount: 5,
      studentsCount: 300,
      createdDate: '2020-06-15',
    },
    {
      id: 'STR004',
      name: 'Civil Engineering',
      code: 'CE',
      programType: 'UG',
      duration: 4,
      status: 'Active',
      batchesCount: 4,
      studentsCount: 240,
      createdDate: '2020-06-15',
    },
    {
      id: 'STR005',
      name: 'Master of Computer Applications',
      code: 'MCA',
      programType: 'PG',
      duration: 2,
      status: 'Active',
      batchesCount: 3,
      studentsCount: 90,
      createdDate: '2021-06-20',
    },
    {
      id: 'STR006',
      name: 'Information Technology',
      code: 'IT',
      programType: 'Diploma',
      duration: 3,
      status: 'Archived',
      batchesCount: 0,
      studentsCount: 0,
      createdDate: '2018-06-10',
    },
  ];

  const handleOpenModal = (stream?: Stream) => {
    if (stream) {
      setEditingStream(stream);
      setFormData({
        name: stream.name,
        code: stream.code,
        programType: stream.programType,
        duration: stream.duration,
        status: stream.status,
      });
    } else {
      setEditingStream(null);
      setFormData({
        name: '',
        code: '',
        programType: 'UG',
        duration: 4,
        status: 'Active',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStream(null);
  };

  const handleSave = () => {
    // Save logic would go here
    console.log('Saving stream:', formData);
    handleCloseModal();
  };

  const handleArchive = (stream: Stream) => {
    if (stream.batchesCount > 0) {
      setDeleteWarning(stream);
    } else {
      // Archive directly
      console.log('Archiving stream:', stream.id);
    }
  };

  const activeStreams = streams.filter(s => s.status === 'Active');
  const archivedStreams = streams.filter(s => s.status === 'Archived');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[20px] text-[#111827] mb-1">Streams Management</h1>
            <p className="text-[13px] text-[#6b7280]">
              Manage academic programs and departments
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Stream
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Streams</p>
          <p className="text-[32px] text-[#111827] leading-none">{streams.length}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Active Streams</p>
          <p className="text-[32px] text-[#111827] leading-none">{activeStreams.length}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Batches</p>
          <p className="text-[32px] text-[#111827] leading-none">
            {streams.reduce((acc, s) => acc + s.batchesCount, 0)}
          </p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Students</p>
          <p className="text-[32px] text-[#111827] leading-none">
            {streams.reduce((acc, s) => acc + s.studentsCount, 0)}
          </p>
        </div>
      </div>

      {/* Active Streams Table */}
      <div className="bg-white border border-[#d1d5db] mb-6">
        <div className="p-5 border-b border-[#e5e7eb]">
          <h2 className="text-[15px] text-[#111827]">Active Streams</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Stream Name
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Code
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Program Type
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Duration
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Batches
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
              {activeStreams.map((stream) => (
                <tr key={stream.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                  <td className="px-5 py-4">
                    <div>
                      <div className="text-[13px] text-[#111827]">{stream.name}</div>
                      <div className="text-[11px] text-[#9ca3af]">Created: {stream.createdDate}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{stream.code}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-block px-2 py-1 text-[11px] ${
                      stream.programType === 'UG'
                        ? 'bg-[#dbeafe] text-[#1e40af]'
                        : stream.programType === 'PG'
                        ? 'bg-[#e0e7ff] text-[#4338ca]'
                        : 'bg-[#fef3c7] text-[#92400e]'
                    }`}>
                      {stream.programType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                    {stream.duration} Years
                  </td>
                  <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                    {stream.batchesCount}
                  </td>
                  <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                    {stream.studentsCount}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(stream)}
                        className="p-1.5 hover:bg-[#f3f4f6] rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-[#6b7280]" />
                      </button>
                      <button
                        onClick={() => handleArchive(stream)}
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

      {/* Archived Streams */}
      {archivedStreams.length > 0 && (
        <div className="bg-white border border-[#d1d5db]">
          <div className="p-5 border-b border-[#e5e7eb]">
            <h2 className="text-[15px] text-[#111827]">Archived Streams</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Stream Name
                  </th>
                  <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Code
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Program Type
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {archivedStreams.map((stream) => (
                  <tr key={stream.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                    <td className="px-5 py-4 text-[13px] text-[#6b7280]">{stream.name}</td>
                    <td className="px-5 py-4 text-[13px] text-[#6b7280]">{stream.code}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-block px-2 py-1 text-[11px] bg-[#f3f4f6] text-[#6b7280]">
                        {stream.programType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-[13px] text-[#3b82f6] hover:underline">
                        Restore
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
          <div className="bg-white w-full max-w-lg">
            <div className="p-6 border-b border-[#e5e7eb]">
              <h2 className="text-[18px] text-[#111827]">
                {editingStream ? 'Edit Stream' : 'Add New Stream'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[13px] text-[#374151] mb-2 block">
                  Stream Name <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                  placeholder="e.g., Computer Science & Engineering"
                />
              </div>

              <div>
                <label className="text-[13px] text-[#374151] mb-2 block">
                  Stream Code <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                  placeholder="e.g., CSE"
                  maxLength={10}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    Program Type <span className="text-[#dc2626]">*</span>
                  </label>
                  <select
                    value={formData.programType}
                    onChange={(e) => setFormData({ ...formData, programType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                  >
                    <option value="UG">UG (Undergraduate)</option>
                    <option value="PG">PG (Postgraduate)</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    Duration (Years) <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                    min="1"
                    max="6"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] text-[#374151] mb-2 block">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                >
                  <option value="Active">Active</option>
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
                className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingStream ? 'Update Stream' : 'Create Stream'}
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
                  <h3 className="text-[16px] text-[#111827] mb-2">Cannot Archive Stream</h3>
                  <p className="text-[13px] text-[#6b7280] mb-4">
                    This stream has <strong>{deleteWarning.batchesCount} active batches</strong> and{' '}
                    <strong>{deleteWarning.studentsCount} students</strong> associated with it. Please remove or
                    reassign all batches before archiving.
                  </p>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] p-3 text-[12px] text-[#374151]">
                    <p className="mb-1">To archive this stream:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Move all batches to another stream, or</li>
                      <li>Complete/archive all batches first</li>
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
