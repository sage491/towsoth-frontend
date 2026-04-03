import { FileText, Shield, Scale, AlertTriangle, CheckCircle2, Clock, Edit, Trash2, Plus, Search, Filter, Eye, Download } from "lucide-react";
import { useState } from "react";

interface Policy {
  id: number;
  name: string;
  category: "data_privacy" | "security" | "usage" | "sla" | "compliance";
  version: string;
  status: "active" | "draft" | "deprecated";
  effectiveDate: string;
  lastUpdated: string;
  appliesTo: string;
  owner: string;
}

const policies: Policy[] = [
  { id: 1, name: "Data Privacy Policy", category: "data_privacy", version: "3.2", status: "active", effectiveDate: "2025-01-01", lastUpdated: "2025-12-15", appliesTo: "All institutions", owner: "Legal Team" },
  { id: 2, name: "Information Security Policy", category: "security", version: "2.8", status: "active", effectiveDate: "2025-01-01", lastUpdated: "2025-11-20", appliesTo: "All institutions", owner: "Security Team" },
  { id: 3, name: "Acceptable Use Policy", category: "usage", version: "1.5", status: "active", effectiveDate: "2025-01-01", lastUpdated: "2025-10-10", appliesTo: "All users", owner: "Compliance Team" },
  { id: 4, name: "Service Level Agreement", category: "sla", version: "4.1", status: "active", effectiveDate: "2025-01-01", lastUpdated: "2025-12-01", appliesTo: "Enterprise tier", owner: "Operations Team" },
  { id: 5, name: "GDPR Compliance Framework", category: "compliance", version: "2.0", status: "active", effectiveDate: "2025-01-01", lastUpdated: "2025-09-15", appliesTo: "EU institutions", owner: "Compliance Team" },
  { id: 6, name: "AI Ethics Guidelines", category: "usage", version: "1.2", status: "active", effectiveDate: "2025-06-01", lastUpdated: "2025-11-30", appliesTo: "All institutions", owner: "AI Ethics Board" },
  { id: 7, name: "Legacy Security Policy", category: "security", version: "1.9", status: "deprecated", effectiveDate: "2024-01-01", lastUpdated: "2024-12-31", appliesTo: "All institutions", owner: "Security Team" },
  { id: 8, name: "New Privacy Framework", category: "data_privacy", version: "0.9", status: "draft", effectiveDate: "2026-01-01", lastUpdated: "2025-12-20", appliesTo: "All institutions", owner: "Legal Team" },
];

interface RiskItem {
  id: number;
  title: string;
  category: "operational" | "security" | "compliance" | "financial";
  severity: "critical" | "high" | "medium" | "low";
  probability: "high" | "medium" | "low";
  status: "open" | "mitigated" | "accepted" | "closed";
  owner: string;
  lastReviewed: string;
}

const risks: RiskItem[] = [
  { id: 1, title: "Data Breach via Third-Party Integration", category: "security", severity: "critical", probability: "medium", status: "mitigated", owner: "Security Team", lastReviewed: "2025-12-20" },
  { id: 2, title: "GDPR Non-Compliance in New Markets", category: "compliance", severity: "high", probability: "medium", status: "open", owner: "Compliance Team", lastReviewed: "2025-12-15" },
  { id: 3, title: "Service Outage Impact on Revenue", category: "financial", severity: "high", probability: "low", status: "mitigated", owner: "Operations Team", lastReviewed: "2025-12-10" },
  { id: 4, title: "AI Bias in Student Assessment", category: "operational", severity: "high", probability: "medium", status: "open", owner: "AI Ethics Board", lastReviewed: "2025-12-18" },
  { id: 5, title: "Key Personnel Departure", category: "operational", severity: "medium", probability: "medium", status: "accepted", owner: "HR Team", lastReviewed: "2025-12-05" },
];

interface ComplianceFramework {
  id: number;
  name: string;
  status: "compliant" | "in_progress" | "non_compliant";
  region: string;
  lastAudit: string;
  nextAudit: string;
  certification: string;
}

const frameworks: ComplianceFramework[] = [
  { id: 1, name: "GDPR", status: "compliant", region: "European Union", lastAudit: "2025-11-15", nextAudit: "2026-05-15", certification: "Verified" },
  { id: 2, name: "SOC 2 Type II", status: "compliant", region: "United States", lastAudit: "2025-10-01", nextAudit: "2026-04-01", certification: "Certified" },
  { id: 3, name: "ISO 27001", status: "in_progress", region: "Global", lastAudit: "2025-08-20", nextAudit: "2026-02-20", certification: "In Progress" },
  { id: 4, name: "FERPA", status: "compliant", region: "United States", lastAudit: "2025-09-10", nextAudit: "2026-03-10", certification: "Verified" },
  { id: 5, name: "COPPA", status: "compliant", region: "United States", lastAudit: "2025-10-25", nextAudit: "2026-04-25", certification: "Verified" },
];

export function Governance() {
  const [activeTab, setActiveTab] = useState("policies");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          policy.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || policy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: "policies", label: "Policy Management", icon: FileText },
    { id: "risk", label: "Risk Management", icon: AlertTriangle },
    { id: "compliance", label: "Compliance Frameworks", icon: Shield },
    { id: "sla", label: "SLA Monitoring", icon: Scale },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "data_privacy": return "bg-blue-100 text-blue-700";
      case "security": return "bg-red-100 text-red-700";
      case "usage": return "bg-purple-100 text-purple-700";
      case "sla": return "bg-green-100 text-green-700";
      case "compliance": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-[#6b7280]";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8]">
      {/* Header */}
      <div className="p-6 border-b border-[#e8eaed] bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[#1f2937] mb-1">Governance & Policies</h1>
              <p className="text-[13px] text-[#6b7280]">Platform governance, risk management, and policy enforcement</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export Governance Report
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
                <Plus className="w-3.5 h-3.5" />
                Create Policy
              </button>
            </div>
          </div>

          {/* Governance Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[12px] text-[#6b7280]">Active Policies</span>
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">
                {policies.filter(p => p.status === "active").length}
              </div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-[12px] text-[#6b7280]">Open Risks</span>
              </div>
              <div className="text-[24px] text-red-700 font-semibold tracking-tight">
                {risks.filter(r => r.status === "open").length}
              </div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-[12px] text-[#6b7280]">Compliance Status</span>
              </div>
              <div className="text-[24px] text-emerald-700 font-semibold tracking-tight">
                {frameworks.filter(f => f.status === "compliant").length}/{frameworks.length}
              </div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-[12px] text-[#6b7280]">Pending Reviews</span>
              </div>
              <div className="text-[24px] text-amber-700 font-semibold tracking-tight">
                {policies.filter(p => p.status === "draft").length}
              </div>
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
          {activeTab === "policies" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="text"
                    placeholder="Search policies by name or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-[#d8dce2] rounded pl-9 pr-3 py-2 text-[13px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                  />
                </div>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
                >
                  <option value="all">All Categories</option>
                  <option value="data_privacy">Data Privacy</option>
                  <option value="security">Security</option>
                  <option value="usage">Usage</option>
                  <option value="sla">SLA</option>
                  <option value="compliance">Compliance</option>
                </select>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                  Advanced Filter
                </button>
              </div>

              {/* Policies Table */}
              <div className="bg-white border border-[#e8eaed] rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#fafbfc] border-b border-[#e8eaed]">
                      <tr>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Policy Name</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Category</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Version</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Effective Date</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Applies To</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Owner</th>
                        <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8eaed]">
                      {filteredPolicies.map((policy) => (
                        <tr 
                          key={policy.id} 
                          className="hover:bg-[#fafbfc] cursor-pointer transition-colors"
                          onClick={() => setSelectedPolicy(policy)}
                        >
                          <td className="px-4 py-3 text-[13px] text-[#1f2937] font-medium">{policy.name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${getCategoryColor(policy.category)}`}>
                              {policy.category.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[13px] text-[#6b7280]">v{policy.version}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {policy.status === "active" ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-[12px] text-emerald-700 capitalize">{policy.status}</span>
                                </>
                              ) : policy.status === "draft" ? (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span className="text-[12px] text-amber-700 capitalize">{policy.status}</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3.5 h-3.5 text-[#9ca3af]" />
                                  <span className="text-[12px] text-[#6b7280] capitalize">{policy.status}</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-[#6b7280]">{policy.effectiveDate}</td>
                          <td className="px-4 py-3 text-[12px] text-[#6b7280]">{policy.appliesTo}</td>
                          <td className="px-4 py-3 text-[12px] text-[#6b7280]">{policy.owner}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors" title="View Policy">
                                <Eye className="w-3.5 h-3.5 text-[#6b7280]" />
                              </button>
                              <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors" title="Edit Policy">
                                <Edit className="w-3.5 h-3.5 text-[#6b7280]" />
                              </button>
                              <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors" title="Delete Policy">
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "risk" && (
            <div className="space-y-4">
              {/* Risk Matrix */}
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">Risk Register</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#fafbfc] border-b border-[#e8eaed]">
                      <tr>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Risk Title</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Category</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Severity</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Probability</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Risk Score</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Owner</th>
                        <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Last Reviewed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8eaed]">
                      {risks.map((risk) => {
                        const severityScore = risk.severity === "critical" ? 4 : risk.severity === "high" ? 3 : risk.severity === "medium" ? 2 : 1;
                        const probabilityScore = risk.probability === "high" ? 3 : risk.probability === "medium" ? 2 : 1;
                        const riskScore = severityScore * probabilityScore;
                        
                        return (
                          <tr key={risk.id} className="hover:bg-[#fafbfc] transition-colors">
                            <td className="px-4 py-3 text-[13px] text-[#1f2937] font-medium">{risk.title}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 bg-[#f5f6f8] rounded text-[12px] text-[#1f2937] capitalize">
                                {risk.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                risk.severity === "critical" ? "bg-red-100 text-red-700" :
                                risk.severity === "high" ? "bg-orange-100 text-orange-700" :
                                risk.severity === "medium" ? "bg-amber-100 text-amber-700" :
                                "bg-gray-100 text-[#6b7280]"
                              }`}>
                                {risk.severity}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                risk.probability === "high" ? "bg-red-100 text-red-700" :
                                risk.probability === "medium" ? "bg-amber-100 text-amber-700" :
                                "bg-gray-100 text-[#6b7280]"
                              }`}>
                                {risk.probability}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-[#e8eaed] rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${riskScore >= 8 ? 'bg-red-600' : riskScore >= 4 ? 'bg-amber-600' : 'bg-emerald-600'}`}
                                    style={{ width: `${(riskScore / 12) * 100}%` }}
                                  />
                                </div>
                                <span className="text-[12px] text-[#6b7280] font-medium">{riskScore}/12</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                                risk.status === "closed" ? "bg-emerald-100 text-emerald-700" :
                                risk.status === "mitigated" ? "bg-blue-100 text-blue-700" :
                                risk.status === "accepted" ? "bg-amber-100 text-amber-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {risk.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[12px] text-[#6b7280]">{risk.owner}</td>
                            <td className="px-4 py-3 text-[12px] text-[#6b7280]">{risk.lastReviewed}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Summary */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-[#e8eaed] rounded p-4">
                  <div className="text-[12px] text-[#6b7280] mb-2">Critical Risks</div>
                  <div className="text-[20px] text-red-700 font-semibold">
                    {risks.filter(r => r.severity === "critical").length}
                  </div>
                </div>
                <div className="bg-white border border-[#e8eaed] rounded p-4">
                  <div className="text-[12px] text-[#6b7280] mb-2">High Risks</div>
                  <div className="text-[20px] text-orange-700 font-semibold">
                    {risks.filter(r => r.severity === "high").length}
                  </div>
                </div>
                <div className="bg-white border border-[#e8eaed] rounded p-4">
                  <div className="text-[12px] text-[#6b7280] mb-2">Mitigated</div>
                  <div className="text-[20px] text-emerald-700 font-semibold">
                    {risks.filter(r => r.status === "mitigated").length}
                  </div>
                </div>
                <div className="bg-white border border-[#e8eaed] rounded p-4">
                  <div className="text-[12px] text-[#6b7280] mb-2">Open</div>
                  <div className="text-[20px] text-amber-700 font-semibold">
                    {risks.filter(r => r.status === "open").length}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="space-y-4">
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">Compliance Frameworks</h2>
                <div className="space-y-3">
                  {frameworks.map((framework) => (
                    <div key={framework.id} className="flex items-center justify-between p-4 bg-[#fafbfc] rounded border border-[#e8eaed] hover:bg-[#f5f6f8] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-[#e8eaed] rounded flex items-center justify-center">
                          <Shield className={`w-5 h-5 ${framework.status === "compliant" ? "text-emerald-600" : framework.status === "in_progress" ? "text-amber-600" : "text-red-600"}`} />
                        </div>
                        <div>
                          <div className="text-[13px] text-[#1f2937] font-medium mb-0.5">{framework.name}</div>
                          <div className="text-[12px] text-[#6b7280]">{framework.region}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-[11px] text-[#6b7280] mb-0.5">Last Audit</div>
                          <div className="text-[12px] text-[#1f2937]">{framework.lastAudit}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] text-[#6b7280] mb-0.5">Next Audit</div>
                          <div className="text-[12px] text-[#1f2937]">{framework.nextAudit}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] text-[#6b7280] mb-0.5">Status</div>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            framework.status === "compliant" ? "bg-emerald-100 text-emerald-700" :
                            framework.status === "in_progress" ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {framework.certification}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "sla" && (
            <div className="space-y-4">
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">Service Level Agreement Monitoring</h2>
                
                {/* SLA Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="p-4 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="text-[12px] text-[#6b7280] mb-2">Uptime (30d)</div>
                    <div className="text-[24px] text-emerald-700 font-semibold tracking-tight">99.98%</div>
                    <div className="text-[11px] text-emerald-700">SLA: 99.9%</div>
                  </div>
                  <div className="p-4 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="text-[12px] text-[#6b7280] mb-2">Response Time</div>
                    <div className="text-[24px] text-emerald-700 font-semibold tracking-tight">145ms</div>
                    <div className="text-[11px] text-emerald-700">SLA: &lt;200ms</div>
                  </div>
                  <div className="p-4 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="text-[12px] text-[#6b7280] mb-2">Support Response</div>
                    <div className="text-[24px] text-emerald-700 font-semibold tracking-tight">18min</div>
                    <div className="text-[11px] text-emerald-700">SLA: &lt;30min</div>
                  </div>
                </div>

                {/* SLA Commitments */}
                <div className="space-y-2">
                  <h3 className="text-[13px] text-[#1f2937] font-medium mb-3">SLA Commitments</h3>
                  <div className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-[13px] text-[#1f2937] font-medium">System Availability</div>
                        <div className="text-[12px] text-[#6b7280]">99.9% uptime guarantee</div>
                      </div>
                    </div>
                    <div className="text-[13px] text-emerald-700 font-semibold">Met</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-[13px] text-[#1f2937] font-medium">Data Backup</div>
                        <div className="text-[12px] text-[#6b7280]">Daily automated backups</div>
                      </div>
                    </div>
                    <div className="text-[13px] text-emerald-700 font-semibold">Met</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-[13px] text-[#1f2937] font-medium">Critical Support</div>
                        <div className="text-[12px] text-[#6b7280]">Response within 30 minutes</div>
                      </div>
                    </div>
                    <div className="text-[13px] text-emerald-700 font-semibold">Met</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-[13px] text-[#1f2937] font-medium">Data Recovery</div>
                        <div className="text-[12px] text-[#6b7280]">RPO: 1 hour, RTO: 4 hours</div>
                      </div>
                    </div>
                    <div className="text-[13px] text-emerald-700 font-semibold">Met</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Policy Detail Modal */}
        {selectedPolicy && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => setSelectedPolicy(null)}>
            <div className="bg-white rounded border border-[#d8dce2] w-full max-w-3xl m-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-[#e8eaed]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[#1f2937] mb-1">{selectedPolicy.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${getCategoryColor(selectedPolicy.category)}`}>
                        {selectedPolicy.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[12px] text-[#6b7280]">Version {selectedPolicy.version}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPolicy(null)} className="text-[#6b7280] hover:text-[#1f2937] text-[24px] leading-none">
                    ×
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[12px] text-[#6b7280] mb-1">Status</div>
                    <div className="text-[13px] text-[#1f2937] capitalize">{selectedPolicy.status}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-[#6b7280] mb-1">Effective Date</div>
                    <div className="text-[13px] text-[#1f2937]">{selectedPolicy.effectiveDate}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-[#6b7280] mb-1">Owner</div>
                    <div className="text-[13px] text-[#1f2937]">{selectedPolicy.owner}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-[#6b7280] mb-1">Last Updated</div>
                    <div className="text-[13px] text-[#1f2937]">{selectedPolicy.lastUpdated}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[12px] text-[#6b7280] mb-1">Applies To</div>
                  <div className="text-[13px] text-[#1f2937]">{selectedPolicy.appliesTo}</div>
                </div>

                <div className="pt-4 border-t border-[#e8eaed]">
                  <div className="text-[12px] text-[#6b7280] mb-2">Policy Document</div>
                  <div className="p-4 bg-[#fafbfc] rounded border border-[#e8eaed] text-[13px] text-[#6b7280] leading-relaxed">
                    Full policy document content would be displayed here. This would include all terms, conditions, and guidelines relevant to this policy.
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e8eaed] flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                    Edit Policy
                  </button>
                  <button className="flex-1 px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
                    Publish New Version
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
