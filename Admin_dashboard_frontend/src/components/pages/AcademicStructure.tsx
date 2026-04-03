import { useState } from 'react';
import { Plus, ChevronRight, Edit2, Users } from 'lucide-react';

interface Stream {
  id: string;
  name: string;
  code: string;
  batches: Batch[];
}

interface Batch {
  id: string;
  name: string;
  capacity: number;
  enrolled: number;
  subjects: Subject[];
}

interface Subject {
  id: string;
  name: string;
  code: string;
  faculty: string;
  credits: number;
}

export function AcademicStructure() {
  const [expandedStreams, setExpandedStreams] = useState<string[]>(['stream-1']);
  const [expandedBatches, setExpandedBatches] = useState<string[]>([]);

  const streams: Stream[] = [
    {
      id: 'stream-1',
      name: 'Computer Science & Engineering',
      code: 'CSE',
      batches: [
        {
          id: 'batch-1',
          name: 'CS-A3 (2023-2024)',
          capacity: 60,
          enrolled: 58,
          subjects: [
            { id: 'sub-1', name: 'Data Structures', code: 'CS-301', faculty: 'Dr. Sharma', credits: 4 },
            { id: 'sub-2', name: 'Operating Systems', code: 'CS-302', faculty: 'Prof. Kumar', credits: 4 },
            { id: 'sub-3', name: 'Database Systems', code: 'CS-303', faculty: 'Dr. Patel', credits: 3 },
          ],
        },
        {
          id: 'batch-2',
          name: 'CS-B3 (2023-2024)',
          capacity: 60,
          enrolled: 55,
          subjects: [
            { id: 'sub-4', name: 'Data Structures', code: 'CS-301', faculty: 'Dr. Sharma', credits: 4 },
            { id: 'sub-5', name: 'Operating Systems', code: 'CS-302', faculty: 'Not Assigned', credits: 4 },
          ],
        },
      ],
    },
    {
      id: 'stream-2',
      name: 'Electronics & Communication',
      code: 'ECE',
      batches: [
        {
          id: 'batch-3',
          name: 'ECE-A2 (2022-2023)',
          capacity: 50,
          enrolled: 48,
          subjects: [
            { id: 'sub-6', name: 'Digital Signal Processing', code: 'EC-201', faculty: 'Dr. Rao', credits: 4 },
            { id: 'sub-7', name: 'Communication Systems', code: 'EC-202', faculty: 'Prof. Singh', credits: 3 },
          ],
        },
      ],
    },
  ];

  const toggleStream = (id: string) => {
    setExpandedStreams(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleBatch = (id: string) => {
    setExpandedBatches(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] text-[#111827] mb-1">Academic Structure</h1>
          <p className="text-[13px] text-[#6b7280]">Manage streams, batches, subjects, and faculty allocation</p>
        </div>
        <button className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Stream
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Streams</p>
          <p className="text-[28px] text-[#111827]">{streams.length}</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Active Batches</p>
          <p className="text-[28px] text-[#111827]">
            {streams.reduce((acc, s) => acc + s.batches.length, 0)}
          </p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Subjects</p>
          <p className="text-[28px] text-[#111827]">
            {streams.reduce((acc, s) => acc + s.batches.reduce((a, b) => a + b.subjects.length, 0), 0)}
          </p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Enrollment Rate</p>
          <p className="text-[28px] text-[#111827]">94%</p>
        </div>
      </div>

      {/* Hierarchical Structure */}
      <div className="bg-white border border-[#d1d5db]">
        {streams.map((stream) => (
          <div key={stream.id} className="border-b border-[#e5e7eb] last:border-b-0">
            {/* Stream Level */}
            <div
              className="px-6 py-4 flex items-center justify-between hover:bg-[#f9fafb] cursor-pointer"
              onClick={() => toggleStream(stream.id)}
            >
              <div className="flex items-center gap-4">
                <ChevronRight
                  className={`w-5 h-5 text-[#6b7280] transition-transform ${
                    expandedStreams.includes(stream.id) ? 'rotate-90' : ''
                  }`}
                />
                <div>
                  <h3 className="text-[15px] text-[#111827]">{stream.name}</h3>
                  <p className="text-[12px] text-[#6b7280] mt-0.5">Code: {stream.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[12px] text-[#6b7280]">Batches</p>
                  <p className="text-[15px] text-[#111827]">{stream.batches.length}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-3 py-1.5 border border-[#d1d5db] hover:bg-white transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-[#6b7280]" />
                </button>
              </div>
            </div>

            {/* Batches */}
            {expandedStreams.includes(stream.id) && (
              <div className="bg-[#f9fafb]">
                {stream.batches.map((batch) => (
                  <div key={batch.id} className="border-t border-[#e5e7eb]">
                    {/* Batch Level */}
                    <div
                      className="px-6 pl-16 py-3 flex items-center justify-between hover:bg-[#f3f4f6] cursor-pointer"
                      onClick={() => toggleBatch(batch.id)}
                    >
                      <div className="flex items-center gap-4">
                        <ChevronRight
                          className={`w-4 h-4 text-[#6b7280] transition-transform ${
                            expandedBatches.includes(batch.id) ? 'rotate-90' : ''
                          }`}
                        />
                        <div>
                          <p className="text-[14px] text-[#111827]">{batch.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[11px] text-[#6b7280]">
                              <Users className="w-3 h-3 inline mr-1" />
                              {batch.enrolled}/{batch.capacity}
                            </span>
                            <span className="text-[11px] text-[#6b7280]">
                              {batch.subjects.length} subjects
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="px-3 py-1.5 border border-[#d1d5db] hover:bg-white transition-colors text-[12px]"
                      >
                        Manage
                      </button>
                    </div>

                    {/* Subjects */}
                    {expandedBatches.includes(batch.id) && (
                      <div className="bg-white border-t border-[#e5e7eb]">
                        <table className="w-full">
                          <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                            <tr>
                              <th className="px-6 pl-24 py-2 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                                Subject
                              </th>
                              <th className="px-6 py-2 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                                Code
                              </th>
                              <th className="px-6 py-2 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                                Faculty
                              </th>
                              <th className="px-6 py-2 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                                Credits
                              </th>
                              <th className="px-6 py-2 text-right text-[11px] text-[#6b7280] uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {batch.subjects.map((subject) => (
                              <tr key={subject.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                                <td className="px-6 pl-24 py-3 text-[13px] text-[#374151]">{subject.name}</td>
                                <td className="px-6 py-3 text-[13px] text-[#374151]">{subject.code}</td>
                                <td className="px-6 py-3 text-[13px] text-[#374151]">
                                  <span
                                    className={
                                      subject.faculty === 'Not Assigned'
                                        ? 'text-[#dc2626]'
                                        : ''
                                    }
                                  >
                                    {subject.faculty}
                                  </span>
                                </td>
                                <td className="px-6 py-3 text-[13px] text-[#374151]">{subject.credits}</td>
                                <td className="px-6 py-3 text-right">
                                  <button className="text-[12px] text-[#3b82f6] hover:underline">
                                    Assign Faculty
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
                <div className="px-6 pl-16 py-3">
                  <button className="text-[13px] text-[#3b82f6] hover:underline flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Batch
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
