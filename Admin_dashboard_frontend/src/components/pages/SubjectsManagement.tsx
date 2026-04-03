import { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, X, Check, BookOpen } from 'lucide-react';

type SubjectType = 'Core' | 'Elective' | 'Lab';

interface Subject {
  id: string;
  name: string;
  code: string;
  streamId: string;
  streamName: string;
  batchId: string | null;
  batchName: string | null;
  semester: number;
  credits: number;
  type: SubjectType;
  facultyId: string | null;
  facultyName: string | null;
  hasAttendance: boolean;
  hasAssessments: boolean;
}

export function SubjectsManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<Subject | null>(null);
  
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');

  const [formData, setFormData] = useState({
    streamId: '',
    batchId: '',
    name: '',
    code: '',
    semester: 1,
    credits: 3,
    type: 'Core' as SubjectType,
  });

  // Mock data
  const streams = [
    { id: 'STR001', name: 'Computer Science & Engineering', code: 'CSE' },
    { id: 'STR002', name: 'Electronics & Communication Engineering', code: 'ECE' },
    { id: 'STR003', name: 'Mechanical Engineering', code: 'ME' },
  ];

  const batches = [
    { id: 'BAT001', name: 'CS-A3 (2022-2026)', streamId: 'STR001' },
    { id: 'BAT002', name: 'CS-B3 (2022-2026)', streamId: 'STR001' },
    { id: 'BAT003', name: 'ECE-A2 (2023-2027)', streamId: 'STR002' },
    { id: 'BAT004', name: 'ME-A1 (2024-2028)', streamId: 'STR003' },
  ];

  const subjects: Subject[] = [
    {
      id: 'SUB001',
      name: 'Data Structures and Algorithms',
      code: 'CS-301',
      streamId: 'STR001',
      streamName: 'Computer Science & Engineering',
      batchId: 'BAT001',
      batchName: 'CS-A3 (2022-2026)',
      semester: 3,
      credits: 4,
      type: 'Core',
      facultyId: 'FAC001',
      facultyName: 'Dr. Ramesh Sharma',
      hasAttendance: true,
      hasAssessments: true,
    },
    {
      id: 'SUB002',
      name: 'Operating Systems',
      code: 'CS-302',
      streamId: 'STR001',
      streamName: 'Computer Science & Engineering',
      batchId: 'BAT001',
      batchName: 'CS-A3 (2022-2026)',
      semester: 3,
      credits: 4,
      type: 'Core',
      facultyId: 'FAC002',
      facultyName: 'Prof. Priya Kumar',
      hasAttendance: true,
      hasAssessments: true,
    },
    {
      id: 'SUB003',
      name: 'Database Management Systems',
      code: 'CS-303',
      streamId: 'STR001',
      streamName: 'Computer Science & Engineering',
      batchId: 'BAT001',
      batchName: 'CS-A3 (2022-2026)',
      semester: 3,
      credits: 3,
      type: 'Core',
      facultyId: 'FAC003',
      facultyName: 'Dr. Anjali Patel',
      hasAttendance: true,
      hasAssessments: false,
    },
    {
      id: 'SUB004',
      name: 'Computer Networks Lab',
      code: 'CS-304',
      streamId: 'STR001',
      streamName: 'Computer Science & Engineering',
      batchId: 'BAT001',
      batchName: 'CS-A3 (2022-2026)',
      semester: 3,
      credits: 2,
      type: 'Lab',
      facultyId: null,
      facultyName: null,
      hasAttendance: false,
      hasAssessments: false,
    },
    {
      id: 'SUB005',
      name: 'Machine Learning',
      code: 'CS-305',
      streamId: 'STR001',
      streamName: 'Computer Science & Engineering',
      batchId: 'BAT001',
      batchName: 'CS-A3 (2022-2026)',
      semester: 3,
      credits: 3,
      type: 'Elective',
      facultyId: 'FAC004',
      facultyName: 'Dr. Vikram Singh',
      hasAttendance: true,
      hasAssessments: true,
    },
    {
      id: 'SUB006',
      name: 'Digital Signal Processing',
      code: 'EC-201',
      streamId: 'STR002',
      streamName: 'Electronics & Communication Engineering',
      batchId: 'BAT003',
      batchName: 'ECE-A2 (2023-2027)',
      semester: 2,
      credits: 4,
      type: 'Core',
      facultyId: 'FAC005',
      facultyName: 'Dr. Suresh Rao',
      hasAttendance: true,
      hasAssessments: true,
    },
    {
      id: 'SUB007',
      name: 'Engineering Mechanics',
      code: 'ME-101',
      streamId: 'STR003',
      streamName: 'Mechanical Engineering',
      batchId: 'BAT004',
      batchName: 'ME-A1 (2024-2028)',
      semester: 1,
      credits: 4,
      type: 'Core',
      facultyId: 'FAC006',
      facultyName: 'Prof. Lakshmi Nair',
      hasAttendance: true,
      hasAssessments: false,
    },
  ];

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        streamId: subject.streamId,
        batchId: subject.batchId || '',
        name: subject.name,
        code: subject.code,
        semester: subject.semester,
        credits: subject.credits,
        type: subject.type,
      });
    } else {
      setEditingSubject(null);
      setFormData({
        streamId: '',
        batchId: '',
        name: '',
        code: '',
        semester: 1,
        credits: 3,
        type: 'Core',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubject(null);
  };

  const handleSave = () => {
    // Save logic would go here
    console.log('Saving subject:', formData);
    handleCloseModal();
  };

  const handleDelete = (subject: Subject) => {
    if (subject.hasAttendance || subject.hasAssessments) {
      setDeleteWarning(subject);
    } else {
      // Delete directly
      console.log('Deleting subject:', subject.id);
    }
  };

  // Filter batches based on selected stream
  const availableBatches = formData.streamId
    ? batches.filter(b => b.streamId === formData.streamId)
    : [];

  // Filter subjects
  const filteredSubjects = subjects.filter((subject) => {
    const matchesStream = selectedStream === 'all' || subject.streamId === selectedStream;
    const matchesBatch = selectedBatch === 'all' || subject.batchId === selectedBatch;
    const matchesSemester = selectedSemester === 'all' || subject.semester.toString() === selectedSemester;
    return matchesStream && matchesBatch && matchesSemester;
  });

  const getTypeColor = (type: SubjectType): string => {
    switch (type) {
      case 'Core':
        return 'bg-[#dbeafe] text-[#1e40af] border-[#93c5fd]';
      case 'Elective':
        return 'bg-[#d1fae5] text-[#065f46] border-[#86efac]';
      case 'Lab':
        return 'bg-[#fef3c7] text-[#92400e] border-[#fcd34d]';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[20px] text-[#111827] mb-1">Subjects Management</h1>
            <p className="text-[13px] text-[#6b7280]">
              Manage subjects, courses, and faculty assignments
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Subject
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Subjects</p>
          <p className="text-[32px] text-[#111827] leading-none">{subjects.length}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Core Subjects</p>
          <p className="text-[32px] text-[#111827] leading-none">
            {subjects.filter(s => s.type === 'Core').length}
          </p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Assigned Faculty</p>
          <p className="text-[32px] text-[#111827] leading-none">
            {subjects.filter(s => s.facultyId).length}
          </p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-5">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Unassigned</p>
          <p className="text-[32px] text-[#dc2626] leading-none">
            {subjects.filter(s => !s.facultyId).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[12px] text-[#374151] mb-2 block">Filter by Stream</label>
            <select
              value={selectedStream}
              onChange={(e) => {
                setSelectedStream(e.target.value);
                setSelectedBatch('all');
              }}
              className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
            >
              <option value="all">All Streams</option>
              {streams.map((stream) => (
                <option key={stream.id} value={stream.id}>
                  {stream.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] text-[#374151] mb-2 block">Filter by Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
              disabled={selectedStream === 'all'}
            >
              <option value="all">All Batches</option>
              {batches
                .filter(b => selectedStream === 'all' || b.streamId === selectedStream)
                .map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] text-[#374151] mb-2 block">Filter by Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem.toString()}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <p className="text-[13px] text-[#6b7280]">
              Showing {filteredSubjects.length} subjects
            </p>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white border border-[#d1d5db]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Subject Name
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Code
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Stream
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Batch
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Semester
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Credits
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Type
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Faculty
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#f3f4f6] rounded flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-[#6b7280]" />
                      </div>
                      <div className="text-[13px] text-[#111827]">{subject.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{subject.code}</td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{subject.streamName}</td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">
                    {subject.batchName || '-'}
                  </td>
                  <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                    {subject.semester}
                  </td>
                  <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                    {subject.credits}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-block px-2 py-1 text-[11px] border ${getTypeColor(subject.type)}`}>
                      {subject.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {subject.facultyName ? (
                      <span className="text-[13px] text-[#374151]">{subject.facultyName}</span>
                    ) : (
                      <span className="text-[13px] text-[#dc2626]">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(subject)}
                        className="p-1.5 hover:bg-[#f3f4f6] rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-[#6b7280]" />
                      </button>
                      <button
                        onClick={() => handleDelete(subject)}
                        className="p-1.5 hover:bg-[#f3f4f6] rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-[#6b7280]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="p-6 border-b border-[#e5e7eb]">
              <h2 className="text-[18px] text-[#111827]">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[13px] text-[#374151] mb-2 block">
                  Select Stream <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={formData.streamId}
                  onChange={(e) => setFormData({ ...formData, streamId: e.target.value, batchId: '' })}
                  className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                >
                  <option value="">Select a stream</option>
                  {streams.map((stream) => (
                    <option key={stream.id} value={stream.id}>
                      {stream.name} ({stream.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[13px] text-[#374151] mb-2 block">
                  Select Batch (Optional)
                </label>
                <select
                  value={formData.batchId}
                  onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                  disabled={!formData.streamId}
                >
                  <option value="">Apply to all batches in stream</option>
                  {availableBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Leave empty to apply this subject to all batches in the stream
                </p>
              </div>

              <div>
                <label className="text-[13px] text-[#374151] mb-2 block">
                  Subject Name <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                  placeholder="e.g., Data Structures and Algorithms"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    Subject Code <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                    placeholder="e.g., CS-301"
                  />
                </div>

                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    Subject Type <span className="text-[#dc2626]">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as SubjectType })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    Semester <span className="text-[#dc2626]">*</span>
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[13px] text-[#374151] mb-2 block">
                    Credits <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
                    min="1"
                    max="6"
                  />
                </div>
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
                disabled={!formData.streamId || !formData.name || !formData.code}
                className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {editingSubject ? 'Update Subject' : 'Create Subject'}
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
                <div className="w-12 h-12 bg-[#fee2e2] rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-[#dc2626]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] text-[#111827] mb-2">Cannot Delete Subject</h3>
                  <p className="text-[13px] text-[#6b7280] mb-4">
                    This subject has existing data and cannot be deleted:
                  </p>
                  <ul className="space-y-2 mb-4">
                    {deleteWarning.hasAttendance && (
                      <li className="flex items-center gap-2 text-[13px] text-[#374151]">
                        <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full"></div>
                        Has attendance records
                      </li>
                    )}
                    {deleteWarning.hasAssessments && (
                      <li className="flex items-center gap-2 text-[13px] text-[#374151]">
                        <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full"></div>
                        Has assessment records
                      </li>
                    )}
                  </ul>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] p-3 text-[12px] text-[#374151]">
                    <p>Instead of deleting, you can:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Mark it as inactive</li>
                      <li>Archive it for future reference</li>
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
