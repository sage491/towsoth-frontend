import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';
import { FileText, Download } from 'lucide-react';

export function BrandingAuditLog() {
  const { getAuditLog } = useInstitutionBranding();
  const auditLog = getAuditLog();

  const handleExport = () => {
    const dataStr = JSON.stringify(auditLog, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `branding-audit-log-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadge = (action: string) => {
    const badges = {
      'branding-updated': { bg: 'bg-[#dbeafe]', border: 'border-[#93c5fd]', text: 'text-[#3b82f6]', label: 'Updated' },
      'branding-reset': { bg: 'bg-[#fee2e2]', border: 'border-[#fca5a5]', text: 'text-[#dc2626]', label: 'Reset' },
      'logo-uploaded': { bg: 'bg-[#d1fae5]', border: 'border-[#86efac]', text: 'text-[#059669]', label: 'Logo Added' },
      'logo-removed': { bg: 'bg-[#fef3c7]', border: 'border-[#fcd34d]', text: 'text-[#f59e0b]', label: 'Logo Removed' },
    };

    const badge = badges[action as keyof typeof badges] || { 
      bg: 'bg-[#f3f4f6]', 
      border: 'border-[#d1d5db]', 
      text: 'text-[#6b7280]', 
      label: action 
    };

    return (
      <span className={`text-[10px] px-2 py-1 ${badge.bg} border ${badge.border} ${badge.text} uppercase tracking-wider`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-white border border-[#d1d5db]">
      <div className="px-6 py-4 border-b border-[#d1d5db] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#374151]" />
          <div>
            <h2 className="text-[15px] text-[#111827]">Branding Audit Log</h2>
            <p className="text-[11px] text-[#6b7280]">{auditLog.length} entries • Last 100 events tracked</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="px-3 py-2 border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors flex items-center gap-2 text-[12px]"
          disabled={auditLog.length === 0}
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      {auditLog.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
          <p className="text-[13px] text-[#6b7280]">No branding changes yet</p>
          <p className="text-[11px] text-[#9ca3af] mt-1">
            All branding updates will be logged here
          </p>
        </div>
      ) : (
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full">
            <thead className="bg-[#f9fafb] border-b border-[#d1d5db] sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Admin</th>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Field</th>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry) => (
                <tr key={entry.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 text-[11px] text-[#6b7280]">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-[12px] text-[#374151]">{entry.adminName}</p>
                      <p className="text-[10px] text-[#9ca3af]">{entry.adminId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getActionBadge(entry.action)}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6b7280]">
                    {entry.field || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {entry.oldValue && entry.newValue ? (
                      <div className="text-[11px]">
                        <div className="mb-1">
                          <span className="text-[#9ca3af]">From: </span>
                          <span className="text-[#dc2626]">{entry.oldValue}</span>
                        </div>
                        <div>
                          <span className="text-[#9ca3af]">To: </span>
                          <span className="text-[#059669]">{entry.newValue}</span>
                        </div>
                      </div>
                    ) : entry.newValue ? (
                      <span className="text-[11px] text-[#059669]">{entry.newValue}</span>
                    ) : (
                      <span className="text-[11px] text-[#9ca3af]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
