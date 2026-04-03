import { BarChart3, TrendingUp, Users, Activity, Brain, Download } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const platformGrowthData = [
  { month: "Jul", institutions: 380, users: 142000, aiRequests: 1200000 },
  { month: "Aug", institutions: 392, users: 151000, aiRequests: 1350000 },
  { month: "Sep", institutions: 404, users: 163000, aiRequests: 1580000 },
  { month: "Oct", institutions: 418, users: 178000, aiRequests: 1820000 },
  { month: "Nov", institutions: 431, users: 192000, aiRequests: 2100000 },
  { month: "Dec", institutions: 448, users: 208000, aiRequests: 2450000 },
];

const featureAdoptionData = [
  { feature: "AI Content Scoring", adoption: 87 },
  { feature: "Attendance Tracking", adoption: 92 },
  { feature: "Timetable Management", adoption: 78 },
  { feature: "Research Tracking", adoption: 64 },
  { feature: "Analytics Dashboard", adoption: 81 },
  { feature: "Report Generation", adoption: 73 },
];

const engagementTrendData = [
  { week: "Week 1", dau: 42000, mau: 185000, sessions: 156000 },
  { week: "Week 2", dau: 45000, mau: 192000, sessions: 168000 },
  { week: "Week 3", dau: 48000, mau: 198000, sessions: 182000 },
  { week: "Week 4", dau: 52000, mau: 208000, sessions: 195000 },
];

const planDistribution = [
  { name: "Enterprise", value: 42, color: "#1e40af" },
  { name: "Pro", value: 128, color: "#3b82f6" },
  { name: "Starter", value: 234, color: "#93c5fd" },
  { name: "Trial", value: 44, color: "#dbeafe" },
];

const aiROIData = [
  { module: "Content Scoring", requestsCost: 15000, valueSaved: 48000, roi: 320 },
  { module: "Risk Prediction", requestsCost: 8000, valueSaved: 32000, roi: 400 },
  { module: "Performance Analytics", requestsCost: 12000, valueSaved: 28000, roi: 233 },
  { module: "Anomaly Detection", requestsCost: 6000, valueSaved: 18000, roi: 300 },
];

export function Analytics() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8]">
      {/* Header */}
      <div className="p-6 border-b border-[#e8eaed] bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[#1f2937] mb-1">Analytics & Intelligence</h1>
              <p className="text-[13px] text-[#6b7280]">Executive-level insights and platform metrics</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export Report
              </button>
              <select className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                <option>Last 6 Months</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Total Users</span>
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">208K</div>
              <div className="text-[11px] text-emerald-700 font-medium">+14.2% MoM</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Daily Active Users</span>
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">52K</div>
              <div className="text-[11px] text-emerald-700 font-medium">+8.3% MoM</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">AI Requests (30d)</span>
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">2.45M</div>
              <div className="text-[11px] text-emerald-700 font-medium">+16.7% MoM</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Platform Growth</span>
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">448</div>
              <div className="text-[11px] text-[#6b7280]">Active Institutions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Analytics */}
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-5">
          {/* Platform Growth */}
          <div className="bg-white border border-[#e8eaed] rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[#1f2937] mb-0.5">Platform Growth Trajectory</h2>
                <p className="text-[12px] text-[#6b7280]">Institution count, user base, and AI request volume</p>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={platformGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed", borderRadius: "6px", fontSize: "12px" }}
                  labelStyle={{ color: "#1f2937" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="institutions" stroke="#1e40af" strokeWidth={2} name="Institutions" />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Users (scaled)" />
                <Line type="monotone" dataKey="aiRequests" stroke="#93c5fd" strokeWidth={2} name="AI Requests (scaled)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Feature Adoption & Plan Distribution */}
          <div className="grid grid-cols-3 gap-5">
            {/* Feature Adoption */}
            <div className="col-span-2 bg-white border border-[#e8eaed] rounded p-5">
              <div className="mb-4">
                <h2 className="text-[#1f2937] mb-0.5">Feature Adoption Rate</h2>
                <p className="text-[12px] text-[#6b7280]">Percentage of institutions using each feature</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={featureAdoptionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                  <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" fontSize={11} />
                  <YAxis dataKey="feature" type="category" stroke="#9ca3af" fontSize={11} width={140} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed", borderRadius: "6px", fontSize: "12px" }}
                    labelStyle={{ color: "#1f2937" }}
                    formatter={(value) => [`${value}%`, "Adoption"]}
                  />
                  <Bar dataKey="adoption" fill="#1e40af" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Plan Distribution */}
            <div className="bg-white border border-[#e8eaed] rounded p-5">
              <div className="mb-4">
                <h2 className="text-[#1f2937] mb-0.5">Plan Distribution</h2>
                <p className="text-[12px] text-[#6b7280]">Institution breakdown by plan</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed", borderRadius: "6px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {planDistribution.map((plan) => (
                  <div key={plan.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: plan.color }} />
                      <span className="text-[#6b7280]">{plan.name}</span>
                    </div>
                    <span className="text-[#1f2937] font-medium">{plan.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Engagement Trends */}
          <div className="bg-white border border-[#e8eaed] rounded p-5">
            <div className="mb-4">
              <h2 className="text-[#1f2937] mb-0.5">User Engagement Trends</h2>
              <p className="text-[12px] text-[#6b7280]">Daily active users, monthly active users, and session count</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={engagementTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed", borderRadius: "6px", fontSize: "12px" }}
                  labelStyle={{ color: "#1f2937" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="dau" stackId="1" stroke="#1e40af" fill="#1e40af" fillOpacity={0.6} name="DAU" />
                <Area type="monotone" dataKey="mau" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} name="MAU (scaled)" />
                <Area type="monotone" dataKey="sessions" stackId="3" stroke="#93c5fd" fill="#93c5fd" fillOpacity={0.3} name="Sessions (scaled)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI ROI Analysis */}
          <div className="bg-white border border-[#e8eaed] rounded p-5">
            <div className="mb-4">
              <h2 className="text-[#1f2937] mb-0.5">AI Module ROI Analysis</h2>
              <p className="text-[12px] text-[#6b7280]">Return on investment for AI-powered features</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fafbfc] border-b border-[#e8eaed]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">AI Module</th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">Monthly Cost</th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">Value Delivered</th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">ROI</th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8eaed]">
                  {aiROIData.map((item) => (
                    <tr key={item.module} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-4 py-3 text-[13px] text-[#1f2937] font-medium">{item.module}</td>
                      <td className="px-4 py-3 text-right text-[13px] text-[#6b7280]">${item.requestsCost.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-[13px] text-emerald-700 font-medium">${item.valueSaved.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-[13px] text-[#1f2937] font-semibold">{item.roi}%</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-1.5 bg-[#e8eaed] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-600" 
                              style={{ width: `${Math.min(item.roi / 4, 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-[#6b7280] w-12">{Math.min(item.roi / 4, 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
