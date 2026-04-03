import { useState } from 'react';
import { Upload, CheckCircle, Clock, Play } from 'lucide-react';
import { DataImportWizard } from './DataImportWizard';

type ImportStatus = 'not-started' | 'in-progress' | 'completed';

export function DataImportCard() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>('not-started');
  const [importedCount, setImportedCount] = useState({
    students: 0,
    faculty: 0,
    staff: 0
  });

  const handleImportSuccess = () => {
    setImportStatus('completed');
    // In production, this would update from actual imported data
    setImportedCount({
      students: 245,
      faculty: 18,
      staff: 12
    });
  };

  const getStatusDisplay = () => {
    switch (importStatus) {
      case 'not-started':
        return {
          icon: Upload,
          text: 'Not Started',
          color: 'text-[#6b7280]',
          bgColor: 'bg-[#f3f4f6]',
          borderColor: 'border-[#d1d5db]'
        };
      case 'in-progress':
        return {
          icon: Clock,
          text: 'In Progress',
          color: 'text-[#f59e0b]',
          bgColor: 'bg-[#fef3c7]',
          borderColor: 'border-[#fbbf24]'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'Completed',
          color: 'text-[#10b981]',
          bgColor: 'bg-[#d1fae5]',
          borderColor: 'border-[#10b981]'
        };
    }
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;
  const totalImported = importedCount.students + importedCount.faculty + importedCount.staff;

  return (
    <>
      <div className="bg-white border border-[#e5e7eb] hover:border-[var(--brand-primary)] transition-all">
        <div className="p-5 border-b border-[#f3f4f6]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#dbeafe] flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div>
                <h3 className="text-[14px] text-[#111827] font-medium">Import Existing Data</h3>
                <p className="text-[11px] text-[#6b7280] mt-0.5">
                  Upload your existing student, faculty, and staff records
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-[11px] border ${status.bgColor} ${status.borderColor} ${status.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {status.text}
            </span>

            {importStatus === 'completed' && (
              <span className="text-[11px] text-[#6b7280]">
                {totalImported} records imported
              </span>
            )}
          </div>
        </div>

        {/* Progress or Results */}
        {importStatus === 'not-started' && (
          <div className="p-5">
            <div className="bg-[#dbeafe] border border-[#3b82f6] p-4 mb-4">
              <p className="text-[12px] text-[#1e40af]">
                <strong>Quick Start:</strong> Import your existing data to get up and running quickly.
              </p>
              <ul className="text-[11px] text-[#1e40af] mt-2 ml-4 list-disc space-y-1">
                <li>Supports CSV and Excel files</li>
                <li>Automatic column mapping</li>
                <li>Data validation before import</li>
                <li>Sample templates provided</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setIsWizardOpen(true);
                setImportStatus('in-progress');
              }}
              className="w-full px-4 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Import
            </button>
          </div>
        )}

        {importStatus === 'in-progress' && (
          <div className="p-5">
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#6b7280]">Upload Progress</span>
                <span className="text-[#111827] font-medium">25%</span>
              </div>
              <div className="w-full bg-[#e5e7eb] h-2">
                <div className="bg-[#3b82f6] h-2 w-1/4 transition-all duration-300"></div>
              </div>
            </div>

            <button
              onClick={() => setIsWizardOpen(true)}
              className="w-full px-4 py-2.5 border border-[#d1d5db] hover:border-[#9ca3af] text-[#374151] hover:text-[#111827] text-[13px] transition-all"
            >
              Continue Import
            </button>
          </div>
        )}

        {importStatus === 'completed' && (
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-[#f9fafb] border border-[#e5e7eb]">
                <p className="text-[20px] text-[#111827] font-light">{importedCount.students}</p>
                <p className="text-[10px] text-[#6b7280] uppercase tracking-wider">Students</p>
              </div>
              <div className="text-center p-3 bg-[#f9fafb] border border-[#e5e7eb]">
                <p className="text-[20px] text-[#111827] font-light">{importedCount.faculty}</p>
                <p className="text-[10px] text-[#6b7280] uppercase tracking-wider">Faculty</p>
              </div>
              <div className="text-center p-3 bg-[#f9fafb] border border-[#e5e7eb]">
                <p className="text-[20px] text-[#111827] font-light">{importedCount.staff}</p>
                <p className="text-[10px] text-[#6b7280] uppercase tracking-wider">Staff</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsWizardOpen(true);
              }}
              className="w-full px-4 py-2.5 border border-[#d1d5db] hover:border-[#9ca3af] text-[#374151] hover:text-[#111827] text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import More Data
            </button>
          </div>
        )}
      </div>

      {/* Import Wizard Modal */}
      <DataImportWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </>
  );
}
