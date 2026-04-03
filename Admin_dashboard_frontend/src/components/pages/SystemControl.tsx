import { Shield, Database, Link2, FileText } from 'lucide-react';
import { FeatureTogglePanel } from '../admin/FeatureTogglePanel';
import { FeatureControlHub } from '../admin/FeatureControlHub';
import { AdminModeAuditLog } from '../admin/AdminModeAuditLog';

export function SystemControl() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">System Control</h1>
        <p className="text-[13px] text-[#6b7280]">Manage roles, permissions, integrations, and audit logs</p>
      </div>

      {/* Admin Mode Audit Log */}
      <div className="mb-6">
        <AdminModeAuditLog />
      </div>

      {/* Feature Control Hub */}
      <div className="mb-6">
        <FeatureControlHub />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Active Users</p>
          <p className="text-[28px] text-[#111827]">1,416</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">User Roles</p>
          <p className="text-[28px] text-[#111827]">7</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Integrations</p>
          <p className="text-[28px] text-[#111827]">4</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Audit Logs</p>
          <p className="text-[28px] text-[#111827]">2,847</p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Roles & Permissions */}
        <div className="bg-white border border-[#d1d5db] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#374151]" />
              <h2 className="text-[15px] text-[#111827]">Roles & Permissions</h2>
            </div>
            <button className="text-[12px] text-[#3b82f6] hover:underline">Manage</button>
          </div>
          <div className="space-y-2">
            {[
              { role: 'Institution Admin', users: 4, permissions: 'Full Access' },
              { role: 'Faculty', users: 84, permissions: 'Content, Assessments, Students' },
              { role: 'Student', users: 1248, permissions: 'Content Access, Assessments' },
              { role: 'Staff', users: 38, permissions: 'Operations, Reports' },
              { role: 'Guest Faculty', users: 12, permissions: 'Limited Content' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-[#e5e7eb]">
                <div>
                  <p className="text-[13px] text-[#111827]">{item.role}</p>
                  <p className="text-[11px] text-[#6b7280] mt-0.5">{item.users} users</p>
                </div>
                <span className="text-[11px] text-[#6b7280]">{item.permissions}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Policies */}
        <div className="bg-white border border-[#d1d5db] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#374151]" />
              <h2 className="text-[15px] text-[#111827]">Data Policies</h2>
            </div>
            <button className="text-[12px] text-[#3b82f6] hover:underline">Configure</button>
          </div>
          <div className="space-y-3">
            <div className="border border-[#e5e7eb] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#374151]">Data Retention</span>
                <span className="text-[12px] text-[#059669] px-2 py-1 bg-[#d1fae5] border border-[#86efac]">Active</span>
              </div>
              <p className="text-[11px] text-[#6b7280]">Student data retained for 7 years post-graduation</p>
            </div>
            <div className="border border-[#e5e7eb] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#374151]">Backup Schedule</span>
                <span className="text-[12px] text-[#059669] px-2 py-1 bg-[#d1fae5] border border-[#86efac]">Active</span>
              </div>
              <p className="text-[11px] text-[#6b7280]">Daily at 02:00 AM, retention: 30 days</p>
            </div>
            <div className="border border-[#e5e7eb] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#374151]">Data Encryption</span>
                <span className="text-[12px] text-[#059669] px-2 py-1 bg-[#d1fae5] border border-[#86efac]">Active</span>
              </div>
              <p className="text-[11px] text-[#6b7280]">AES-256 encryption for all sensitive data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white border border-[#d1d5db] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#374151]" />
            <h2 className="text-[15px] text-[#111827]">External Integrations</h2>
          </div>
          <button className="px-3 py-1.5 border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors text-[12px]">
            Add Integration
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Google Workspace', status: 'Connected', lastSync: '2 hours ago', type: 'SSO & Email' },
            { name: 'Microsoft Azure AD', status: 'Connected', lastSync: '1 hour ago', type: 'SSO' },
            { name: 'Zoom Integration', status: 'Active', lastSync: 'Real-time', type: 'Video Conferencing' },
            { name: 'Payment Gateway', status: 'Connected', lastSync: '30 min ago', type: 'Fee Collection' },
          ].map((integration, i) => (
            <div key={i} className="border border-[#e5e7eb] p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[13px] text-[#111827]">{integration.name}</p>
                  <p className="text-[11px] text-[#6b7280] mt-0.5">{integration.type}</p>
                </div>
                <span className="text-[12px] text-[#059669] px-2 py-1 bg-[#d1fae5] border border-[#86efac]">
                  {integration.status}
                </span>
              </div>
              <p className="text-[11px] text-[#6b7280]">Last sync: {integration.lastSync}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white border border-[#d1d5db] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#374151]" />
            <h2 className="text-[15px] text-[#111827]">Recent Audit Logs</h2>
          </div>
          <button className="text-[12px] text-[#3b82f6] hover:underline">View All</button>
        </div>
        <table className="w-full">
          <thead className="bg-[#f9fafb] border-b border-[#d1d5db]">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Module</th>
              <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {[
              { time: '2024-12-27 14:32', user: 'Admin Raj', action: 'Updated batch CS-A3', module: 'Academic Structure', ip: '192.168.1.45' },
              { time: '2024-12-27 14:28', user: 'Dr. Sharma', action: 'Uploaded content', module: 'Content Management', ip: '192.168.1.87' },
              { time: '2024-12-27 14:15', user: 'Admin Raj', action: 'Created assessment', module: 'Assessments', ip: '192.168.1.45' },
              { time: '2024-12-27 14:02', user: 'System', action: 'Automated backup completed', module: 'System', ip: 'Internal' },
            ].map((log, i) => (
              <tr key={i} className="border-b border-[#e5e7eb]">
                <td className="px-4 py-3 text-[12px] text-[#6b7280]">{log.time}</td>
                <td className="px-4 py-3 text-[13px] text-[#374151]">{log.user}</td>
                <td className="px-4 py-3 text-[13px] text-[#374151]">{log.action}</td>
                <td className="px-4 py-3 text-[13px] text-[#6b7280]">{log.module}</td>
                <td className="px-4 py-3 text-[12px] text-[#6b7280]">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}