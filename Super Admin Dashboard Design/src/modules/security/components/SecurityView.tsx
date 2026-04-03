import { AlertTriangle, CheckCircle2, Eye, Filter, Lock, Monitor, Search, Shield, User, XCircle } from "lucide-react";
import { PanelHeader } from "../../../components/shared/PanelHeader";
import { TableCard } from "../../../components/shared/TableCard";
import type { ActiveSession, SecurityEvent, SecurityTab, SecurityTabId } from "../types";

interface SecurityViewProps {
  tabs: SecurityTab[];
  filteredEvents: SecurityEvent[];
  activeSessions: ActiveSession[];
  stats: {
    totalEvents: number;
    critical: number;
    blocked: number;
    activeSessions: number;
  };
  activeTab: SecurityTabId;
  searchTerm: string;
  severityFilter: string;
  setActiveTab: (tab: SecurityTabId) => void;
  setSearchTerm: (value: string) => void;
  setSeverityFilter: (value: string) => void;
}

export function SecurityView({
  tabs,
  filteredEvents,
  activeSessions,
  stats,
  activeTab,
  searchTerm,
  severityFilter,
  setActiveTab,
  setSearchTerm,
  setSeverityFilter,
}: SecurityViewProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8]">
      <PanelHeader
        title="Security Center"
        description="Platform security intelligence and threat monitoring"
        actions={
          <button className="px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
            Security Report
          </button>
        }
      />

      <div className="p-6 border-b border-[#e8eaed] bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Security Events (24h)</span>
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">{stats.totalEvents}</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-[12px] text-[#6b7280]">Critical Alerts</span>
              </div>
              <div className="text-[24px] text-red-700 font-semibold tracking-tight">{stats.critical}</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span className="text-[12px] text-[#6b7280]">Blocked Attempts</span>
              </div>
              <div className="text-[24px] text-amber-700 font-semibold tracking-tight">{stats.blocked}</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-emerald-600" />
                <span className="text-[12px] text-[#6b7280]">Active Sessions</span>
              </div>
              <div className="text-[24px] text-emerald-700 font-semibold tracking-tight">{stats.activeSessions}</div>
            </div>
          </div>

          <div className="flex gap-1 border-b border-[#e8eaed] mt-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[13px] transition-colors ${
                  activeTab === tab.id
                    ? "text-[#1e40af] border-b-2 border-[#1e40af] font-medium"
                    : "text-[#6b7280] hover:text-[#1f2937]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          {activeTab === "events" && (
            <TableCard title="Security Events">
              <div className="px-5 pb-5">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                      type="text"
                      placeholder="Search by user, IP address, or institution..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="w-full bg-white border border-[#d8dce2] rounded pl-9 pr-3 py-2 text-[13px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                    />
                  </div>
                  <select
                    value={severityFilter}
                    onChange={(event) => setSeverityFilter(event.target.value)}
                    className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
                  >
                    <option value="all">All Severity</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                    <Filter className="w-3.5 h-3.5" />
                    Advanced Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#fafbfc] border-b border-[#e8eaed]">
                    <tr>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Timestamp</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Event Type</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">User</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Institution</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">IP Address</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Location</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Severity</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Status</th>
                      <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8eaed]">
                    {filteredEvents.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-10 text-center text-[13px] text-[#6b7280]">
                          No events match the current filters.
                        </td>
                      </tr>
                    )}
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-[#fafbfc] transition-colors">
                        <td className="px-4 py-3 text-[12px] text-[#6b7280]">{event.timestamp}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-[#f5f6f8] rounded text-[12px] text-[#1f2937] font-medium">{event.type.replace(/_/g, " ")}</span>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#1f2937]">{event.user}</td>
                        <td className="px-4 py-3 text-[13px] text-[#6b7280]">{event.institution}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6b7280] font-mono">{event.ipAddress}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6b7280]">{event.location}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              event.severity === "critical"
                                ? "bg-red-100 text-red-700"
                                : event.severity === "high"
                                  ? "bg-orange-100 text-orange-700"
                                  : event.severity === "medium"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-[#6b7280]"
                            }`}
                          >
                            {event.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {event.status === "resolved" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : event.status === "blocked" ? (
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            <span className="text-[12px] text-[#1f2937] capitalize">{event.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors" title="View Details">
                              <Eye className="w-3.5 h-3.5 text-[#6b7280]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          )}

          {activeTab === "sessions" && (
            <TableCard title="Active User Sessions">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#fafbfc] border-b border-[#e8eaed]">
                    <tr>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">User</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Institution</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">IP Address</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Location</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Device</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Start Time</th>
                      <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Last Activity</th>
                      <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8eaed]">
                    {activeSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-[#fafbfc] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#e5e7eb] rounded-full flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-[#6b7280]" />
                            </div>
                            <span className="text-[13px] text-[#1f2937]">{session.user}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#6b7280]">{session.institution}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6b7280] font-mono">{session.ipAddress}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6b7280]">{session.location}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6b7280]">{session.device}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6b7280]">{session.startTime}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6b7280]">{session.lastActivity}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end">
                            <button className="px-2.5 py-1 bg-red-600 hover:bg-red-700 rounded text-[11px] text-white transition-colors font-medium">
                              Terminate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          )}

          {activeTab === "policies" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#e8eaed] rounded p-5">
                  <h3 className="text-[#1f2937] mb-4 text-[15px]">Password Policy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Minimum Length</span><span className="text-[13px] text-[#1f2937] font-medium">12 characters</span></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Complexity Required</span><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Rotation Period</span><span className="text-[13px] text-[#1f2937] font-medium">90 days</span></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">History Check</span><span className="text-[13px] text-[#1f2937] font-medium">Last 5 passwords</span></div>
                  </div>
                </div>

                <div className="bg-white border border-[#e8eaed] rounded p-5">
                  <h3 className="text-[#1f2937] mb-4 text-[15px]">Session Policy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Max Session Duration</span><span className="text-[13px] text-[#1f2937] font-medium">8 hours</span></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Inactivity Timeout</span><span className="text-[13px] text-[#1f2937] font-medium">30 minutes</span></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Concurrent Sessions</span><span className="text-[13px] text-[#1f2937] font-medium">3 max</span></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">IP Lock</span><XCircle className="w-4 h-4 text-[#9ca3af]" /></div>
                  </div>
                </div>

                <div className="bg-white border border-[#e8eaed] rounded p-5">
                  <h3 className="text-[#1f2937] mb-4 text-[15px]">Access Control</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">2FA Required</span><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">IP Whitelist</span><XCircle className="w-4 h-4 text-[#9ca3af]" /></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Geo Blocking</span><XCircle className="w-4 h-4 text-[#9ca3af]" /></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Rate Limiting</span><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                  </div>
                </div>

                <div className="bg-white border border-[#e8eaed] rounded p-5">
                  <h3 className="text-[#1f2937] mb-4 text-[15px]">Data Protection</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Encryption at Rest</span><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Encryption in Transit</span><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Key Rotation</span><span className="text-[13px] text-[#1f2937] font-medium">Monthly</span></div>
                    <div className="flex items-center justify-between"><span className="text-[13px] text-[#6b7280]">Backup Encryption</span><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "monitoring" && (
            <div className="bg-white border border-[#e8eaed] rounded p-5">
              <h2 className="text-[#1f2937] mb-4">Threat Monitoring Dashboard</h2>
              <div className="text-[13px] text-[#6b7280] text-center py-16">
                <Shield className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
                <p>Real-time threat detection and monitoring</p>
                <p className="mt-1">View active threats, anomaly detection, and security intelligence</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
