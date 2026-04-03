import { AlertOctagon, Power, Pause, RefreshCw, Database, Shield, Activity } from "lucide-react";
import { useState } from "react";

export function EmergencyControls() {
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [systemFrozen, setSystemFrozen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8] p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-6 h-6 text-red-600" />
          <div>
            <h1 className="text-[#1f2937] mb-1">Emergency Controls</h1>
            <p className="text-[13px] text-[#6b7280]">Critical system override and disaster recovery</p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-700 mb-1 font-medium">Critical Controls Area</h3>
              <p className="text-[13px] text-red-700 leading-relaxed">
                These controls should only be used in emergency situations. All actions are logged and require Super Admin authorization.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Actions Grid */}
        <div className="grid grid-cols-2 gap-5">
          {/* Kill Switch */}
          <div className="bg-white border-2 border-red-200 rounded p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded flex items-center justify-center">
                  <Power className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-[#1f2937] mb-0.5 font-medium">System Kill Switch</h2>
                  <p className="text-[12px] text-[#6b7280]">Immediate platform shutdown</p>
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                killSwitchActive 
                  ? "bg-red-100 text-red-700" 
                  : "bg-emerald-100 text-emerald-700"
              }`}>
                {killSwitchActive ? "ACTIVATED" : "STANDBY"}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[13px] text-[#1f2937] bg-[#fafbfc] p-3 rounded border border-[#e8eaed]">
                <p className="mb-1.5 font-medium">This will:</p>
                <ul className="space-y-0.5 text-[12px] text-[#6b7280]">
                  <li>• Shut down all AI modules immediately</li>
                  <li>• Disable all user access</li>
                  <li>• Lock all data modifications</li>
                  <li>• Trigger incident protocol</li>
                </ul>
              </div>

              <button 
                onClick={() => setKillSwitchActive(!killSwitchActive)}
                className={`w-full py-2.5 rounded transition-colors font-medium text-[13px] ${
                  killSwitchActive
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {killSwitchActive ? "DEACTIVATE KILL SWITCH" : "ACTIVATE KILL SWITCH"}
              </button>
            </div>
          </div>

          {/* System Freeze */}
          <div className="bg-white border-2 border-amber-200 rounded p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded flex items-center justify-center">
                  <Pause className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-[#1f2937] mb-0.5 font-medium">System Freeze</h2>
                  <p className="text-[12px] text-[#6b7280]">Pause all write operations</p>
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                systemFrozen 
                  ? "bg-amber-100 text-amber-700" 
                  : "bg-emerald-100 text-emerald-700"
              }`}>
                {systemFrozen ? "FROZEN" : "ACTIVE"}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[13px] text-[#1f2937] bg-[#fafbfc] p-3 rounded border border-[#e8eaed]">
                <p className="mb-1.5 font-medium">This will:</p>
                <ul className="space-y-0.5 text-[12px] text-[#6b7280]">
                  <li>• Prevent all data modifications</li>
                  <li>• Maintain read-only access</li>
                  <li>• Preserve system state</li>
                  <li>• Allow investigation</li>
                </ul>
              </div>

              <button 
                onClick={() => setSystemFrozen(!systemFrozen)}
                className={`w-full py-2.5 rounded transition-colors font-medium text-[13px] ${
                  systemFrozen
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-amber-600 hover:bg-amber-700 text-white"
                }`}
              >
                {systemFrozen ? "UNFREEZE SYSTEM" : "FREEZE SYSTEM"}
              </button>
            </div>
          </div>

          {/* Force Restart */}
          <div className="bg-white border border-[#e8eaed] rounded p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-[#f5f6f8] rounded flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-[#1e40af]" />
              </div>
              <div>
                <h2 className="text-[#1f2937] mb-0.5 font-medium">Force System Restart</h2>
                <p className="text-[12px] text-[#6b7280]">Restart all platform services</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[13px] text-[#1f2937] bg-[#fafbfc] p-3 rounded border border-[#e8eaed]">
                <p className="text-[12px] text-[#6b7280] leading-relaxed">
                  Will restart all microservices, clear caches, and reinitialize connections. 
                  Estimated downtime: 2-3 minutes.
                </p>
              </div>

              <button className="w-full py-2.5 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded font-medium text-[13px] transition-colors">
                INITIATE RESTART
              </button>
            </div>
          </div>

          {/* Backup Restoration */}
          <div className="bg-white border border-[#e8eaed] rounded p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-[#f5f6f8] rounded flex items-center justify-center">
                <Database className="w-5 h-5 text-[#1e40af]" />
              </div>
              <div>
                <h2 className="text-[#1f2937] mb-0.5 font-medium">Disaster Recovery</h2>
                <p className="text-[12px] text-[#6b7280]">Restore from backup</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#1f2937] font-medium">Select Backup Point</label>
                <select className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                  <option>Dec 28, 2025 - 06:00 UTC (Latest)</option>
                  <option>Dec 28, 2025 - 00:00 UTC</option>
                  <option>Dec 27, 2025 - 18:00 UTC</option>
                  <option>Dec 27, 2025 - 12:00 UTC</option>
                </select>
              </div>

              <button className="w-full py-2.5 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded font-medium text-[13px] transition-colors">
                RESTORE BACKUP
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white border border-[#e8eaed] rounded p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <Activity className="w-4 h-4 text-[#1e40af]" />
            <h2 className="text-[#1f2937]">Current System Status</h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6b7280]">API Gateway</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[12px] text-[#1f2937]">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6b7280]">Database Cluster</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[12px] text-[#1f2937]">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6b7280]">Cache Layer</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[12px] text-[#1f2937]">Operational</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6b7280]">AI Services</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[12px] text-[#1f2937]">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6b7280]">Auth Service</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[12px] text-[#1f2937]">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6b7280]">Storage</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[12px] text-[#1f2937]">Operational</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6b7280]">CDN</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[12px] text-[#1f2937]">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6b7280]">Email Service</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[12px] text-[#1f2937]">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6b7280]">Monitoring</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[12px] text-[#1f2937]">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Emergency Actions */}
        <div className="bg-white border border-[#e8eaed] rounded p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Shield className="w-4 h-4 text-[#6b7280]" />
            <h2 className="text-[#1f2937]">Recent Emergency Actions</h2>
          </div>

          <div className="space-y-2.5">
            <div className="text-[13px] text-[#6b7280] text-center py-8">
              No emergency actions in the last 90 days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}