import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export function Analytics() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">Performance & Analytics</h1>
        <p className="text-[13px] text-[#6b7280]">Institutional analytics with predictive AI insights</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Institutional GPA</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] text-[#111827]">7.84</p>
            <span className="text-[12px] text-[#059669] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +0.12
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Avg. Attendance</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] text-[#111827]">87.3%</p>
            <span className="text-[12px] text-[#dc2626] flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -2.1%
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Content Engagement</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] text-[#111827]">72%</p>
            <span className="text-[12px] text-[#059669] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +5.3%
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Pass Rate</p>
          <p className="text-[28px] text-[#111827]">94.2%</p>
        </div>
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Batch Performance */}
        <div className="col-span-2 bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">Batch Performance Comparison</h2>
          <div className="space-y-3">
            {[
              { batch: 'CS-A3', gpa: 8.2, attendance: 92, engagement: 78 },
              { batch: 'CS-B3', gpa: 7.8, attendance: 85, engagement: 71 },
              { batch: 'ECE-A2', gpa: 8.0, attendance: 89, engagement: 75 },
              { batch: 'ECE-B2', gpa: 7.5, attendance: 82, engagement: 68 },
              { batch: 'MECH-A1', gpa: 7.2, attendance: 79, engagement: 65 },
            ].map((batch, i) => (
              <div key={i} className="border border-[#e5e7eb] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[14px] text-[#111827]">{batch.batch}</span>
                  <span className="text-[13px] text-[#6b7280]">GPA: {batch.gpa}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-[11px] text-[#6b7280] mb-1">
                      <span>Attendance</span>
                      <span>{batch.attendance}%</span>
                    </div>
                    <div className="h-2 bg-[#e5e7eb]">
                      <div className="h-full bg-[#3b82f6]" style={{ width: `${batch.attendance}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-[#6b7280] mb-1">
                      <span>Engagement</span>
                      <span>{batch.engagement}%</span>
                    </div>
                    <div className="h-2 bg-[#e5e7eb]">
                      <div className="h-full bg-[#059669]" style={{ width: `${batch.engagement}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">AI Predictive Insights</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-[#dc2626] pl-4 py-2">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#6b7280] uppercase tracking-wider">High Risk</span>
              </div>
              <p className="text-[13px] text-[#374151]">14 students at dropout risk based on attendance and performance trends</p>
            </div>
            <div className="border-l-2 border-[#f59e0b] pl-4 py-2">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#6b7280] uppercase tracking-wider">Warning</span>
              </div>
              <p className="text-[13px] text-[#374151]">CS-302: Student engagement decreased by 12% in last 2 weeks</p>
            </div>
            <div className="border-l-2 border-[#3b82f6] pl-4 py-2">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#6b7280] uppercase tracking-wider">Insight</span>
              </div>
              <p className="text-[13px] text-[#374151]">Faculty Dr. Sharma's teaching methods showing 18% higher engagement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white border border-[#d1d5db] p-6 mb-6">
        <h2 className="text-[15px] text-[#111827] mb-4">Subject-wise Performance</h2>
        <table className="w-full">
          <thead className="bg-[#f9fafb] border-b border-[#d1d5db]">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Code</th>
              <th className="px-4 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">Students</th>
              <th className="px-4 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">Avg. Score</th>
              <th className="px-4 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">Pass Rate</th>
              <th className="px-4 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">Engagement</th>
              <th className="px-4 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody>
            {[
              { subject: 'Data Structures', code: 'CS-301', students: 118, score: 82, pass: 96, engagement: 84, trend: 'up' },
              { subject: 'Operating Systems', code: 'CS-302', students: 118, score: 78, pass: 92, engagement: 76, trend: 'down' },
              { subject: 'Database Systems', code: 'CS-303', students: 118, score: 85, pass: 98, engagement: 88, trend: 'up' },
              { subject: 'Digital Signal Processing', code: 'EC-201', students: 48, score: 79, pass: 94, engagement: 81, trend: 'neutral' },
            ].map((subject, i) => (
              <tr key={i} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                <td className="px-4 py-3 text-[13px] text-[#374151]">{subject.subject}</td>
                <td className="px-4 py-3 text-[13px] text-[#6b7280]">{subject.code}</td>
                <td className="px-4 py-3 text-center text-[13px] text-[#374151]">{subject.students}</td>
                <td className="px-4 py-3 text-center text-[13px] text-[#374151]">{subject.score}%</td>
                <td className="px-4 py-3 text-center text-[13px] text-[#374151]">{subject.pass}%</td>
                <td className="px-4 py-3 text-center text-[13px] text-[#374151]">{subject.engagement}%</td>
                <td className="px-4 py-3 text-center">
                  {subject.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-[#059669] mx-auto" />
                  ) : subject.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-[#dc2626] mx-auto" />
                  ) : (
                    <div className="w-1 h-1 bg-[#6b7280] rounded-full mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Options */}
      <div className="flex justify-end">
        <button className="px-4 py-2 border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors text-[13px] text-[#374151]">
          Export Full Report
        </button>
      </div>
    </div>
  );
}
