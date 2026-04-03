import { Users, UserCheck, Calendar, Award, AlertTriangle, TrendingUp, TrendingDown, BookOpen, Target, BarChart3 } from 'lucide-react';

export function StudentDashboard() {
  // Mock data - would come from API/database
  const summaryStats = [
    {
      label: 'Total Students',
      value: '1,248',
      trend: '+42',
      trendUp: true,
      icon: Users,
      description: 'All enrolled students',
    },
    {
      label: 'Active Students',
      value: '1,235',
      trend: '+38',
      trendUp: true,
      icon: UserCheck,
      description: 'Currently active',
    },
    {
      label: 'Average Attendance',
      value: '87.3%',
      trend: '+2.1%',
      trendUp: true,
      icon: Calendar,
      description: 'Overall attendance',
    },
    {
      label: 'Average GPA',
      value: '7.8',
      trend: '+0.3',
      trendUp: true,
      icon: Award,
      description: 'Overall performance',
    },
    {
      label: 'Students at Risk',
      value: '14',
      trend: '-3',
      trendUp: true,
      icon: AlertTriangle,
      description: 'Require attention',
      isRisk: true,
    },
  ];

  const performanceMetrics = [
    {
      label: 'Assessment Completion',
      value: '92.4%',
      change: '+3.2%',
      positive: true,
      icon: BookOpen,
    },
    {
      label: 'Engagement Score',
      value: '85.6%',
      change: '+1.8%',
      positive: true,
      icon: Target,
    },
    {
      label: 'Pass Rate (Current Term)',
      value: '94.7%',
      change: '+2.5%',
      positive: true,
      icon: Award,
    },
    {
      label: 'Academic Insights Generated',
      value: '342',
      change: '+68',
      positive: true,
      icon: BarChart3,
    },
  ];

  const batchPerformance = [
    { batch: 'CS-A3', students: 65, avgGPA: 8.2, attendance: 89.5, atRisk: 2 },
    { batch: 'CS-B3', students: 64, avgGPA: 7.9, attendance: 87.3, atRisk: 3 },
    { batch: 'ECE-A2', students: 72, avgGPA: 8.0, attendance: 88.1, atRisk: 1 },
    { batch: 'ECE-B2', students: 70, avgGPA: 7.6, attendance: 86.2, atRisk: 4 },
    { batch: 'ME-A1', students: 68, avgGPA: 7.8, attendance: 87.9, atRisk: 2 },
    { batch: 'ME-B1', students: 67, avgGPA: 7.5, attendance: 85.4, atRisk: 2 },
  ];

  const recentAlerts = [
    { message: 'Rahul Kumar (CS-A3-003) - Attendance dropped below 70%', severity: 'high', time: '2 hours ago' },
    { message: 'Batch CS-B3 assessment completion deadline approaching', severity: 'medium', time: '5 hours ago' },
    { message: '3 students missed multiple consecutive classes', severity: 'high', time: '1 day ago' },
    { message: 'End-term examination schedule published', severity: 'low', time: '2 days ago' },
    { message: 'Parent-teacher meeting scheduled for next week', severity: 'medium', time: '3 days ago' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">Student Dashboard</h1>
        <p className="text-[13px] text-[#6b7280]">
          Monitor student performance, attendance, and engagement
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {summaryStats.map((stat) => (
          <div 
            key={stat.label} 
            className={`bg-white border p-6 ${
              stat.isRisk ? 'border-[#f59e0b]' : 'border-[#d1d5db]'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#f3f4f6] flex items-center justify-center">
                <stat.icon className={`w-6 h-6 ${
                  stat.isRisk ? 'text-[#dc2626]' : 'text-[#374151]'
                }`} />
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-[12px] ${
                  stat.trendUp ? 'text-[#059669]' : 'text-[#dc2626]'
                }`}>
                  {stat.trendUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{stat.trend}</span>
                </div>
              )}
            </div>
            <div className={`text-[32px] mb-1 leading-none ${
              stat.isRisk ? 'text-[#dc2626]' : 'text-[#111827]'
            }`}>
              {stat.value}
            </div>
            <div className="text-[12px] text-[#374151] mb-1">{stat.label}</div>
            <div className="text-[11px] text-[#9ca3af]">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-[16px] text-[#111827] mb-4">Performance & Engagement Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric) => (
            <div key={metric.label} className="bg-white border border-[#d1d5db] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#f3f4f6] flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-[#374151]" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">
                    {metric.label}
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-[28px] text-[#111827] leading-none">
                  {metric.value}
                </div>
                <div className={`text-[12px] ${
                  metric.positive ? 'text-[#059669]' : 'text-[#dc2626]'
                }`}>
                  {metric.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Performance & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Performance Table */}
        <div className="lg:col-span-2 bg-white border border-[#d1d5db]">
          <div className="p-5 border-b border-[#e5e7eb]">
            <h2 className="text-[15px] text-[#111827]">Batch Performance Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Batch
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Students
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Avg GPA
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Attendance
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    At Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {batchPerformance.map((batch) => (
                  <tr key={batch.batch} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                    <td className="px-5 py-3 text-[13px] text-[#111827]">{batch.batch}</td>
                    <td className="px-5 py-3 text-[13px] text-[#374151] text-center">{batch.students}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[13px] ${
                        batch.avgGPA >= 8.0 ? 'text-[#059669]' : batch.avgGPA >= 7.5 ? 'text-[#d97706]' : 'text-[#dc2626]'
                      }`}>
                        {batch.avgGPA.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[13px] ${
                        batch.attendance >= 87 ? 'text-[#059669]' : batch.attendance >= 85 ? 'text-[#d97706]' : 'text-[#dc2626]'
                      }`}>
                        {batch.attendance}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[13px] ${
                        batch.atRisk === 0 ? 'text-[#059669]' : batch.atRisk <= 2 ? 'text-[#d97706]' : 'text-[#dc2626]'
                      }`}>
                        {batch.atRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white border border-[#d1d5db]">
          <div className="p-5 border-b border-[#e5e7eb]">
            <h2 className="text-[15px] text-[#111827]">Recent Alerts</h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    alert.severity === 'high' ? 'bg-[#dc2626]' : 
                    alert.severity === 'medium' ? 'bg-[#d97706]' : 
                    'bg-[#6b7280]'
                  }`}></div>
                  <div>
                    <p className="text-[13px] text-[#111827] mb-1">{alert.message}</p>
                    <p className="text-[11px] text-[#9ca3af]">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
