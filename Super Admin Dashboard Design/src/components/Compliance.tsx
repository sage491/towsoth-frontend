import { Shield, FileText, Download, Search, Calendar, Filter, CheckCircle2, AlertTriangle, Database, Lock, Eye } from "lucide-react";
import { useState } from "react";

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  institution: string;
  ipAddress: string;
  status: "success" | "warning" | "error";
}

const auditLogs: AuditLog[] = [
  { id: 1, timestamp: "2025-12-29 14:23:15", user: "admin@platform.com", action: "Institution Suspended", resource: "Institution #1042", institution: "Stanford University", ipAddress: "192.168.1.1", status: "success" },
  { id: 2, timestamp: "2025-12-29 14:15:42", user: "admin@platform.com", action: "Plan Changed", resource: "Institution #1038", institution: "Harvard University", ipAddress: "192.168.1.1", status: "success" },
  { id: 3, timestamp: "2025-12-29 13:58:20", user: "admin@platform.com", action: "Feature Disabled", resource: "AI Module: Content Scoring", institution: "MIT", ipAddress: "192.168.1.1", status: "success" },
  { id: 4, timestamp: "2025-12-29 13:45:12", user: "system@platform.com", action: "Data Export", resource: "User Data (GDPR)", institution: "UC Berkeley", ipAddress: "SYSTEM", status: "success" },
  { id: 5, timestamp: "2025-12-29 13:32:08", user: "admin@platform.com", action: "Permission Updated", resource: "Role: Faculty", institution: "Platform-wide", ipAddress: "192.168.1.1", status: "success" },
  { id: 6, timestamp: "2025-12-29 13:18:45", user: "admin@platform.com", action: "User Account Suspended", resource: "User #8472", institution: "University of Chicago", ipAddress: "192.168.1.1", status: "warning" },
  { id: 7, timestamp: "2025-12-29 12:55:33", user: "system@platform.com", action: "Backup Created", resource: "Full Platform Backup", institution: "Platform-wide", ipAddress: "SYSTEM", status: "success" },
  { id: 8, timestamp: "2025-12-29 12:40:19", user: "admin@platform.com", action: "AI Threshold Updated", resource: "Risk Detection Threshold", institution: "Platform-wide", ipAddress: "192.168.1.1", status: "success" },
];

interface DataRetentionRule {
  id: number;
  category: string;
  retentionPeriod: string;
  status: "active" | "inactive";
  appliesTo: string;
}

const retentionRules: DataRetentionRule[] = [
  { id: 1, category: "User Activity Logs", retentionPeriod: "7 years", status: "active", appliesTo: "All institutions" },
  { id: 2, category: "Financial Records", retentionPeriod: "10 years", status: "active", appliesTo: "All institutions" },
  { id: 3, category: "Academic Records", retentionPeriod: "Indefinite", status: "active", appliesTo: "All institutions" },
  { id: 4, category: "Session Data", retentionPeriod: "90 days", status: "active", appliesTo: "All institutions" },
  { id: 5, category: "AI Training Data", retentionPeriod: "Never stored", status: "active", appliesTo: "Platform-wide" },
  { id: 6, category: "Audit Logs", retentionPeriod: "Indefinite", status: "active", appliesTo: "Platform-wide" },
];

export function Compliance() {
  const [activeTab, setActiveTab] = useState("audit");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("today");

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: "audit", label: "Audit Trail", icon: FileText },
    { id: "retention", label: "Data Retention", icon: Database },
    { id: "consent", label: "Consent Management", icon: CheckCircle2 },
    { id: "compliance", label: "Compliance Reports", icon: Shield },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8]">
      {/* Header */}
      <div className="p-6 border-b border-[#e8eaed] bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[#1f2937] mb-1">Data & Compliance</h1>
              <p className="text-[13px] text-[#6b7280]">Regulatory adherence and audit readiness</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export Compliance Report
              </button>
              <button className="px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
                Generate Audit Package
              </button>
            </div>
          </div>

          {/* Compliance Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-[12px] text-[#6b7280]">GDPR Compliance</span>
              </div>
              <div className="text-[20px] text-emerald-700 font-semibold">Compliant</div>
            </div>
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Data Residency</span>
              </div>
              <div className="text-[20px] text-[#1f2937] font-semibold">100%</div>
            </div>
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Audit Logs</span>
              </div>
              <div className="text-[20px] text-[#1f2937] font-semibold">2.4M</div>
            </div>
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Encryption</span>
              </div>
              <div className="text-[20px] text-emerald-700 font-semibold">Active</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#e8eaed] mt-5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[13px] transition-colors ${
                    activeTab === tab.id
                      ? "text-[#1e40af] border-b-2 border-[#1e40af] font-medium"
                      : "text-[#6b7280] hover:text-[#1f2937]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          {activeTab === "audit" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="text"
                    placeholder="Search audit logs by action, user, or resource..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-[#d8dce2] rounded pl-9 pr-3 py-2 text-[13px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                  />
                </div>
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
                >
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                  <Calendar className="w-3.5 h-3.5" />
                  Custom Range
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                  Advanced
                </button>
              </div>

              {/* Audit Log Table */}
              <div className="bg-white border border-[#e8eaed] rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#fafbfc] border-b border-[#e8eaed]">
                      <tr>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Timestamp</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">User</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Action</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Resource</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Institution</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">IP Address</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Status</th>
                        <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8eaed]">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#fafbfc] transition-colors">
                          <td className="px-4 py-3 text-[12px] text-[#6b7280]">{log.timestamp}</td>
                          <td className="px-4 py-3 text-[13px] text-[#1f2937]">{log.user}</td>
                          <td className="px-4 py-3 text-[13px] text-[#1f2937] font-medium">{log.action}</td>
                          <td className="px-4 py-3 text-[13px] text-[#1f2937]">{log.resource}</td>
                          <td className="px-4 py-3 text-[13px] text-[#6b7280]">{log.institution}</td>
                          <td className="px-4 py-3 text-[12px] text-[#6b7280] font-mono">{log.ipAddress}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {log.status === "success" ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : log.status === "warning" ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors" title="View Details">
                              <Eye className="w-3.5 h-3.5 text-[#6b7280]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "retention" && (
            <div className="space-y-4">
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[#1f2937]">Data Retention Policies</h2>
                  <button className="px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
                    Create New Policy
                  </button>
                </div>
                
                <div className="space-y-2">
                  {retentionRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed] hover:bg-[#f5f6f8] transition-colors">
                      <div className="flex-1">
                        <div className="text-[13px] text-[#1f2937] font-medium mb-0.5">{rule.category}</div>
                        <div className="text-[12px] text-[#6b7280]">{rule.appliesTo}</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-[11px] text-[#6b7280] mb-0.5">Retention Period</div>
                          <div className="text-[13px] text-[#1f2937] font-medium">{rule.retentionPeriod}</div>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          rule.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-[#6b7280]"
                        }`}>
                          {rule.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#e8eaed] rounded p-5">
                  <h3 className="text-[#1f2937] mb-3 text-[15px]">Storage Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#6b7280]">Total Data Stored</span>
                      <span className="text-[#1f2937] font-medium">847 GB</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#6b7280]">Archived Data</span>
                      <span className="text-[#1f2937] font-medium">412 GB</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#6b7280]">Pending Deletion</span>
                      <span className="text-[#1f2937] font-medium">23 GB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#e8eaed] rounded p-5">
                  <h3 className="text-[#1f2937] mb-3 text-[15px]">Compliance Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#6b7280]">GDPR Right to Deletion</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#6b7280]">Data Portability</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#6b7280]">Access Logging</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "consent" && (
            <div className="bg-white border border-[#e8eaed] rounded p-5">
              <h2 className="text-[#1f2937] mb-4">Consent Management</h2>
              <div className="text-[13px] text-[#6b7280] text-center py-16">
                <Shield className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
                <p>Consent management system configuration</p>
                <p className="mt-1">Track user consent preferences and manage data processing agreements</p>
              </div>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="bg-white border border-[#e8eaed] rounded p-5">
              <h2 className="text-[#1f2937] mb-4">Compliance Reports</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[#fafbfc] rounded border border-[#e8eaed]">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#1e40af]" />
                    <div>
                      <div className="text-[13px] text-[#1f2937] font-medium">GDPR Compliance Report Q4 2025</div>
                      <div className="text-[12px] text-[#6b7280]">Generated on Dec 28, 2025</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#fafbfc] rounded border border-[#e8eaed]">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#1e40af]" />
                    <div>
                      <div className="text-[13px] text-[#1f2937] font-medium">Security Audit Report 2025</div>
                      <div className="text-[12px] text-[#6b7280]">Generated on Dec 20, 2025</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#fafbfc] rounded border border-[#e8eaed]">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#1e40af]" />
                    <div>
                      <div className="text-[13px] text-[#1f2937] font-medium">Data Processing Agreement</div>
                      <div className="text-[12px] text-[#6b7280]">Updated on Nov 15, 2025</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
