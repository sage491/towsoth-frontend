import { Terminal, AlertCircle, Info, CheckCircle2, XCircle, Search, Filter, Download, RefreshCw, Trash2, Calendar } from "lucide-react";
import { useState } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "warning" | "error" | "critical" | "debug";
  category: "application" | "database" | "api" | "security" | "performance" | "system";
  message: string;
  source: string;
  user?: string;
  ipAddress?: string;
  details?: string;
}

const logs: LogEntry[] = [
  { id: 1, timestamp: "2025-12-29 15:45:23.456", level: "error", category: "application", message: "Failed to load institution dashboard", source: "DashboardController", user: "admin@platform.com", ipAddress: "192.168.1.1", details: "TypeError: Cannot read property 'data' of undefined" },
  { id: 2, timestamp: "2025-12-29 15:45:18.234", level: "warning", category: "api", message: "API rate limit exceeded", source: "RateLimiter", user: "api_user@stanford.edu", ipAddress: "171.64.12.45", details: "Limit: 1000 req/min, Current: 1250 req/min" },
  { id: 3, timestamp: "2025-12-29 15:45:12.789", level: "info", category: "security", message: "User login successful", source: "AuthService", user: "s.chen@stanford.edu", ipAddress: "171.64.12.45", details: "2FA verified" },
  { id: 4, timestamp: "2025-12-29 15:45:08.123", level: "critical", category: "database", message: "Database connection pool exhausted", source: "ConnectionManager", details: "Max connections: 100, Active: 100, Waiting: 45" },
  { id: 5, timestamp: "2025-12-29 15:45:05.567", level: "warning", category: "performance", message: "Slow query detected", source: "QueryMonitor", details: "Query execution time: 5.2s, Threshold: 1s" },
  { id: 6, timestamp: "2025-12-29 15:45:02.890", level: "info", category: "application", message: "Institution created successfully", source: "InstitutionService", user: "admin@platform.com", details: "Institution ID: 1052" },
  { id: 7, timestamp: "2025-12-29 15:44:58.456", level: "debug", category: "system", message: "Cache invalidated", source: "CacheManager", details: "Cache key: institution_list_page_1" },
  { id: 8, timestamp: "2025-12-29 15:44:55.234", level: "error", category: "api", message: "External API call failed", source: "APIGateway", details: "Service: OpenAI, Error: Timeout after 30s" },
  { id: 9, timestamp: "2025-12-29 15:44:50.123", level: "warning", category: "security", message: "Multiple login attempts detected", source: "SecurityMonitor", ipAddress: "45.67.89.123", details: "5 failed attempts in 2 minutes" },
  { id: 10, timestamp: "2025-12-29 15:44:45.789", level: "info", category: "application", message: "Report generated successfully", source: "ReportService", user: "admin@harvard.edu", details: "Report type: Monthly Analytics" },
  { id: 11, timestamp: "2025-12-29 15:44:40.567", level: "critical", category: "system", message: "Disk space critically low", source: "SystemMonitor", details: "Available: 2.1GB, Threshold: 5GB" },
  { id: 12, timestamp: "2025-12-29 15:44:35.890", level: "info", category: "database", message: "Database backup completed", source: "BackupService", details: "Backup size: 12.4GB, Duration: 8m 23s" },
];

export function SystemLogs() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    const matchesTab = activeTab === "all" || log.category === activeTab;
    return matchesSearch && matchesLevel && matchesCategory && matchesTab;
  });

  const tabs = [
    { id: "all", label: "All Logs", count: logs.length },
    { id: "application", label: "Application", count: logs.filter(l => l.category === "application").length },
    { id: "database", label: "Database", count: logs.filter(l => l.category === "database").length },
    { id: "api", label: "API", count: logs.filter(l => l.category === "api").length },
    { id: "security", label: "Security", count: logs.filter(l => l.category === "security").length },
    { id: "performance", label: "Performance", count: logs.filter(l => l.category === "performance").length },
    { id: "system", label: "System", count: logs.filter(l => l.category === "system").length },
  ];

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === "error" || l.level === "critical").length,
    warnings: logs.filter(l => l.level === "warning").length,
    info: logs.filter(l => l.level === "info").length,
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "critical":
      case "error":
        return <XCircle className="w-3.5 h-3.5 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
      case "info":
        return <Info className="w-3.5 h-3.5 text-[#1e40af]" />;
      case "debug":
        return <Terminal className="w-3.5 h-3.5 text-[#9ca3af]" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-700 bg-red-100";
      case "error":
        return "text-red-700 bg-red-100";
      case "warning":
        return "text-amber-700 bg-amber-100";
      case "info":
        return "text-[#1e40af] bg-blue-50";
      case "debug":
        return "text-[#6b7280] bg-gray-100";
      default:
        return "text-[#6b7280] bg-gray-100";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8]">
      {/* Header */}
      <div className="p-6 border-b border-[#e8eaed] bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[#1f2937] mb-1">System Logs</h1>
              <p className="text-[13px] text-[#6b7280]">Real-time platform logging and monitoring</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-[12px] transition-colors ${
                  autoRefresh 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                    : "bg-white border border-[#d8dce2] text-[#1f2937] hover:bg-[#f5f6f8]"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                Clear Logs
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
                <Download className="w-3.5 h-3.5" />
                Export Logs
              </button>
            </div>
          </div>

          {/* Log Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Total Logs (1h)</span>
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">{stats.total.toLocaleString()}</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-[12px] text-[#6b7280]">Errors & Critical</span>
              </div>
              <div className="text-[24px] text-red-700 font-semibold tracking-tight">{stats.errors}</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-[12px] text-[#6b7280]">Warnings</span>
              </div>
              <div className="text-[24px] text-amber-700 font-semibold tracking-tight">{stats.warnings}</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Info</span>
              </div>
              <div className="text-[24px] text-[#1e40af] font-semibold tracking-tight">{stats.info}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#e8eaed] mt-5 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-[13px] whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-[#1e40af] border-b-2 border-[#1e40af] font-medium"
                    : "text-[#6b7280] hover:text-[#1f2937]"
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  activeTab === tab.id ? "bg-[#1e40af] text-white" : "bg-[#e8eaed] text-[#6b7280]"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Logs */}
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-4">
          {/* Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search logs by message, source, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#d8dce2] rounded pl-9 pr-3 py-2 text-[13px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
              />
            </div>
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
            >
              <option value="all">All Categories</option>
              <option value="application">Application</option>
              <option value="database">Database</option>
              <option value="api">API</option>
              <option value="security">Security</option>
              <option value="performance">Performance</option>
              <option value="system">System</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
              <Calendar className="w-3.5 h-3.5" />
              Time Range
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Advanced
            </button>
          </div>

          {/* Log Entries */}
          <div className="bg-white border border-[#e8eaed] rounded overflow-hidden">
            <div className="bg-[#1f2937] text-white px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                <span className="text-[12px] font-mono">System Log Viewer</span>
              </div>
              <span className="text-[11px] text-[#9ca3af] font-mono">{filteredLogs.length} entries</span>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="px-4 py-2.5 border-b border-[#e8eaed] hover:bg-[#fafbfc] cursor-pointer transition-colors font-mono text-[12px]"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] text-[#6b7280] mt-0.5 shrink-0">{log.timestamp}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {getLevelIcon(log.level)}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-[#f5f6f8] rounded text-[10px] text-[#6b7280] uppercase shrink-0">
                      {log.category}
                    </span>
                    <span className="text-[#1f2937] flex-1">{log.message}</span>
                    <span className="text-[11px] text-[#6b7280] shrink-0">{log.source}</span>
                  </div>
                  {log.user && (
                    <div className="ml-[280px] mt-1 text-[11px] text-[#6b7280]">
                      User: {log.user} {log.ipAddress && `| IP: ${log.ipAddress}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-[#e8eaed] rounded p-4">
              <h3 className="text-[13px] text-[#1f2937] font-medium mb-3">Most Active Sources</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b7280]">AuthService</span>
                  <span className="text-[#1f2937] font-medium">1,245</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b7280]">APIGateway</span>
                  <span className="text-[#1f2937] font-medium">892</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b7280]">DashboardController</span>
                  <span className="text-[#1f2937] font-medium">673</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e8eaed] rounded p-4">
              <h3 className="text-[13px] text-[#1f2937] font-medium mb-3">Error Rate (1h)</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b7280]">Critical</span>
                  <span className="text-red-700 font-medium">2</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b7280]">Error</span>
                  <span className="text-red-700 font-medium">8</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b7280]">Warning</span>
                  <span className="text-amber-700 font-medium">15</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e8eaed] rounded p-4">
              <h3 className="text-[13px] text-[#1f2937] font-medium mb-3">Log Volume</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b7280]">Last Hour</span>
                  <span className="text-[#1f2937] font-medium">2,847</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b7280]">Today</span>
                  <span className="text-[#1f2937] font-medium">68,234</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6b7280]">Average/min</span>
                  <span className="text-[#1f2937] font-medium">47.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded border border-[#d8dce2] w-full max-w-3xl m-6" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#1f2937] text-white px-5 py-3 rounded-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="text-[13px] font-mono">Log Details</span>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-white hover:text-[#9ca3af] text-[20px] leading-none">
                ×
              </button>
            </div>

            <div className="p-5 space-y-4 font-mono text-[12px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] text-[#6b7280] mb-1">Timestamp</div>
                  <div className="text-[12px] text-[#1f2937]">{selectedLog.timestamp}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6b7280] mb-1">Level</div>
                  <div className="flex items-center gap-1.5">
                    {getLevelIcon(selectedLog.level)}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${getLevelColor(selectedLog.level)}`}>
                      {selectedLog.level}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6b7280] mb-1">Category</div>
                  <div className="text-[12px] text-[#1f2937] capitalize">{selectedLog.category}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6b7280] mb-1">Source</div>
                  <div className="text-[12px] text-[#1f2937]">{selectedLog.source}</div>
                </div>
                {selectedLog.user && (
                  <div>
                    <div className="text-[11px] text-[#6b7280] mb-1">User</div>
                    <div className="text-[12px] text-[#1f2937]">{selectedLog.user}</div>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div>
                    <div className="text-[11px] text-[#6b7280] mb-1">IP Address</div>
                    <div className="text-[12px] text-[#1f2937]">{selectedLog.ipAddress}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-[11px] text-[#6b7280] mb-1">Message</div>
                <div className="p-3 bg-[#fafbfc] rounded border border-[#e8eaed] text-[12px] text-[#1f2937]">
                  {selectedLog.message}
                </div>
              </div>

              {selectedLog.details && (
                <div>
                  <div className="text-[11px] text-[#6b7280] mb-1">Details</div>
                  <div className="p-3 bg-[#1f2937] text-emerald-400 rounded text-[11px] leading-relaxed">
                    {selectedLog.details}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#e8eaed] flex gap-2">
                <button className="flex-1 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                  Copy to Clipboard
                </button>
                <button className="flex-1 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                  View in Context
                </button>
                <button className="flex-1 px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
                  Create Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
