import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, Hash, GraduationCap } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { Student } from '../../data/entities';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (student: Student) => void;
}

export function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const { streams, batches, getBatchesByStream, students } = useData();
  const { success, error } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    phone: '',
    streamId: '',
    batchId: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
  });

  // UI state
  const [filteredBatches, setFilteredBatches] = useState(batches);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter batches when stream changes
  useEffect(() => {
    if (formData.streamId) {
      const batchesForStream = getBatchesByStream(formData.streamId);
      setFilteredBatches(batchesForStream);
      
      // Reset batch selection if current batch doesn't belong to selected stream
      if (formData.batchId && !batchesForStream.find(b => b.id === formData.batchId)) {
        setFormData(prev => ({ ...prev, batchId: '' }));
      }
    } else {
      setFilteredBatches(batches);
    }
  }, [formData.streamId, getBatchesByStream, batches]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
    }

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'Roll number is required';
    } else {
      // Check for duplicate roll number in the same batch
      const duplicate = students.find(
        s => s.rollNo === formData.rollNo.trim() && s.batchId === formData.batchId
      );
      if (duplicate) {
        newErrors.rollNo = `Roll number already exists in this batch (${duplicate.name})`;
      }
    }

    if (!formData.streamId) {
      newErrors.streamId = 'Please select a stream';
    }

    if (!formData.batchId) {
      newErrors.batchId = 'Please select a batch';
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field: string, value: string) => {
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create new student
      const newStudent: Student = {
        id: `STU${Date.now()}`,
        rollNo: formData.rollNo.trim(),
        name: formData.name.trim(),
        email: formData.email.trim() || '',
        streamId: formData.streamId,
        batchId: formData.batchId,
        status: 'Active',
        enrollmentDate: formData.enrollmentDate,
      };

      // In a real app, this would call an API endpoint
      // For now, we'll just show success and trigger callback
      
      success(`Student "${newStudent.name}" added successfully`);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(newStudent);
      }

      // Reset form
      handleReset();
      
      // Close modal
      onClose();

    } catch (err) {
      error('Failed to add student. Please try again.');
      console.error('Error adding student:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      rollNo: '',
      email: '',
      phone: '',
      streamId: '',
      batchId: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      handleReset();
      onClose();
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div 
          className="bg-white w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#e5e7eb] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f3f4f6] flex items-center justify-center">
                <User className="w-5 h-5 text-[#6b7280]" />
              </div>
              <div>
                <h2 className="text-[15px] text-[#111827]">Add New Student</h2>
                <p className="text-[11px] text-[#6b7280]">All fields marked with * are required</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-[#f3f4f6] transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#6b7280]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-[13px] text-[#111827] mb-4 uppercase tracking-wider">Basic Information</h3>
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Full Name <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${
                        errors.name ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                      } text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                      placeholder="Enter student's full name"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Roll Number <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                      type="text"
                      value={formData.rollNo}
                      onChange={(e) => handleChange('rollNo', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${
                        errors.rollNo ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                      } text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                      placeholder="e.g., 2024CSE001"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.rollNo && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.rollNo}</p>
                  )}
                  <p className="text-[11px] text-[#6b7280] mt-1">Must be unique within the batch</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Email <span className="text-[#9ca3af]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${
                        errors.email ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                      } text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                      placeholder="student@example.com"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Phone <span className="text-[#9ca3af]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${
                        errors.phone ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                      } text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                      placeholder="10-digit mobile number"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb]" />

            {/* Academic Mapping */}
            <div>
              <h3 className="text-[13px] text-[#111827] mb-4 uppercase tracking-wider">Academic Mapping</h3>
              <div className="space-y-4">
                {/* Stream */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Stream <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <select
                      value={formData.streamId}
                      onChange={(e) => handleChange('streamId', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${
                        errors.streamId ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                      } text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all bg-white`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select stream</option>
                      {streams.map(stream => (
                        <option key={stream.id} value={stream.id}>
                          {stream.name} ({stream.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.streamId && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.streamId}</p>
                  )}
                </div>

                {/* Batch */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Batch <span className="text-[#dc2626]">*</span>
                  </label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => handleChange('batchId', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      errors.batchId ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    } text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all bg-white`}
                    disabled={isSubmitting || !formData.streamId}
                  >
                    <option value="">
                      {formData.streamId ? 'Select batch' : 'Select stream first'}
                    </option>
                    {filteredBatches.map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name} ({batch.academicSession})
                      </option>
                    ))}
                  </select>
                  {errors.batchId && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.batchId}</p>
                  )}
                  {formData.streamId && filteredBatches.length === 0 && (
                    <p className="text-[11px] text-[#f59e0b] mt-1">No batches available for this stream</p>
                  )}
                </div>

                {/* Enrollment Date */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Enrollment Date <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                      type="date"
                      value={formData.enrollmentDate}
                      onChange={(e) => handleChange('enrollmentDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb]" />

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 border border-[#d1d5db] text-[13px] text-[#374151] hover:bg-[#f9fafb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding Student...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
