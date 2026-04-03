import { useState } from 'react';
import { X, Upload, FileSpreadsheet, Users, UserCog, Briefcase, CheckCircle, AlertCircle, Download, ArrowRight, ArrowLeft, RefreshCw, FileText, MapPin, Eye } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

type DataType = 'students' | 'faculty' | 'staff' | 'academic';
type ImportStatus = 'idle' | 'uploading' | 'mapping' | 'validating' | 'previewing' | 'importing' | 'complete' | 'error';

interface DataImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface UploadedFile {
  type: DataType;
  file: File;
  data?: any[];
  columns?: string[];
}

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
}

interface ValidationError {
  row: number;
  field: string;
  error: string;
  severity: 'error' | 'warning';
}

export function DataImportWizard({ isOpen, onClose, onSuccess }: DataImportWizardProps) {
  const { success, error: showError } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDataTypes, setSelectedDataTypes] = useState<DataType[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [columnMappings, setColumnMappings] = useState<{ [key in DataType]?: ColumnMapping[] }>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [importProgress, setImportProgress] = useState(0);

  if (!isOpen) return null;

  const dataTypeOptions = [
    {
      id: 'students' as DataType,
      name: 'Students',
      description: 'Import student records with enrollment data',
      icon: Users,
      color: 'text-[#3b82f6]',
      bgColor: 'bg-[#dbeafe]',
      borderColor: 'border-[#3b82f6]'
    },
    {
      id: 'faculty' as DataType,
      name: 'Faculty',
      description: 'Import faculty members and their assignments',
      icon: UserCog,
      color: 'text-[#059669]',
      bgColor: 'bg-[#d1fae5]',
      borderColor: 'border-[#059669]'
    },
    {
      id: 'staff' as DataType,
      name: 'Staff',
      description: 'Import administrative and support staff',
      icon: Briefcase,
      color: 'text-[#f59e0b]',
      bgColor: 'bg-[#fef3c7]',
      borderColor: 'border-[#f59e0b]'
    },
    {
      id: 'academic' as DataType,
      name: 'Academic Structure',
      description: 'Import streams, batches, and sections',
      icon: FileText,
      color: 'text-[#8b5cf6]',
      bgColor: 'bg-[#ede9fe]',
      borderColor: 'border-[#8b5cf6]'
    }
  ];

  // Field mappings for each data type
  const fieldMappings = {
    students: [
      { field: 'studentId', label: 'Student ID', required: true },
      { field: 'name', label: 'Name', required: true },
      { field: 'email', label: 'Email', required: true },
      { field: 'phone', label: 'Phone', required: false },
      { field: 'stream', label: 'Stream/Branch', required: true },
      { field: 'batch', label: 'Batch', required: true },
      { field: 'section', label: 'Section', required: false },
      { field: 'rollNumber', label: 'Roll Number', required: true },
      { field: 'year', label: 'Year', required: false }
    ],
    faculty: [
      { field: 'facultyId', label: 'Faculty ID', required: true },
      { field: 'name', label: 'Name', required: true },
      { field: 'email', label: 'Email', required: true },
      { field: 'department', label: 'Department', required: true },
      { field: 'subjects', label: 'Subjects', required: false }
    ],
    staff: [
      { field: 'staffId', label: 'Staff ID', required: true },
      { field: 'name', label: 'Name', required: true },
      { field: 'email', label: 'Email', required: true },
      { field: 'role', label: 'Role', required: true },
      { field: 'department', label: 'Department', required: false }
    ],
    academic: [
      { field: 'streamCode', label: 'Stream Code', required: true },
      { field: 'streamName', label: 'Stream Name', required: true },
      { field: 'batchName', label: 'Batch Name', required: false },
      { field: 'academicYear', label: 'Academic Year', required: false }
    ]
  };

  // Toggle data type selection
  const toggleDataType = (type: DataType) => {
    setSelectedDataTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Download sample template
  const downloadTemplate = (type: DataType) => {
    const templates = {
      students: `student_id,name,email,phone,branch,year,section,batch,roll_no
STU001,John Doe,john.doe@example.com,9876543210,Computer Science,2024,A,2024-CS-A,CS001
STU002,Jane Smith,jane.smith@example.com,9876543211,Electronics,2024,B,2024-ECE-B,ECE002`,
      faculty: `faculty_id,name,email,department,subjects
FAC001,Dr. Rajesh Kumar,rajesh.kumar@example.com,Computer Science,"Data Structures, Algorithms"
FAC002,Prof. Priya Sharma,priya.sharma@example.com,Electronics,"Circuit Design, Signals"`,
      staff: `staff_id,name,email,role,department
STF001,Admin Raj,admin.raj@example.com,Administrator,Administration
STF002,Clerk Kumar,clerk.kumar@example.com,Office Clerk,Accounts`,
      academic: `stream_code,stream_name,batch_name,academic_year
CS,Computer Science,2024-CS-A,2024-2025
ECE,Electronics,2024-ECE-B,2024-2025`
    };

    const content = templates[type];
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success(`Template downloaded for ${type}`);
  };

  // Handle file upload
  const handleFileUpload = (type: DataType, file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      showError('Please upload a CSV or Excel file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim());
      const headers = rows[0].split(',').map(h => h.trim());
      const data = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, idx) => {
          obj[header] = values[idx]?.trim() || '';
          return obj;
        }, {} as any);
      });

      setUploadedFiles(prev => {
        const filtered = prev.filter(f => f.type !== type);
        return [...filtered, { type, file, data, columns: headers }];
      });

      success(`File uploaded for ${type}: ${file.name}`);
    };
    reader.readAsText(file);
  };

  // Auto-map columns
  const autoMapColumns = (type: DataType) => {
    const uploadedFile = uploadedFiles.find(f => f.type === type);
    if (!uploadedFile?.columns) return;

    const targetFields = fieldMappings[type];
    const mappings: ColumnMapping[] = [];

    uploadedFile.columns.forEach(sourceColumn => {
      const normalized = sourceColumn.toLowerCase().replace(/[_\s]/g, '');
      const match = targetFields.find(tf =>
        tf.field.toLowerCase() === normalized ||
        tf.label.toLowerCase().replace(/[_\s]/g, '') === normalized
      );

      if (match) {
        mappings.push({
          sourceColumn,
          targetField: match.field
        });
      }
    });

    setColumnMappings(prev => ({ ...prev, [type]: mappings }));
  };

  // Validate data
  const validateData = () => {
    const errors: ValidationError[] = [];
    const emails = new Set<string>();

    uploadedFiles.forEach(({ type, data }) => {
      const mappings = columnMappings[type] || [];
      const requiredFields = fieldMappings[type].filter(f => f.required);

      data?.forEach((row, rowIndex) => {
        // Check required fields
        requiredFields.forEach(reqField => {
          const mapping = mappings.find(m => m.targetField === reqField.field);
          if (mapping) {
            const value = row[mapping.sourceColumn];
            if (!value || !value.trim()) {
              errors.push({
                row: rowIndex + 2,
                field: reqField.label,
                error: 'Required field is empty',
                severity: 'error'
              });
            }
          } else {
            errors.push({
              row: rowIndex + 2,
              field: reqField.label,
              error: 'Required field not mapped',
              severity: 'error'
            });
          }
        });

        // Check duplicate emails
        const emailMapping = mappings.find(m => m.targetField === 'email');
        if (emailMapping) {
          const email = row[emailMapping.sourceColumn];
          if (email) {
            if (emails.has(email)) {
              errors.push({
                row: rowIndex + 2,
                field: 'Email',
                error: 'Duplicate email address',
                severity: 'warning'
              });
            }
            emails.add(email);
          }
        }
      });
    });

    setValidationErrors(errors);
    return errors.filter(e => e.severity === 'error').length === 0;
  };

  // Execute import
  const executeImport = async () => {
    setImportStatus('importing');
    setImportProgress(0);

    // Simulate import process
    const steps = ['Uploading files', 'Validating data', 'Creating users', 'Linking to batches', 'Finalizing'];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setImportProgress(((i + 1) / steps.length) * 100);
    }

    setImportStatus('complete');
    success('Data imported successfully!');
    
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }
  };

  // Step navigation
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDataTypes.length > 0;
      case 2:
        return uploadedFiles.length === selectedDataTypes.length;
      case 3:
        return selectedDataTypes.every(type => columnMappings[type]?.length > 0);
      case 4:
        return validationErrors.filter(e => e.severity === 'error').length === 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      selectedDataTypes.forEach(type => autoMapColumns(type));
    }
    if (currentStep === 4) {
      if (!validateData()) {
        showError('Please fix validation errors before proceeding');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const steps = [
    'Choose Data Type',
    'Upload Files',
    'Column Mapping',
    'Validation',
    'Preview',
    'Import'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e5e7eb] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-[15px] sm:text-[17px] text-[#111827] flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#3b82f6]" />
              Import Existing Data
            </h2>
            <p className="text-[11px] sm:text-[12px] text-[#6b7280] mt-0.5">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#f3f4f6] transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-[#6b7280]" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-4 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-1">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className={`flex-1 h-1.5 transition-colors ${
                  index + 1 <= currentStep
                    ? 'bg-[#3b82f6]'
                    : 'bg-[#e5e7eb]'
                }`} />
                {index < steps.length - 1 && (
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-[11px] transition-colors ${
                    index + 1 < currentStep
                      ? 'bg-[#3b82f6] text-white'
                      : index + 1 === currentStep
                      ? 'bg-[#3b82f6] text-white'
                      : 'bg-[#e5e7eb] text-[#9ca3af]'
                  }`}>
                    {index + 1 < currentStep ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 min-h-[400px]">
          {/* Step 1: Choose Data Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-[#dbeafe] border-l-4 border-[#3b82f6] p-4">
                <p className="text-[13px] text-[#1e40af]">
                  <strong>Getting Started:</strong> Select which types of data you want to import. You can select multiple types.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleDataType(option.id)}
                    className={`p-5 border-2 transition-all text-left ${
                      selectedDataTypes.includes(option.id)
                        ? `${option.borderColor} ${option.bgColor}`
                        : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${option.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <option.icon className={`w-6 h-6 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[14px] text-[#111827] font-medium">{option.name}</h3>
                          {selectedDataTypes.includes(option.id) && (
                            <CheckCircle className={`w-4 h-4 ${option.color}`} />
                          )}
                        </div>
                        <p className="text-[12px] text-[#6b7280]">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedDataTypes.length > 0 && (
                <div className="bg-[#d1fae5] border border-[#10b981] p-4">
                  <p className="text-[12px] text-[#065f46]">
                    <strong>Selected:</strong> {selectedDataTypes.map(t =>
                      dataTypeOptions.find(o => o.id === t)?.name
                    ).join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Upload Files */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-[#dbeafe] border-l-4 border-[#3b82f6] p-4">
                <p className="text-[13px] text-[#1e40af]">
                  <strong>Upload Files:</strong> Upload one CSV or Excel file for each selected data type. Download sample templates to ensure correct format.
                </p>
              </div>

              {selectedDataTypes.map((type) => {
                const option = dataTypeOptions.find(o => o.id === type);
                const uploadedFile = uploadedFiles.find(f => f.type === type);

                return (
                  <div key={type} className="border border-[#e5e7eb] p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {option && <option.icon className={`w-5 h-5 ${option.color}`} />}
                        <h3 className="text-[14px] text-[#111827] font-medium">{option?.name}</h3>
                      </div>
                      <button
                        onClick={() => downloadTemplate(type)}
                        className="px-3 py-2 border border-[#d1d5db] hover:border-[#9ca3af] text-[#374151] hover:text-[#111827] text-[12px] transition-all flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Template
                      </button>
                    </div>

                    <div className={`border-2 border-dashed p-8 text-center transition-colors ${
                      uploadedFile ? 'border-[#10b981] bg-[#d1fae5]' : 'border-[#d1d5db] hover:border-[#9ca3af]'
                    }`}>
                      {uploadedFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="w-8 h-8 text-[#10b981]" />
                          <p className="text-[13px] text-[#065f46] font-medium">{uploadedFile.file.name}</p>
                          <p className="text-[11px] text-[#065f46]">
                            {uploadedFile.data?.length} records • {uploadedFile.columns?.length} columns
                          </p>
                          <button
                            onClick={() => setUploadedFiles(prev => prev.filter(f => f.type !== type))}
                            className="mt-2 text-[11px] text-[#dc2626] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <FileSpreadsheet className="w-12 h-12 text-[#9ca3af] mx-auto mb-3" />
                          <p className="text-[13px] text-[#111827] mb-2">Drop file here or click to browse</p>
                          <p className="text-[11px] text-[#6b7280] mb-4">CSV or Excel (.xlsx) files only</p>
                          <input
                            type="file"
                            accept=".csv,.xlsx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(type, file);
                            }}
                            className="hidden"
                            id={`file-upload-${type}`}
                          />
                          <label
                            htmlFor={`file-upload-${type}`}
                            className="inline-block px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[12px] cursor-pointer transition-colors"
                          >
                            Choose File
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 3: Column Mapping */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-[#dbeafe] border-l-4 border-[#3b82f6] p-4">
                <p className="text-[13px] text-[#1e40af]">
                  <strong>Map Columns:</strong> Match your uploaded columns to system fields. We've auto-mapped common fields for you.
                </p>
              </div>

              {selectedDataTypes.map((type) => {
                const uploadedFile = uploadedFiles.find(f => f.type === type);
                const option = dataTypeOptions.find(o => o.id === type);
                const mappings = columnMappings[type] || [];

                if (!uploadedFile) return null;

                return (
                  <div key={type} className="border border-[#e5e7eb] p-5">
                    <div className="flex items-center gap-3 mb-4">
                      {option && <option.icon className={`w-5 h-5 ${option.color}`} />}
                      <h3 className="text-[14px] text-[#111827] font-medium">{option?.name}</h3>
                      <button
                        onClick={() => autoMapColumns(type)}
                        className="ml-auto text-[11px] text-[#3b82f6] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Auto-map
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-2">Your Columns</p>
                        <div className="space-y-2">
                          {uploadedFile.columns?.map((col, idx) => (
                            <div key={idx} className="px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] text-[12px] text-[#374151]">
                              {col}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-2">System Fields</p>
                        <div className="space-y-2">
                          {fieldMappings[type].map((field) => {
                            const mapping = mappings.find(m => m.targetField === field.field);
                            return (
                              <div
                                key={field.field}
                                className={`px-3 py-2 border text-[12px] ${
                                  mapping
                                    ? 'bg-[#d1fae5] border-[#10b981] text-[#065f46]'
                                    : field.required
                                    ? 'bg-[#fee2e2] border-[#ef4444] text-[#991b1b]'
                                    : 'bg-white border-[#e5e7eb] text-[#6b7280]'
                                }`}
                              >
                                {field.label}
                                {field.required && <span className="text-[#dc2626] ml-1">*</span>}
                                {mapping && (
                                  <span className="text-[10px] block mt-1">← {mapping.sourceColumn}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Preview first 3 records */}
                    {uploadedFile.data && uploadedFile.data.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                        <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-2">Preview (First 3 Records)</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-[11px]">
                            <thead>
                              <tr className="border-b border-[#e5e7eb]">
                                {uploadedFile.columns?.map((col, idx) => (
                                  <th key={idx} className="text-left px-2 py-2 text-[#6b7280] font-normal">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {uploadedFile.data.slice(0, 3).map((row, idx) => (
                                <tr key={idx} className="border-b border-[#f3f4f6]">
                                  {uploadedFile.columns?.map((col, colIdx) => (
                                    <td key={colIdx} className="px-2 py-2 text-[#374151]">{row[col]}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 4: Validation */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-[#dbeafe] border-l-4 border-[#3b82f6] p-4">
                <p className="text-[13px] text-[#1e40af]">
                  <strong>Validation:</strong> We're checking your data for errors and duplicates.
                </p>
              </div>

              <button
                onClick={validateData}
                className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Run Validation
              </button>

              {validationErrors.length > 0 ? (
                <div className="border border-[#e5e7eb] divide-y divide-[#f3f4f6]">
                  <div className="p-4 bg-[#f9fafb]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[13px] text-[#111827] font-medium">Validation Results</h3>
                      <div className="flex items-center gap-4 text-[12px]">
                        <span className="text-[#dc2626]">
                          {validationErrors.filter(e => e.severity === 'error').length} Errors
                        </span>
                        <span className="text-[#f59e0b]">
                          {validationErrors.filter(e => e.severity === 'warning').length} Warnings
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {validationErrors.map((err, idx) => (
                      <div key={idx} className="p-3 flex items-start gap-3">
                        <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          err.severity === 'error' ? 'text-[#dc2626]' : 'text-[#f59e0b]'
                        }`} />
                        <div className="flex-1">
                          <p className="text-[12px] text-[#111827]">
                            <strong>Row {err.row}:</strong> {err.field} - {err.error}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 ${
                          err.severity === 'error'
                            ? 'bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]'
                            : 'bg-[#fef3c7] text-[#92400e] border border-[#fcd34d]'
                        }`}>
                          {err.severity.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#d1fae5] border border-[#10b981] p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-[#10b981] mx-auto mb-3" />
                  <p className="text-[14px] text-[#065f46] font-medium">No validation errors found!</p>
                  <p className="text-[12px] text-[#065f46] mt-1">Your data is ready to import.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Preview */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-[#dbeafe] border-l-4 border-[#3b82f6] p-4">
                <p className="text-[13px] text-[#1e40af]">
                  <strong>Import Preview:</strong> Review what will be imported before proceeding.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedDataTypes.map((type) => {
                  const option = dataTypeOptions.find(o => o.id === type);
                  const uploadedFile = uploadedFiles.find(f => f.type === type);
                  const count = uploadedFile?.data?.length || 0;

                  return (
                    <div key={type} className={`p-5 border-2 ${option?.borderColor} ${option?.bgColor}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {option && <option.icon className={`w-6 h-6 ${option.color}`} />}
                        <h3 className="text-[13px] text-[#111827] font-medium">{option?.name}</h3>
                      </div>
                      <p className="text-[24px] text-[#111827] font-light">{count}</p>
                      <p className="text-[11px] text-[#6b7280]">records will be added</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#fef3c7] border border-[#fbbf24] p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#92400e] flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-[#92400e] mb-2">
                      <strong>Important:</strong> This action cannot be undone easily. Please review carefully before proceeding.
                    </p>
                    <ul className="text-[11px] text-[#92400e] space-y-1 ml-4 list-disc">
                      <li>New user accounts will be created</li>
                      <li>Data will appear in all relevant modules and dashboards</li>
                      <li>Existing data will not be modified</li>
                      <li>Audit logs will track this import</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Import */}
          {currentStep === 6 && (
            <div className="space-y-6">
              {importStatus === 'importing' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-[#e5e7eb] border-t-[#3b82f6] rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-[15px] text-[#111827] mb-2">Importing Data...</h3>
                  <p className="text-[13px] text-[#6b7280] mb-4">Please wait while we process your files</p>
                  
                  <div className="max-w-md mx-auto">
                    <div className="w-full bg-[#e5e7eb] h-2 mb-2">
                      <div
                        className="bg-[#3b82f6] h-2 transition-all duration-300"
                        style={{ width: `${importProgress}%` }}
                      />
                    </div>
                    <p className="text-[12px] text-[#6b7280]">{Math.round(importProgress)}% Complete</p>
                  </div>
                </div>
              )}

              {importStatus === 'complete' && (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-[#10b981] mx-auto mb-4" />
                  <h3 className="text-[17px] text-[#111827] mb-2">Import Successful!</h3>
                  <p className="text-[13px] text-[#6b7280] mb-6">
                    Your data has been imported and is now available across all modules.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {uploadedFiles.map(({ type, data }) => {
                      const option = dataTypeOptions.find(o => o.id === type);
                      return (
                        <div key={type} className="p-4 bg-[#d1fae5] border border-[#10b981]">
                          <p className="text-[24px] text-[#111827] font-light mb-1">{data?.length || 0}</p>
                          <p className="text-[12px] text-[#065f46]">{option?.name} Added</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {importStatus === 'idle' && (
                <div className="text-center py-8">
                  <button
                    onClick={executeImport}
                    className="px-8 py-4 bg-[#10b981] hover:bg-[#059669] text-white text-[14px] font-medium transition-colors flex items-center gap-3 mx-auto"
                  >
                    <Upload className="w-5 h-5" />
                    Start Import Process
                  </button>
                  <p className="text-[11px] text-[#6b7280] mt-3">
                    Click to begin importing your data
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#e5e7eb] px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="order-2 sm:order-1">
            {currentStep > 1 && importStatus !== 'importing' && importStatus !== 'complete' && (
              <button
                onClick={handleBack}
                className="w-full sm:w-auto px-4 py-2 text-[13px] text-[#6b7280] hover:text-[#111827] transition-all flex items-center justify-center sm:justify-start gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>

          <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {importStatus === 'complete' ? (
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white text-[13px] transition-all"
              >
                Done
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-[#d1d5db] hover:border-[#9ca3af] text-[#374151] hover:text-[#111827] text-[13px] transition-all"
                >
                  Cancel
                </button>

                {currentStep < 6 && importStatus !== 'importing' && (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="px-5 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
