import { Trophy, TrendingUp, Globe } from 'lucide-react';

export function TowsothGlobal() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-[#374151]" />
          <h1 className="text-[20px] text-[#111827]">Towsoth Global</h1>
          <span className="px-2 py-0.5 bg-[#e0e7ff] border border-[#a5b4fc] text-[#4f46e5] text-[11px]">READ-ONLY</span>
        </div>
        <p className="text-[13px] text-[#6b7280]">Cross-institution benchmarks and global rankings</p>
      </div>

      {/* Institution Rank Card */}
      <div className="bg-white border-2 border-[#3b82f6] p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">Global Institution Rank</p>
            <div className="flex items-baseline gap-3">
              <p className="text-[48px] text-[#111827] leading-none">#247</p>
              <div className="flex items-center gap-1 text-[#059669]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[14px]">+12 positions</span>
              </div>
            </div>
            <p className="text-[13px] text-[#6b7280] mt-2">Out of 4,823 institutions worldwide</p>
          </div>
          <div className="text-right">
            <Trophy className="w-16 h-16 text-[#f59e0b] mb-2" />
            <p className="text-[12px] text-[#6b7280]">Top 6% Globally</p>
          </div>
        </div>
      </div>

      {/* Rankings Breakdown */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Academic Performance</p>
          <p className="text-[28px] text-[#111827]">#182</p>
          <p className="text-[11px] text-[#059669] mt-1">+8 positions</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Student Engagement</p>
          <p className="text-[28px] text-[#111827]">#315</p>
          <p className="text-[11px] text-[#dc2626] mt-1">-5 positions</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Faculty Quality</p>
          <p className="text-[28px] text-[#111827]">#209</p>
          <p className="text-[11px] text-[#059669] mt-1">+3 positions</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Infrastructure</p>
          <p className="text-[28px] text-[#111827]">#421</p>
          <p className="text-[11px] text-[#6b7280] mt-1">No change</p>
        </div>
      </div>

      {/* Peer Benchmarks */}
      <div className="bg-white border border-[#d1d5db] p-6 mb-6">
        <h2 className="text-[15px] text-[#111827] mb-4">Peer Institution Benchmarks</h2>
        <table className="w-full">
          <thead className="bg-[#f9fafb] border-b border-[#d1d5db]">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Metric</th>
              <th className="px-4 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">Your Institution</th>
              <th className="px-4 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">Peer Average</th>
              <th className="px-4 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">Top 10%</th>
              <th className="px-4 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">Difference</th>
            </tr>
          </thead>
          <tbody>
            {[
              { metric: 'Average GPA', yours: 7.84, peer: 7.52, top: 8.45, diff: '+0.32' },
              { metric: 'Attendance Rate', yours: 87.3, peer: 84.2, top: 92.1, diff: '+3.1' },
              { metric: 'Pass Rate', yours: 94.2, peer: 91.8, top: 97.3, diff: '+2.4' },
              { metric: 'Content Engagement', yours: 72.0, peer: 78.5, top: 89.2, diff: '-6.5' },
              { metric: 'Faculty-Student Ratio', yours: 14.8, peer: 16.2, top: 12.5, diff: '-1.4' },
            ].map((row, i) => (
              <tr key={i} className="border-b border-[#e5e7eb]">
                <td className="px-4 py-3 text-[13px] text-[#374151]">{row.metric}</td>
                <td className="px-4 py-3 text-center text-[13px] text-[#111827]">{row.yours}</td>
                <td className="px-4 py-3 text-center text-[13px] text-[#6b7280]">{row.peer}</td>
                <td className="px-4 py-3 text-center text-[13px] text-[#6b7280]">{row.top}</td>
                <td className="px-4 py-3 text-center text-[13px]">
                  <span className={row.diff.startsWith('+') ? 'text-[#059669]' : 'text-[#dc2626]'}>{row.diff}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">Global Platform Statistics</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-[#e5e7eb]">
              <span className="text-[13px] text-[#374151]">Total Institutions</span>
              <span className="text-[15px] text-[#111827]">4,823</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e5e7eb]">
              <span className="text-[13px] text-[#374151]">Total Students</span>
              <span className="text-[15px] text-[#111827]">2.4M</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e5e7eb]">
              <span className="text-[13px] text-[#374151]">Total Faculty</span>
              <span className="text-[15px] text-[#111827]">187K</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e5e7eb]">
              <span className="text-[13px] text-[#374151]">Countries</span>
              <span className="text-[15px] text-[#111827]">87</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#d1d5db] p-6">
          <h2 className="text-[15px] text-[#111827] mb-4">Regional Rank</h2>
          <div className="space-y-3">
            <div className="border border-[#e5e7eb] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#374151]">Asia-Pacific Region</span>
                <span className="text-[15px] text-[#111827]">#42</span>
              </div>
              <p className="text-[11px] text-[#6b7280]">Out of 1,243 institutions</p>
            </div>
            <div className="border border-[#e5e7eb] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#374151]">National Rank (India)</span>
                <span className="text-[15px] text-[#111827]">#18</span>
              </div>
              <p className="text-[11px] text-[#6b7280]">Out of 412 institutions</p>
            </div>
            <div className="border border-[#e5e7eb] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#374151]">State Rank</span>
                <span className="text-[15px] text-[#111827]">#3</span>
              </div>
              <p className="text-[11px] text-[#6b7280]">Out of 87 institutions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
