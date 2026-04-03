import { Activity, Building2, Users, Cpu, TrendingUp, AlertCircle } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const kpiData = [
  { label: "Active Institutions", value: "1,247", change: "+12.3%", trend: "up", icon: Building2 },
  { label: "Active Users", value: "89,342", change: "+8.7%", trend: "up", icon: Users },
  { label: "AI Usage Load", value: "72%", change: "+5.2%", trend: "up", icon: Cpu },
  { label: "System Health", value: "99.8%", change: "0.0%", trend: "stable", icon: Activity },
];

const institutionGrowthData = [
  { month: "Jul", count: 980 },
  { month: "Aug", count: 1025 },
  { month: "Sep", count: 1098 },
  { month: "Oct", count: 1156 },
  { month: "Nov", count: 1203 },
  { month: "Dec", count: 1247 },
];

const featureUsageData = [
  { feature: "AI Tutoring", usage: 89 },
  { feature: "Assessments", usage: 76 },
  { feature: "Analytics", usage: 68 },
  { feature: "Collaboration", usage: 54 },
  { feature: "Content Library", usage: 82 },
];

const alerts = [
  { id: 1, type: "warning", message: "Institution #4523 approaching usage limit", time: "2m ago" },
  { id: 2, type: "info", message: "System maintenance scheduled for Jan 2, 03:00 UTC", time: "15m ago" },
  { id: 3, type: "critical", message: "Failed login attempts spike detected for admin@edu-tech.com", time: "1h ago" },
  { id: 4, type: "info", message: "New institution onboarded: Harvard Extension School", time: "2h ago" },
];

export function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8] p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#1f2937] mb-1">System Overview</h1>
            <p className="text-[13px] text-[#6b7280]">Real-time monitoring and control center</p>
          </div>
          <div className="text-[12px] text-[#9ca3af]">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white border border-[#e8eaed] rounded p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 bg-[#f5f6f8] rounded flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#1e40af]" />
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    kpi.trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-[#6b7280]"
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <div className="text-[24px] text-[#1f2937] mb-1 font-semibold tracking-tight">{kpi.value}</div>
                <div className="text-[12px] text-[#6b7280]">{kpi.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Institution Growth Chart */}
          <div className="col-span-2 bg-white border border-[#e8eaed] rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[#1f2937] mb-1">Institution Growth</h2>
                <p className="text-[12px] text-[#6b7280]">Last 6 months</p>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={institutionGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed", borderRadius: "6px", fontSize: "12px" }}
                  labelStyle={{ color: "#1f2937" }}
                />
                <Area type="monotone" dataKey="count" stroke="#1e40af" fill="#1e40af" fillOpacity={0.08} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Live Alerts */}
          <div className="bg-white border border-[#e8eaed] rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#1f2937]">Live Alerts</h2>
              <AlertCircle className="w-4 h-4 text-[#6b7280]" />
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="border-l-2 border-[#e8eaed] pl-3 py-1.5">
                  <div className={`flex items-start gap-2 ${
                    alert.type === "critical" ? "text-red-700" :
                    alert.type === "warning" ? "text-amber-700" :
                    "text-[#1e40af]"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                      alert.type === "critical" ? "bg-red-600" :
                      alert.type === "warning" ? "bg-amber-600" :
                      "bg-[#1e40af]"
                    }`} />
                    <div className="flex-1">
                      <p className="text-[12px] text-[#1f2937] leading-snug">{alert.message}</p>
                      <span className="text-[11px] text-[#9ca3af] mt-0.5 block">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Usage & System Uptime */}
        <div className="grid grid-cols-3 gap-5">
          {/* Feature Usage Heatmap */}
          <div className="col-span-2 bg-white border border-[#e8eaed] rounded p-5">
            <h2 className="text-[#1f2937] mb-4">Feature Usage Distribution</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={featureUsageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                <XAxis type="number" stroke="#9ca3af" fontSize={11} />
                <YAxis dataKey="feature" type="category" stroke="#9ca3af" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed", borderRadius: "6px", fontSize: "12px" }}
                  labelStyle={{ color: "#1f2937" }}
                />
                <Bar dataKey="usage" fill="#1e40af" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* System Uptime */}
          <div className="bg-white border border-[#e8eaed] rounded p-5">
            <h2 className="text-[#1f2937] mb-4">System Uptime</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[12px] text-[#6b7280]">Current Period</span>
                  <span className="text-[12px] text-emerald-700 font-medium">99.8%</span>
                </div>
                <div className="w-full h-1.5 bg-[#f5f6f8] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: "99.8%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[12px] text-[#6b7280]">30-Day Average</span>
                  <span className="text-[12px] text-emerald-700 font-medium">99.9%</span>
                </div>
                <div className="w-full h-1.5 bg-[#f5f6f8] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: "99.9%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[12px] text-[#6b7280]">90-Day Average</span>
                  <span className="text-[12px] text-emerald-700 font-medium">99.7%</span>
                </div>
                <div className="w-full h-1.5 bg-[#f5f6f8] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: "99.7%" }} />
                </div>
              </div>
              <div className="pt-3 border-t border-[#e8eaed]">
                <div className="text-[12px] text-[#6b7280] mb-0.5">Last Incident</div>
                <div className="text-[12px] text-[#1f2937]">Dec 15, 2025 - 14:22 UTC</div>
                <div className="text-[11px] text-[#9ca3af] mt-0.5">Duration: 4m 32s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}