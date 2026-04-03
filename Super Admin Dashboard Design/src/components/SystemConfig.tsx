import { Settings, Save, RotateCcw, Globe, Clock, Upload, Bell, Shield, Database, Mail } from "lucide-react";
import { useState } from "react";

export function SystemConfig() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General Settings", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "storage", label: "Storage & Limits", icon: Database },
    { id: "email", label: "Email Configuration", icon: Mail },
    { id: "security", label: "Security Defaults", icon: Shield },
    { id: "regional", label: "Regional Settings", icon: Globe },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8]">
      {/* Header */}
      <div className="p-6 border-b border-[#e8eaed] bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[#1f2937] mb-1">System Configuration</h1>
              <p className="text-[13px] text-[#6b7280]">Global platform defaults and system behavior</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#6b7280] hover:bg-[#f5f6f8] transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Defaults
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#e8eaed]">
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
        <div className="max-w-[1200px] mx-auto">
          {activeTab === "general" && (
            <div className="space-y-5">
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">Academic Session Defaults</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Default Session Start Date</label>
                      <input 
                        type="date"
                        defaultValue="2025-09-01"
                        className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Default Session Duration</label>
                      <select className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                        <option>12 months</option>
                        <option>10 months</option>
                        <option>6 months (Semester)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Working Days</label>
                      <select className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                        <option>Monday - Friday (5 days)</option>
                        <option>Monday - Saturday (6 days)</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Default Timezone</label>
                      <select className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                        <option>UTC (GMT+0)</option>
                        <option>EST (GMT-5)</option>
                        <option>PST (GMT-8)</option>
                        <option>Institution-specific</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">System Behavior</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div>
                      <div className="text-[13px] text-[#1f2937] font-medium mb-0.5">Auto-archive Old Sessions</div>
                      <div className="text-[12px] text-[#6b7280]">Automatically archive sessions older than 2 years</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e40af]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div>
                      <div className="text-[13px] text-[#1f2937] font-medium mb-0.5">Maintenance Mode</div>
                      <div className="text-[12px] text-[#6b7280]">Show maintenance page to all users</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e40af]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div>
                      <div className="text-[13px] text-[#1f2937] font-medium mb-0.5">Debug Mode</div>
                      <div className="text-[12px] text-[#6b7280]">Enable detailed error logging and debugging</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e40af]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-5">
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">Notification Templates</h2>
                <div className="space-y-3">
                  <div className="p-3 border border-[#e8eaed] rounded hover:bg-[#fafbfc] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] text-[#1f2937] font-medium">Institution Created</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[11px] font-medium">Active</span>
                    </div>
                    <div className="text-[12px] text-[#6b7280]">Welcome email sent to new institutions</div>
                  </div>

                  <div className="p-3 border border-[#e8eaed] rounded hover:bg-[#fafbfc] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] text-[#1f2937] font-medium">Plan Upgrade</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[11px] font-medium">Active</span>
                    </div>
                    <div className="text-[12px] text-[#6b7280]">Notification when institution upgrades plan</div>
                  </div>

                  <div className="p-3 border border-[#e8eaed] rounded hover:bg-[#fafbfc] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] text-[#1f2937] font-medium">Payment Failed</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[11px] font-medium">Active</span>
                    </div>
                    <div className="text-[12px] text-[#6b7280]">Alert sent when payment processing fails</div>
                  </div>

                  <div className="p-3 border border-[#e8eaed] rounded hover:bg-[#fafbfc] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] text-[#1f2937] font-medium">Security Alert</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[11px] font-medium">Active</span>
                    </div>
                    <div className="text-[12px] text-[#6b7280]">Critical security event notifications</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">Notification Channels</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#1e40af]" />
                      <div>
                        <div className="text-[13px] text-[#1f2937] font-medium">Email Notifications</div>
                        <div className="text-[12px] text-[#6b7280]">Send via SMTP</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e40af]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-[#1e40af]" />
                      <div>
                        <div className="text-[13px] text-[#1f2937] font-medium">In-App Notifications</div>
                        <div className="text-[12px] text-[#6b7280]">Show in admin dashboard</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e40af]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "storage" && (
            <div className="space-y-5">
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">Upload Limits</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Max File Size (Images)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        defaultValue="10"
                        className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                      <select className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                        <option>MB</option>
                        <option>GB</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Max File Size (Documents)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        defaultValue="50"
                        className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                      <select className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                        <option>MB</option>
                        <option>GB</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Max File Size (Videos)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        defaultValue="500"
                        className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                      <select className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                        <option>MB</option>
                        <option>GB</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Storage Per Institution (Default)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        defaultValue="100"
                        className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                      <select className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                        <option>GB</option>
                        <option>TB</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">System Timeouts</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">API Request Timeout</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        defaultValue="30"
                        className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                      <span className="px-3 py-2 bg-[#f5f6f8] border border-[#e8eaed] rounded text-[13px] text-[#6b7280]">seconds</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Session Timeout</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        defaultValue="8"
                        className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                      <span className="px-3 py-2 bg-[#f5f6f8] border border-[#e8eaed] rounded text-[13px] text-[#6b7280]">hours</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Idle Timeout</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        defaultValue="30"
                        className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                      <span className="px-3 py-2 bg-[#f5f6f8] border border-[#e8eaed] rounded text-[13px] text-[#6b7280]">minutes</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Background Job Timeout</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        defaultValue="10"
                        className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                      <span className="px-3 py-2 bg-[#f5f6f8] border border-[#e8eaed] rounded text-[13px] text-[#6b7280]">minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-5">
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">SMTP Configuration</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">SMTP Host</label>
                      <input 
                        type="text"
                        defaultValue="smtp.platform.com"
                        className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">SMTP Port</label>
                      <input 
                        type="number"
                        defaultValue="587"
                        className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">From Email Address</label>
                    <input 
                      type="email"
                      defaultValue="noreply@platform.com"
                      className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">From Name</label>
                    <input 
                      type="text"
                      defaultValue="Towsoth Edu Platform"
                      className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                    />
                  </div>

                  <button className="px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                    Test Email Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white border border-[#e8eaed] rounded p-5">
              <h2 className="text-[#1f2937] mb-4">Security Defaults</h2>
              <div className="text-[13px] text-[#6b7280] text-center py-16">
                <Shield className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
                <p>Default security policies for new institutions</p>
                <p className="mt-1">Configure password requirements, session limits, and access controls</p>
              </div>
            </div>
          )}

          {activeTab === "regional" && (
            <div className="space-y-5">
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">Regional Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Default Language</label>
                    <select className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Date Format</label>
                    <select className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Time Format</label>
                    <select className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                      <option>12-hour (AM/PM)</option>
                      <option>24-hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#6b7280] mb-1.5 block font-medium">Currency</label>
                    <select className="w-full bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
