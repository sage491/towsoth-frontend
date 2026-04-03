import { useState } from 'react';
import { Upload, Database, History, FileText, AlertCircle, Download, CheckCircle, Clock } from 'lucide-react';
import { DataImportWizard } from '../import/DataImportWizard';
import { useAdminModeEngine } from '../../contexts/AdminModeEngine';

type TabType = 'import' | 'history' | 'templates' | 'validation';

interface ImportHistoryEntry {
  id: string;
  date: string;
  dataType: string;
  recordsImported: number;
  status: 'success' | 'partial' | 'failed';
  importedBy: string;
  errors?: number;
}

export function ImportDataPage() {
  const [activeTab, setActiveTab] = useState<TabType>('import');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { state } = useAdminModeEngine();
  const isOnboarding = state === 'onboarding';

  // Mock import history
  const importHistory: ImportHistoryEntry[] = [
    {
      id: 'IMP001',
      date: '2025-01-10 14:30',
      dataType: 'Students',
      recordsImported: 245,
      status: 'success',
      importedBy: 'Admin User',
    },
    {
      id: 'IMP002',
      date: '2025-01-10 14:25',
      dataType: 'Faculty',
      recordsImported: 18,
      status: 'success',
      importedBy: 'Admin User',
    },
    {
      id: 'IMP003',
      date: '2025-01-09 10:15',
      dataType: 'Students',
      recordsImported: 120,
      status: 'partial',
      importedBy: 'Admin User',
      errors: 5,
    },
  ];

  // Mock templates
  const templates = [
    {
      name: 'Student Import Template',
      description: 'Template for importing student records with all required fields',
      filename: 'student_import_template.xlsx',
      fields: ['Name', 'Email', 'Roll Number', 'Program', 'Batch', 'Year'],
    },
    {
      name: 'Faculty Import Template',
      description: 'Template for importing faculty records with department info',
      filename: 'faculty_import_template.xlsx',
      fields: ['Name', 'Email', 'Employee ID', 'Department', 'Designation'],
    },
    {
      name: 'Staff Import Template',
      description: 'Template for importing staff records',
      filename: 'staff_import_template.xlsx',
      fields: ['Name', 'Email', 'Employee ID', 'Department', 'Role'],
    },
  ];

  // Mock validation logs
  const validationLogs = [
    {
      id: 'VAL001',
      date: '2025-01-10 14:30',
      importId: 'IMP001',
      type: 'warning',
      message: 'Duplicate email detected: student@example.com',
      resolved: true,
    },
    {
      id: 'VAL002',
      date: '2025-01-09 10:15',
      importId: 'IMP003',
      type: 'error',
      message: 'Invalid date format in row 45',
      resolved: false,
    },
    {
      id: 'VAL003',
      date: '2025-01-09 10:15',
      importId: 'IMP003',
      type: 'error',
      message: 'Missing required field "Email" in row 67',
      resolved: false,
    },
  ];

  const handleDownloadTemplate = (filename: string) => {
    console.log('Downloading template:', filename);
    // In production, this would trigger actual file download
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-[#6b7280]" />
            <h1 className="text-[20px] text-[#111827]">Import Data</h1>
            {isOnboarding ? (
              <span className="px-2 py-0.5 bg-[#dbeafe] border border-[#3b82f6] text-[#1e40af] text-[10px] uppercase tracking-wider font-medium">
                Setup
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-[#fef3c7] border border-[#f59e0b] text-[#92400e] text-[10px] uppercase tracking-wider font-medium">
                Advanced
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#6b7280]">
            Import student, faculty, and staff data from Excel or CSV files
          </p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Start Import
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Total Imports</p>
          <p className="text-[28px] text-[#111827]">12</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Records Imported</p>
          <p className="text-[28px] text-[#059669]">1,245</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Success Rate</p>
          <p className="text-[28px] text-[#111827]">98%</p>
        </div>
        <div className="bg-white border border-[#d1d5db] p-4">
          <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Last Import</p>
          <p className="text-[13px] text-[#111827] mt-2">Jan 10, 2025</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#d1d5db] mb-4">
        <div className="flex gap-6 px-6">
          {[
            { id: 'import' as TabType, label: 'Import Data', icon: Upload },
            { id: 'history' as TabType, label: 'Import History', icon: History },
            { id: 'templates' as TabType, label: 'Templates', icon: FileText },
            { id: 'validation' as TabType, label: 'Validation Logs', icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-[13px] border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-[#111827] text-[#111827]'
                    : 'border-transparent text-[#6b7280] hover:text-[#374151]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'import' && (
        <div className="bg-white border border-[#d1d5db] p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-[#dbeafe] flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <h2 className="text-[17px] text-[#111827] mb-2">Import Your Data</h2>
            <p className="text-[13px] text-[#6b7280] mb-6">
              Upload your existing student, faculty, and staff records to quickly populate your institution's database.
            </p>

            <div className="bg-[#f9fafb] border border-[#e5e7eb] p-6 mb-6 text-left">
              <h3 className="text-[13px] text-[#111827] font-medium mb-3">Before You Start</h3>
              <ul className="text-[12px] text-[#6b7280] space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span>Download the appropriate template from the Templates tab</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span>Ensure all required fields are filled correctly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span>Supported formats: CSV, XLSX, XLS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span>Maximum file size: 10MB</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Upload className="w-4 h-4" />
              Start Import Wizard
            </button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white border border-[#d1d5db]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9fafb] border-b border-[#d1d5db]">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Import ID
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Data Type
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Imported By
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {importHistory.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#111827] font-medium">{entry.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#6b7280]">{entry.date}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#374151]">{entry.dataType}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#111827]">{entry.recordsImported}</span>
                      {entry.errors && (
                        <span className="ml-2 text-[11px] text-[#dc2626]">({entry.errors} errors)</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#6b7280]">{entry.importedBy}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        {entry.status === 'success' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#d1fae5] border border-[#86efac] text-[#059669] text-[11px]">
                            <CheckCircle className="w-3 h-3" />
                            Success
                          </span>
                        )}
                        {entry.status === 'partial' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fef3c7] border border-[#fcd34d] text-[#d97706] text-[11px]">
                            <AlertCircle className="w-3 h-3" />
                            Partial
                          </span>
                        )}
                        {entry.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fee2e2] border border-[#fca5a5] text-[#dc2626] text-[11px]">
                            <AlertCircle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid gap-4">
          {templates.map((template, idx) => (
            <div key={idx} className="bg-white border border-[#d1d5db] p-5 hover:border-[var(--brand-primary)] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-[#dbeafe] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[14px] text-[#111827] font-medium mb-1">{template.name}</h3>
                    <p className="text-[12px] text-[#6b7280] mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.fields.map((field) => (
                        <span
                          key={field}
                          className="px-2 py-0.5 bg-[#f3f4f6] border border-[#e5e7eb] text-[#6b7280] text-[10px]"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadTemplate(template.filename)}
                  className="px-4 py-2 border border-[#d1d5db] hover:border-[#9ca3af] text-[#374151] hover:text-[#111827] text-[12px] font-normal hover:font-semibold transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'validation' && (
        <div className="bg-white border border-[#d1d5db]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9fafb] border-b border-[#d1d5db]">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Import ID
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] text-[#6b7280] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {validationLogs.map((log) => (
                  <tr key={log.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#6b7280]">{log.date}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#111827] font-medium">{log.importId}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[11px] uppercase tracking-wider ${
                          log.type === 'error' ? 'text-[#dc2626]' : 'text-[#f59e0b]'
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#374151]">{log.message}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        {log.resolved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#d1fae5] border border-[#86efac] text-[#059669] text-[11px]">
                            <CheckCircle className="w-3 h-3" />
                            Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fee2e2] border border-[#fca5a5] text-[#dc2626] text-[11px]">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import Wizard Modal */}
      <DataImportWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={() => {
          console.log('Import completed successfully');
          setActiveTab('history');
        }}
      />
    </div>
  );
}
