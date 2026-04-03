import { TrendingDown, TrendingUp } from 'lucide-react';
import { useStaffDashboardData } from '../../hooks/useStaffDashboardData';

export function StaffDashboard() {
  const {
    summaryStats,
    operationalMetrics,
    departmentPerformance,
    recentActivities,
  } = useStaffDashboardData();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">Staff Dashboard</h1>
        <p className="text-[13px] text-[#6b7280]">
          Overview of administrative and operational staff performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white border border-[#d1d5db] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#f3f4f6] flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-[#374151]" />
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
            <div className="text-[32px] text-[#111827] mb-1 leading-none">
              {stat.value}
            </div>
            <div className="text-[12px] text-[#374151] mb-1">{stat.label}</div>
            <div className="text-[11px] text-[#9ca3af]">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Engagement & Operations Metrics */}
      <div className="mb-8">
        <h2 className="text-[16px] text-[#111827] mb-4">Operations & Engagement Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {operationalMetrics.map((metric) => (
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

      {/* Department Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance Table */}
        <div className="lg:col-span-2 bg-white border border-[#d1d5db]">
          <div className="p-5 border-b border-[#e5e7eb]">
            <h2 className="text-[15px] text-[#111827]">Department Performance Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Department
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Staff Count
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Task Completion
                  </th>
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody>
                {departmentPerformance.map((dept) => (
                  <tr key={dept.dept} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                    <td className="px-5 py-3 text-[13px] text-[#111827]">{dept.dept}</td>
                    <td className="px-5 py-3 text-[13px] text-[#374151] text-center">{dept.staff}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[13px] ${
                        dept.completion >= 95 ? 'text-[#059669]' : dept.completion >= 90 ? 'text-[#d97706]' : 'text-[#dc2626]'
                      }`}>
                        {dept.completion}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[13px] ${
                        dept.attendance >= 97 ? 'text-[#059669]' : dept.attendance >= 95 ? 'text-[#d97706]' : 'text-[#dc2626]'
                      }`}>
                        {dept.attendance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white border border-[#d1d5db]">
          <div className="p-5 border-b border-[#e5e7eb]">
            <h2 className="text-[15px] text-[#111827]">Recent Activities</h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 bg-[#111827] rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-[13px] text-[#111827] mb-1">{activity.activity}</p>
                    <p className="text-[11px] text-[#9ca3af]">{activity.time}</p>
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
