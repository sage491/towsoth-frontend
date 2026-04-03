import { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { X, Upload, File, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ContentType = 'Lecture Notes' | 'Video Lecture' | 'Practice Set' | 'Assignment' | 'Reference Material';

export function UploadContentModal({ isOpen, onClose, onSuccess }: UploadContentModalProps) {
  const data = useData();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    contentType: '' as ContentType | '',
    streamId: '',
    batchId: '',
    subjectId: '',
    description: '',
    file: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ============================================================================
  // CASCADING DATA QUERIES
  // ============================================================================

  const availableBatches = useMemo(() => {
    if (!formData.streamId) return [];
    return data.getBatchesByStream(formData.streamId);
  }, [formData.streamId, data]);

  const availableSubjects = useMemo(() => {
    if (!formData.batchId) return [];
    return data.getSubjectsByBatch(formData.batchId);
  }, [formData.batchId, data]);

  // Get faculty assignment for selected subject
  const facultyAssignment = useMemo(() => {
    if (!formData.subjectId || !formData.batchId) return null;
    return data.subjectAssignments.find(
      sa => sa.subjectId === formData.subjectId && sa.batchId === formData.batchId
    );
  }, [formData.subjectId, formData.batchId, data]);

  const assignedFaculty = facultyAssignment 
    ? data.getFacultyById(facultyAssignment.facultyId) 
    : null;

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Content title is required';
    }

    if (!formData.contentType) {
      newErrors.contentType = 'Content type is required';
    }

    if (!formData.streamId) {
      newErrors.streamId = 'Stream is required';
    }

    if (!formData.batchId) {
      newErrors.batchId = 'Batch is required';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }

    if (!formData.file) {
      newErrors.file = 'File is required';
    } else {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4', 'video/mpeg'];
      const maxSize = 50 * 1024 * 1024; // 50MB

      if (!allowedTypes.includes(formData.file.type)) {
        newErrors.file = 'Invalid file type. Allowed: PDF, DOC, DOCX, MP4';
      }

      if (formData.file.size > maxSize) {
        newErrors.file = 'File size exceeds 50MB limit';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleStreamChange = (streamId: string) => {
    setFormData(prev => ({
      ...prev,
      streamId,
      batchId: '',
      subjectId: ''
    }));
    setErrors({});
  };

  const handleBatchChange = (batchId: string) => {
    setFormData(prev => ({
      ...prev,
      batchId,
      subjectId: ''
    }));
    setErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('file', file);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: In production, upload to actual API
      const uploadData = {
        id: `CNT${Date.now()}`,
        title: formData.title,
        type: formData.contentType,
        streamId: formData.streamId,
        batchId: formData.batchId,
        subjectId: formData.subjectId,
        description: formData.description,
        fileName: formData.file?.name,
        fileSize: formData.file?.size,
        uploadedBy: assignedFaculty?.id || 'SYSTEM',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Pending', // Will be verified by AI
        aiScore: null,
        academicYear: data.getBatchById(formData.batchId)?.academicYear
      };

      console.log('Uploading content:', uploadData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Success
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      setErrors({ submit: 'Upload failed. Please try again.' });
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      contentType: '',
      streamId: '',
      batchId: '',
      subjectId: '',
      description: '',
      file: null
    });
    setErrors({});
    setIsSubmitting(false);
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#d1d5db] flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-[17px] text-[#111827]">Upload Content</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-[#6b7280] hover:text-[#111827] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5">
          {/* Content Title */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Content Title <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Data Structures - Linked Lists"
              className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                errors.title ? 'border-[#dc2626]' : 'border-[#d1d5db]'
              }`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-[11px] text-[#dc2626] mt-1">{errors.title}</p>
            )}
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Content Type <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={formData.contentType}
              onChange={(e) => handleInputChange('contentType', e.target.value as ContentType)}
              className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                errors.contentType ? 'border-[#dc2626]' : 'border-[#d1d5db]'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select Type</option>
              <option value="Lecture Notes">Lecture Notes</option>
              <option value="Video Lecture">Video Lecture</option>
              <option value="Practice Set">Practice Set</option>
              <option value="Assignment">Assignment</option>
              <option value="Reference Material">Reference Material</option>
            </select>
            {errors.contentType && (
              <p className="text-[11px] text-[#dc2626] mt-1">{errors.contentType}</p>
            )}
          </div>

          {/* Stream */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Academic Stream <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={formData.streamId}
              onChange={(e) => handleStreamChange(e.target.value)}
              className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                errors.streamId ? 'border-[#dc2626]' : 'border-[#d1d5db]'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select Stream</option>
              {data.streams.map(stream => (
                <option key={stream.id} value={stream.id}>
                  {stream.name}
                </option>
              ))}
            </select>
            {errors.streamId && (
              <p className="text-[11px] text-[#dc2626] mt-1">{errors.streamId}</p>
            )}
          </div>

          {/* Batch */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Batch <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={formData.batchId}
              onChange={(e) => handleBatchChange(e.target.value)}
              disabled={!formData.streamId || isSubmitting}
              className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af] disabled:cursor-not-allowed ${
                errors.batchId ? 'border-[#dc2626]' : 'border-[#d1d5db]'
              }`}
            >
              <option value="">Select Batch</option>
              {availableBatches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
            {errors.batchId && (
              <p className="text-[11px] text-[#dc2626] mt-1">{errors.batchId}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Subject <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={formData.subjectId}
              onChange={(e) => handleInputChange('subjectId', e.target.value)}
              disabled={!formData.batchId || isSubmitting}
              className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af] disabled:cursor-not-allowed ${
                errors.subjectId ? 'border-[#dc2626]' : 'border-[#d1d5db]'
              }`}
            >
              <option value="">Select Subject</option>
              {availableSubjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
            {errors.subjectId && (
              <p className="text-[11px] text-[#dc2626] mt-1">{errors.subjectId}</p>
            )}
            {assignedFaculty && (
              <p className="text-[11px] text-[#6b7280] mt-2">
                Assigned Faculty: <span className="text-[#111827]">{assignedFaculty.name}</span>
              </p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Upload File <span className="text-[#dc2626]">*</span>
            </label>
            <div className={`border-2 border-dashed p-4 text-center transition-colors ${
              errors.file ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#d1d5db] hover:border-[#6b7280]'
            }`}>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.mp4"
                disabled={isSubmitting}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex flex-col items-center"
              >
                {formData.file ? (
                  <>
                    <File className="w-8 h-8 text-[#059669] mb-2" />
                    <span className="text-[13px] text-[#111827] mb-1">{formData.file.name}</span>
                    <span className="text-[11px] text-[#6b7280]">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#6b7280] mb-2" />
                    <span className="text-[13px] text-[#111827] mb-1">Click to upload file</span>
                    <span className="text-[11px] text-[#6b7280]">
                      PDF, DOC, DOCX, MP4 (max 50MB)
                    </span>
                  </>
                )}
              </label>
            </div>
            {errors.file && (
              <p className="text-[11px] text-[#dc2626] mt-1">{errors.file}</p>
            )}
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add any additional information about this content..."
              rows={3}
              className="w-full px-3 py-2 border border-[#d1d5db] text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Upload Progress */}
          {isSubmitting && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-[#6b7280]">Uploading...</span>
                <span className="text-[12px] text-[#111827]">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#e5e7eb]">
                <div
                  className="h-full bg-[#3b82f6] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-[#fef2f2] border border-[#fca5a5]">
              <AlertCircle className="w-4 h-4 text-[#dc2626]" />
              <p className="text-[12px] text-[#dc2626]">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#d1d5db] flex items-center justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-[13px] text-[#374151] border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-[13px] text-white bg-[#111827] hover:bg-[#374151] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-3 h-3" />
                Upload Content
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
