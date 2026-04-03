import { useAdminModeEngine } from '../../contexts/AdminModeEngine';
import { FileText, Download, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function AdminModeAuditLog() {
  const { getAuditLog, clearAuditLog } = useAdminModeEngine();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const auditLog = getAuditLog();

  const handleExport = () => {
    const dataStr = JSON.stringify(auditLog, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-mode-audit-log-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (showConfirm) {
      clearAuditLog();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const getActionBadge = (action: string) => {
    const badges = {
      'mode-changed': { bg: 'bg-[#dbeafe]', border: 'border-[#93c5fd]', text: 'text-[#3b82f6]', label: 'Mode Changed' },
      'manual-override': { bg: 'bg-[#fef3c7]', border: 'border-[#fcd34d]', text: 'text-[#f59e0b]', label: 'Override' },
      'reset-visibility': { bg: 'bg-[#ede9fe]', border: 'border-[#c4b5fd]', text: 'text-[#8b5cf6]', label: 'Reset' },
      'simplified-dashboard': { bg: 'bg-[#d1fae5]', border: 'border-[#86efac]', text: 'text-[#059669]', label: 'Simplified' },
      'show-everything': { bg: 'bg-[#fee2e2]', border: 'border-[#fca5a5]', text: 'text-[#dc2626]', label: 'Show All' },
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

  const getSourceBadge = (source: string) => {
    const badges = {
      'manual': { bg: 'bg-[#f0f9ff]', text: 'text-[#0c4a6e]', label: 'Manual' },
      'auto-detected': { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', label: 'Auto' },
      'system-reset': { bg: 'bg-[#f3f4f6]', text: 'text-[#374151]', label: 'System' },
    };

    const badge = badges[source as keyof typeof badges] || { 
      bg: 'bg-[#f3f4f6]', 
      text: 'text-[#6b7280]', 
      label: source 
    };

    return (
      <span className={`text-[10px] px-2 py-1 ${badge.bg} ${badge.text}`}>
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
            <h2 className="text-[15px] text-[#111827]">Admin Mode Audit Log</h2>
            <p className="text-[11px] text-[#6b7280]">{auditLog.length} entries • Last 100 events tracked</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-2 border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors flex items-center gap-2 text-[12px]"
            disabled={auditLog.length === 0}
          >
            <Download className="w-3 h-3" />
            Export
          </button>
          <button
            onClick={handleClear}
            className={`px-3 py-2 transition-colors flex items-center gap-2 text-[12px] ${
              showConfirm
                ? 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
                : 'border border-[#d1d5db] hover:bg-[#f9fafb]'
            }`}
            disabled={auditLog.length === 0}
          >
            <Trash2 className="w-3 h-3" />
            {showConfirm ? 'Confirm Clear?' : 'Clear Log'}
          </button>
        </div>
      </div>

      {auditLog.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
          <p className="text-[13px] text-[#6b7280]">No audit entries yet</p>
          <p className="text-[11px] text-[#9ca3af] mt-1">
            Mode changes and actions will be logged here
          </p>
        </div>
      ) : (
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full">
            <thead className="bg-[#f9fafb] border-b border-[#d1d5db] sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Admin</th>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Change</th>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">Details</th>
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
                  <td className="px-4 py-3">
                    {entry.oldValue && entry.newValue ? (
                      <div className="text-[11px]">
                        <span className="text-[#dc2626]">{entry.oldValue}</span>
                        {' → '}
                        <span className="text-[#059669]">{entry.newValue}</span>
                      </div>
                    ) : entry.newValue ? (
                      <span className="text-[11px] text-[#059669]">{entry.newValue}</span>
                    ) : (
                      <span className="text-[11px] text-[#9ca3af]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {getSourceBadge(entry.source)}
                  </td>
                  <td className="px-4 py-3">
                    {entry.metadata && Object.keys(entry.metadata).length > 0 ? (
                      <details className="text-[11px] text-[#6b7280]">
                        <summary className="cursor-pointer hover:text-[#374151]">View</summary>
                        <pre className="mt-2 p-2 bg-[#f9fafb] border border-[#e5e7eb] text-[10px] overflow-auto">
                          {JSON.stringify(entry.metadata, null, 2)}
                        </pre>
                      </details>
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

      <div className="px-6 py-3 bg-[#f9fafb] border-t border-[#d1d5db]">
        <p className="text-[11px] text-[#6b7280]">
          ℹ️ All admin mode changes are logged for auditability. This data is stored locally in your browser.
        </p>
      </div>
    </div>
  );
}
