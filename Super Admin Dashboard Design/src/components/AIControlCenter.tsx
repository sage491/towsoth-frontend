import { Brain, AlertTriangle, Activity, Settings, TrendingUp, Shield } from "lucide-react";

const aiModules = [
  { 
    id: "tutoring", 
    name: "AI Tutoring Assistant", 
    status: "active", 
    usage: 78, 
    model: "GPT-4o",
    requests: "2.4M",
    riskLevel: "low"
  },
  { 
    id: "assessment", 
    name: "Assessment Generation", 
    status: "active", 
    usage: 65, 
    model: "GPT-4o-mini",
    requests: "1.8M",
    riskLevel: "low"
  },
  { 
    id: "grading", 
    name: "Auto Grading System", 
    status: "active", 
    usage: 54, 
    model: "Claude-3.5-Sonnet",
    requests: "980K",
    riskLevel: "medium"
  },
  { 
    id: "analytics", 
    name: "Predictive Analytics", 
    status: "active", 
    usage: 41, 
    model: "Custom ML",
    requests: "560K",
    riskLevel: "low"
  },
  { 
    id: "content", 
    name: "Content Generator", 
    status: "warning", 
    usage: 89, 
    model: "GPT-4o",
    requests: "1.2M",
    riskLevel: "medium"
  },
];

const modelVersions = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "gpt-4o-mini", name: "GPT-4o-mini", provider: "OpenAI" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
];

const biasAlerts = [
  { id: 1, severity: "medium", message: "Grading bias detected in STEM assessments", module: "Auto Grading System" },
  { id: 2, severity: "low", message: "Language preference deviation in tutoring responses", module: "AI Tutoring Assistant" },
];

export function AIControlCenter() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8] p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[#1f2937] mb-1">AI Infrastructure</h1>
          <p className="text-[13px] text-[#6b7280]">Monitor and manage AI infrastructure</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-[#e8eaed] rounded p-4">
            <div className="flex items-center justify-between mb-2.5">
              <Brain className="w-4 h-4 text-[#1e40af]" />
              <span className="text-[12px] text-emerald-700 font-medium">Active</span>
            </div>
            <div className="text-[24px] text-[#1f2937] mb-1 font-semibold tracking-tight">5</div>
            <div className="text-[12px] text-[#6b7280]">AI Modules</div>
          </div>

          <div className="bg-white border border-[#e8eaed] rounded p-4">
            <div className="flex items-center justify-between mb-2.5">
              <Activity className="w-4 h-4 text-[#1e40af]" />
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-[24px] text-[#1f2937] mb-1 font-semibold tracking-tight">7.0M</div>
            <div className="text-[12px] text-[#6b7280]">Total Requests (30d)</div>
          </div>

          <div className="bg-white border border-[#e8eaed] rounded p-4">
            <div className="flex items-center justify-between mb-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-[12px] text-amber-700 font-medium">2 Active</span>
            </div>
            <div className="text-[24px] text-[#1f2937] mb-1 font-semibold tracking-tight">2</div>
            <div className="text-[12px] text-[#6b7280]">Risk Alerts</div>
          </div>

          <div className="bg-white border border-[#e8eaed] rounded p-4">
            <div className="flex items-center justify-between mb-2.5">
              <Shield className="w-4 h-4 text-[#1e40af]" />
              <span className="text-[12px] text-emerald-700 font-medium">Compliant</span>
            </div>
            <div className="text-[24px] text-[#1f2937] mb-1 font-semibold tracking-tight">100%</div>
            <div className="text-[12px] text-[#6b7280]">Data Boundary</div>
          </div>
        </div>

        {/* AI Modules List */}
        <div className="bg-white border border-[#e8eaed] rounded">
          <div className="p-5 border-b border-[#e8eaed]">
            <h2 className="text-[#1f2937]">AI Modules</h2>
          </div>
          <div className="divide-y divide-[#e8eaed]">
            {aiModules.map((module) => (
              <div key={module.id} className="p-5 hover:bg-[#fafbfc]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#f5f6f8] rounded flex items-center justify-center">
                      <Brain className="w-4 h-4 text-[#1e40af]" />
                    </div>
                    <div>
                      <h3 className="text-[13px] text-[#1f2937] mb-0.5 font-medium">{module.name}</h3>
                      <div className="flex items-center gap-2 text-[12px] text-[#6b7280]">
                        <span className="px-2 py-0.5 bg-[#f5f6f8] rounded text-[#1f2937] font-medium">{module.model}</span>
                        <span>{module.requests} requests</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <div className="text-[11px] text-[#6b7280] mb-0.5">Usage</div>
                      <div className={`text-[13px] font-medium ${
                        module.usage > 80 ? "text-amber-700" : "text-[#1f2937]"
                      }`}>
                        {module.usage}%
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[11px] text-[#6b7280] mb-0.5">Risk</div>
                      <div className={`text-[13px] font-medium capitalize ${
                        module.riskLevel === "medium" ? "text-amber-700" : "text-emerald-700"
                      }`}>
                        {module.riskLevel}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        module.status === "active" ? "bg-emerald-600" : "bg-amber-600"
                      }`} />
                      <span className="text-[12px] text-[#1f2937] capitalize">{module.status}</span>
                    </div>

                    <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors">
                      <Settings className="w-4 h-4 text-[#6b7280]" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px] text-[#6b7280]">
                    <span>Capacity Usage</span>
                    <span>{module.usage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#f5f6f8] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        module.usage > 80 ? "bg-amber-600" : "bg-[#1e40af]"
                      }`}
                      style={{ width: `${module.usage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Model Versions */}
          <div className="bg-white border border-[#e8eaed] rounded">
            <div className="p-5 border-b border-[#e8eaed] flex items-center justify-between">
              <h2 className="text-[#1f2937]">Available Models</h2>
              <button className="px-3 py-1.5 bg-[#fafbfc] hover:bg-[#f5f6f8] rounded text-[12px] text-[#1f2937] border border-[#e8eaed] transition-colors">
                Add Model
              </button>
            </div>
            <div className="p-5 space-y-2">
              {modelVersions.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-3 bg-[#fafbfc] rounded hover:bg-[#f5f6f8] transition-colors">
                  <div>
                    <div className="text-[13px] text-[#1f2937] font-medium">{model.name}</div>
                    <div className="text-[12px] text-[#6b7280] mt-0.5">{model.provider}</div>
                  </div>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Bias & Risk Alerts */}
          <div className="bg-white border border-[#e8eaed] rounded">
            <div className="p-5 border-b border-[#e8eaed] flex items-center justify-between">
              <h2 className="text-[#1f2937]">Risk Alerts</h2>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="p-5 space-y-3">
              {biasAlerts.map((alert) => (
                <div key={alert.id} className="border-l-2 border-amber-600 pl-3 py-2 bg-amber-50 rounded-r">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-[11px] text-amber-700 uppercase font-medium tracking-wide">{alert.severity} Risk</span>
                    <button className="text-[12px] text-[#1e40af] hover:text-[#1e3a8a] font-medium">Review</button>
                  </div>
                  <p className="text-[13px] text-[#1f2937] mb-0.5 leading-snug">{alert.message}</p>
                  <p className="text-[12px] text-[#6b7280]">{alert.module}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Boundary Controls */}
        <div className="bg-white border border-[#e8eaed] rounded p-5">
          <h2 className="text-[#1f2937] mb-4">Data Boundary Controls</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[#fafbfc] rounded border border-[#e8eaed]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#1f2937] font-medium">Training Data Usage</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked readOnly />
                  <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <p className="text-[12px] text-[#6b7280] leading-snug">Prevent customer data from model training</p>
            </div>

            <div className="p-4 bg-[#fafbfc] rounded border border-[#e8eaed]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#1f2937] font-medium">Region Lock</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked readOnly />
                  <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <p className="text-[12px] text-[#6b7280] leading-snug">Enforce data residency requirements</p>
            </div>

            <div className="p-4 bg-[#fafbfc] rounded border border-[#e8eaed]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#1f2937] font-medium">PII Filtering</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked readOnly />
                  <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <p className="text-[12px] text-[#6b7280] leading-snug">Automatic PII detection and redaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}