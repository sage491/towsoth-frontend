import { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { X, ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface CreateAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AssessmentType = 'Quiz' | 'Assignment' | 'Midterm' | 'Final' | 'Project';

interface AssessmentFormData {
  // Step 1: Basic Details
  title: string;
  type: AssessmentType | '';
  streamId: string;
  batchId: string;
  subjectId: string;

  // Step 2: Configuration
  totalMarks: string;
  duration: string;
  startDate: string;
  endDate: string;
  attemptLimit: string;

  // Step 3: Instructions
  instructions: string;
  passingMarks: string;
}

export function CreateAssessmentModal({ isOpen, onClose, onSuccess }: CreateAssessmentModalProps) {
  const data = useData();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AssessmentFormData>({
    title: '',
    type: '',
    streamId: '',
    batchId: '',
    subjectId: '',
    totalMarks: '',
    duration: '',
    startDate: '',
    endDate: '',
    attemptLimit: '1',
    instructions: '',
    passingMarks: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const facultyAssignment = useMemo(() => {
    if (!formData.subjectId || !formData.batchId) return null;
    return data.subjectAssignments.find(
      sa => sa.subjectId === formData.subjectId && sa.batchId === formData.batchId
    );
  }, [formData.subjectId, formData.batchId, data]);

  const assignedFaculty = facultyAssignment 
    ? data.getFacultyById(facultyAssignment.facultyId) 
    : null;

  const selectedSubject = formData.subjectId 
    ? data.getSubjectById(formData.subjectId) 
    : null;

  const selectedBatch = formData.batchId 
    ? data.getBatchById(formData.batchId) 
    : null;

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Assessment title is required';
    }

    if (!formData.type) {
      newErrors.type = 'Assessment type is required';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.totalMarks || Number(formData.totalMarks) <= 0) {
      newErrors.totalMarks = 'Total marks must be greater than 0';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!formData.attemptLimit || Number(formData.attemptLimit) <= 0) {
      newErrors.attemptLimit = 'Attempt limit must be at least 1';
    }

    if (formData.passingMarks && Number(formData.passingMarks) > Number(formData.totalMarks)) {
      newErrors.passingMarks = 'Passing marks cannot exceed total marks';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleInputChange = (field: keyof AssessmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      // Calculate number of students
      const students = data.getStudentsByBatch(formData.batchId);

      // TODO: In production, POST to actual API
      const assessmentData = {
        id: `ASS${Date.now()}`,
        title: formData.title,
        type: formData.type,
        subjectId: formData.subjectId,
        batchId: formData.batchId,
        streamId: formData.streamId,
        totalMarks: Number(formData.totalMarks),
        passingMarks: formData.passingMarks ? Number(formData.passingMarks) : Math.floor(Number(formData.totalMarks) * 0.4),
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        attemptLimit: Number(formData.attemptLimit),
        instructions: formData.instructions,
        createdBy: assignedFaculty?.id || 'SYSTEM',
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Draft',
        totalStudents: students.length,
        completedStudents: 0,
        academicYear: selectedBatch?.academicYear
      };

      console.log('Creating assessment:', assessmentData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success
      onSuccess();
      handleClose();

    } catch (error) {
      console.error('Assessment creation failed:', error);
      setErrors({ submit: 'Failed to create assessment. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: '',
      streamId: '',
      batchId: '',
      subjectId: '',
      totalMarks: '',
      duration: '',
      startDate: '',
      endDate: '',
      attemptLimit: '1',
      instructions: '',
      passingMarks: ''
    });
    setCurrentStep(1);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#d1d5db] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-[17px] text-[#111827]">Create Assessment</h2>
            <p className="text-[11px] text-[#6b7280] mt-1">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-[#6b7280] hover:text-[#111827] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="px-6 py-4 bg-[#f9fafb] border-b border-[#d1d5db]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] ${
                currentStep >= 1 ? 'bg-[#111827] text-white' : 'bg-[#e5e7eb] text-[#6b7280]'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-[12px] ${currentStep >= 1 ? 'text-[#111827]' : 'text-[#6b7280]'}`}>
                Basic Details
              </span>
            </div>

            <div className="flex-1 h-px bg-[#d1d5db] mx-4" />

            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] ${
                currentStep >= 2 ? 'bg-[#111827] text-white' : 'bg-[#e5e7eb] text-[#6b7280]'
              }`}>
                {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className={`text-[12px] ${currentStep >= 2 ? 'text-[#111827]' : 'text-[#6b7280]'}`}>
                Configuration
              </span>
            </div>

            <div className="flex-1 h-px bg-[#d1d5db] mx-4" />

            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] ${
                currentStep >= 3 ? 'bg-[#111827] text-white' : 'bg-[#e5e7eb] text-[#6b7280]'
              }`}>
                3
              </div>
              <span className={`text-[12px] ${currentStep >= 3 ? 'text-[#111827]' : 'text-[#6b7280]'}`}>
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-5">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                  Assessment Title <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Midterm Examination - Data Structures"
                  className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                    errors.title ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                  }`}
                />
                {errors.title && <p className="text-[11px] text-[#dc2626] mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                  Assessment Type <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                    errors.type ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Midterm">Midterm Exam</option>
                  <option value="Final">Final Exam</option>
                  <option value="Project">Project</option>
                </select>
                {errors.type && <p className="text-[11px] text-[#dc2626] mt-1">{errors.type}</p>}
              </div>

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
                >
                  <option value="">Select Stream</option>
                  {data.streams.map(stream => (
                    <option key={stream.id} value={stream.id}>
                      {stream.name}
                    </option>
                  ))}
                </select>
                {errors.streamId && <p className="text-[11px] text-[#dc2626] mt-1">{errors.streamId}</p>}
              </div>

              <div>
                <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                  Batch <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={formData.batchId}
                  onChange={(e) => handleBatchChange(e.target.value)}
                  disabled={!formData.streamId}
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
                {errors.batchId && <p className="text-[11px] text-[#dc2626] mt-1">{errors.batchId}</p>}
              </div>

              <div>
                <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                  Subject <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => handleInputChange('subjectId', e.target.value)}
                  disabled={!formData.batchId}
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
                {errors.subjectId && <p className="text-[11px] text-[#dc2626] mt-1">{errors.subjectId}</p>}
                {assignedFaculty && (
                  <p className="text-[11px] text-[#6b7280] mt-2">
                    Assigned Faculty: <span className="text-[#111827]">{assignedFaculty.name}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                    Total Marks <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => handleInputChange('totalMarks', e.target.value)}
                    placeholder="100"
                    min="1"
                    className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                      errors.totalMarks ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {errors.totalMarks && <p className="text-[11px] text-[#dc2626] mt-1">{errors.totalMarks}</p>}
                </div>

                <div>
                  <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                    Passing Marks (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.passingMarks}
                    onChange={(e) => handleInputChange('passingMarks', e.target.value)}
                    placeholder="40"
                    min="1"
                    className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                      errors.passingMarks ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {errors.passingMarks && <p className="text-[11px] text-[#dc2626] mt-1">{errors.passingMarks}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                  Duration (minutes) <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="60"
                  min="1"
                  className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                    errors.duration ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                  }`}
                />
                {errors.duration && <p className="text-[11px] text-[#dc2626] mt-1">{errors.duration}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                    Start Date & Time <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                      errors.startDate ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {errors.startDate && <p className="text-[11px] text-[#dc2626] mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                    End Date & Time <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                      errors.endDate ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {errors.endDate && <p className="text-[11px] text-[#dc2626] mt-1">{errors.endDate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                  Attempt Limit <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={formData.attemptLimit}
                  onChange={(e) => handleInputChange('attemptLimit', e.target.value)}
                  className={`w-full px-3 py-2 border text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] ${
                    errors.attemptLimit ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                  }`}
                >
                  <option value="1">1 Attempt</option>
                  <option value="2">2 Attempts</option>
                  <option value="3">3 Attempts</option>
                  <option value="-1">Unlimited</option>
                </select>
                {errors.attemptLimit && <p className="text-[11px] text-[#dc2626] mt-1">{errors.attemptLimit}</p>}
              </div>

              <div>
                <label className="block text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">
                  Instructions (Optional)
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Add instructions for students..."
                  rows={4}
                  className="w-full px-3 py-2 border border-[#d1d5db] text-[13px] text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#111827] resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="p-4 bg-[#f9fafb] border border-[#d1d5db]">
                <h3 className="text-[13px] text-[#111827] mb-3">Assessment Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Title:</span>
                    <span className="text-[#111827]">{formData.title}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Type:</span>
                    <span className="text-[#111827]">{formData.type}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Subject:</span>
                    <span className="text-[#111827]">{selectedSubject?.code} - {selectedSubject?.name}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Batch:</span>
                    <span className="text-[#111827]">{selectedBatch?.name}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Faculty:</span>
                    <span className="text-[#111827]">{assignedFaculty?.name}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Total Students:</span>
                    <span className="text-[#111827]">{data.getStudentsByBatch(formData.batchId).length}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#f9fafb] border border-[#d1d5db]">
                <h3 className="text-[13px] text-[#111827] mb-3">Configuration</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Total Marks:</span>
                    <span className="text-[#111827]">{formData.totalMarks}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Passing Marks:</span>
                    <span className="text-[#111827]">
                      {formData.passingMarks || Math.floor(Number(formData.totalMarks) * 0.4)} (40%)
                    </span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Duration:</span>
                    <span className="text-[#111827]">{formData.duration} minutes</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Start:</span>
                    <span className="text-[#111827]">{new Date(formData.startDate).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">End:</span>
                    <span className="text-[#111827]">{new Date(formData.endDate).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#6b7280]">Attempts:</span>
                    <span className="text-[#111827]">
                      {formData.attemptLimit === '-1' ? 'Unlimited' : formData.attemptLimit}
                    </span>
                  </div>
                </div>
              </div>

              {formData.instructions && (
                <div className="p-4 bg-[#f9fafb] border border-[#d1d5db]">
                  <h3 className="text-[13px] text-[#111827] mb-2">Instructions</h3>
                  <p className="text-[12px] text-[#6b7280]">{formData.instructions}</p>
                </div>
              )}

              {errors.submit && (
                <div className="flex items-center gap-2 p-3 bg-[#fef2f2] border border-[#fca5a5]">
                  <AlertCircle className="w-4 h-4 text-[#dc2626]" />
                  <p className="text-[12px] text-[#dc2626]">{errors.submit}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#d1d5db] flex items-center justify-between sticky bottom-0 bg-white">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2 text-[13px] text-[#374151] border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-3 h-3" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-[13px] text-[#374151] border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-[13px] text-white bg-[#111827] hover:bg-[#374151] transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-[13px] text-white bg-[#111827] hover:bg-[#374151] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Create Assessment
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
