import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Briefcase, BookOpen, GraduationCap } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { Faculty } from '../../data/entities';

interface AddFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (faculty: Faculty) => void;
}

export function AddFacultyModal({ isOpen, onClose, onSuccess }: AddFacultyModalProps) {
  const { streams, batches, subjects, getBatchesByStream, getSubjectsByBatch, faculty } = useData();
  const { success, error } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    specialization: '',
    streamIds: [] as string[],
    batchIds: [] as string[],
    subjectIds: [] as string[],
    joinedDate: new Date().toISOString().split('T')[0],
  });

  // UI state
  const [filteredBatches, setFilteredBatches] = useState(batches);
  const [filteredSubjects, setFilteredSubjects] = useState(subjects);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter batches when streams change
  useEffect(() => {
    if (formData.streamIds.length > 0) {
      const batchesForStreams = formData.streamIds.flatMap(streamId => 
        getBatchesByStream(streamId)
      );
      // Remove duplicates
      const uniqueBatches = Array.from(
        new Map(batchesForStreams.map(b => [b.id, b])).values()
      );
      setFilteredBatches(uniqueBatches);

      // Reset batch selections if they no longer belong to selected streams
      const validBatchIds = formData.batchIds.filter(batchId =>
        uniqueBatches.some(b => b.id === batchId)
      );
      if (validBatchIds.length !== formData.batchIds.length) {
        setFormData(prev => ({ ...prev, batchIds: validBatchIds }));
      }
    } else {
      setFilteredBatches(batches);
    }
  }, [formData.streamIds, getBatchesByStream, batches]);

  // Filter subjects when batches change
  useEffect(() => {
    if (formData.batchIds.length > 0) {
      const subjectsForBatches = formData.batchIds.flatMap(batchId => 
        getSubjectsByBatch(batchId)
      );
      // Remove duplicates
      const uniqueSubjects = Array.from(
        new Map(subjectsForBatches.map(s => [s.id, s])).values()
      );
      setFilteredSubjects(uniqueSubjects);

      // Reset subject selections if they no longer belong to selected batches
      const validSubjectIds = formData.subjectIds.filter(subjectId =>
        uniqueSubjects.some(s => s.id === subjectId)
      );
      if (validSubjectIds.length !== formData.subjectIds.length) {
        setFormData(prev => ({ ...prev, subjectIds: validSubjectIds }));
      }
    } else {
      setFilteredSubjects(subjects);
    }
  }, [formData.batchIds, getSubjectsByBatch, subjects]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Faculty name is required';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    } else {
      // Check for duplicate employee ID
      const duplicate = faculty.find(f => f.employeeId === formData.employeeId.trim());
      if (duplicate) {
        newErrors.employeeId = `Employee ID already exists (${duplicate.name})`;
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else {
      // Check for duplicate email
      const duplicate = faculty.find(f => f.email === formData.email.trim());
      if (duplicate) {
        newErrors.email = `Email already exists (${duplicate.name})`;
      }
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (formData.streamIds.length === 0) {
      newErrors.streamIds = 'Please select at least one stream';
    }

    if (formData.subjectIds.length === 0) {
      newErrors.subjectIds = 'Please select at least one subject';
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field: string, value: string | string[]) => {
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

  // Handle multi-select
  const handleMultiSelect = (field: 'streamIds' | 'batchIds' | 'subjectIds', value: string) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });

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

      // Create new faculty
      const newFaculty: Faculty = {
        id: `FAC${Date.now()}`,
        employeeId: formData.employeeId.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        department: formData.department.trim(),
        designation: formData.designation.trim(),
        specialization: formData.specialization.trim() || '',
        streamIds: formData.streamIds,
        status: 'Active',
        joinedDate: formData.joinedDate,
      };

      // In a real app, this would call an API endpoint
      // For now, we'll just show success and trigger callback
      
      success(`Faculty "${newFaculty.name}" added successfully`);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(newFaculty);
      }

      // Reset form
      handleReset();
      
      // Close modal
      onClose();

    } catch (err) {
      error('Failed to add faculty. Please try again.');
      console.error('Error adding faculty:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      employeeId: '',
      email: '',
      phone: '',
      designation: '',
      department: '',
      specialization: '',
      streamIds: [],
      batchIds: [],
      subjectIds: [],
      joinedDate: new Date().toISOString().split('T')[0],
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
          className="bg-white w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#e5e7eb] px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f3f4f6] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#6b7280]" />
              </div>
              <div>
                <h2 className="text-[15px] text-[#111827]">Add New Faculty</h2>
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
              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="col-span-2">
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
                      placeholder="Enter faculty's full name"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Employee ID <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleChange('employeeId', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      errors.employeeId ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    } text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                    placeholder="e.g., FAC001"
                    disabled={isSubmitting}
                  />
                  {errors.employeeId && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.employeeId}</p>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Designation <span className="text-[#dc2626]">*</span>
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      errors.designation ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    } text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all bg-white`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select designation</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Visiting Faculty">Visiting Faculty</option>
                  </select>
                  {errors.designation && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.designation}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Email <span className="text-[#dc2626]">*</span>
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
                      placeholder="faculty@example.com"
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
                      placeholder="10-digit mobile"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Department <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      errors.department ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    } text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                    placeholder="e.g., Computer Science"
                    disabled={isSubmitting}
                  />
                  {errors.department && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.department}</p>
                  )}
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Specialization <span className="text-[#9ca3af]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => handleChange('specialization', e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                    placeholder="e.g., Machine Learning"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb]" />

            {/* Academic Assignment */}
            <div>
              <h3 className="text-[13px] text-[#111827] mb-4 uppercase tracking-wider">Academic Assignment</h3>
              <div className="space-y-4">
                {/* Streams */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Streams <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className={`border ${errors.streamIds ? 'border-[#dc2626]' : 'border-[#d1d5db]'} p-3 space-y-2 max-h-32 overflow-auto bg-white`}>
                    {streams.map(stream => (
                      <label key={stream.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.streamIds.includes(stream.id)}
                          onChange={() => handleMultiSelect('streamIds', stream.id)}
                          disabled={isSubmitting}
                          className="w-4 h-4 accent-[var(--brand-primary)]"
                        />
                        <span className="text-[13px] text-[#374151] group-hover:text-[#111827]">
                          {stream.name} ({stream.code})
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.streamIds && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.streamIds}</p>
                  )}
                  <p className="text-[11px] text-[#6b7280] mt-1">
                    Selected: {formData.streamIds.length} stream(s)
                  </p>
                </div>

                {/* Batches */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Batches <span className="text-[#9ca3af]">(Optional - filters subjects)</span>
                  </label>
                  <div className="border border-[#d1d5db] p-3 space-y-2 max-h-32 overflow-auto bg-white">
                    {formData.streamIds.length === 0 ? (
                      <p className="text-[12px] text-[#9ca3af] italic">Select streams first</p>
                    ) : filteredBatches.length === 0 ? (
                      <p className="text-[12px] text-[#f59e0b] italic">No batches available</p>
                    ) : (
                      filteredBatches.map(batch => (
                        <label key={batch.id} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.batchIds.includes(batch.id)}
                            onChange={() => handleMultiSelect('batchIds', batch.id)}
                            disabled={isSubmitting}
                            className="w-4 h-4 accent-[var(--brand-primary)]"
                          />
                          <span className="text-[13px] text-[#374151] group-hover:text-[#111827]">
                            {batch.name} ({batch.academicSession})
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="text-[11px] text-[#6b7280] mt-1">
                    Selected: {formData.batchIds.length} batch(es)
                  </p>
                </div>

                {/* Subjects */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Subjects <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className={`border ${errors.subjectIds ? 'border-[#dc2626]' : 'border-[#d1d5db]'} p-3 space-y-2 max-h-48 overflow-auto bg-white`}>
                    {formData.streamIds.length === 0 ? (
                      <p className="text-[12px] text-[#9ca3af] italic">Select streams first</p>
                    ) : filteredSubjects.length === 0 ? (
                      <p className="text-[12px] text-[#f59e0b] italic">No subjects available</p>
                    ) : (
                      filteredSubjects.map(subject => (
                        <label key={subject.id} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.subjectIds.includes(subject.id)}
                            onChange={() => handleMultiSelect('subjectIds', subject.id)}
                            disabled={isSubmitting}
                            className="w-4 h-4 accent-[var(--brand-primary)]"
                          />
                          <span className="text-[13px] text-[#374151] group-hover:text-[#111827]">
                            {subject.name} ({subject.code})
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                  {errors.subjectIds && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.subjectIds}</p>
                  )}
                  <p className="text-[11px] text-[#6b7280] mt-1">
                    Selected: {formData.subjectIds.length} subject(s)
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb]" />

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white pt-4">
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
                {isSubmitting ? 'Adding Faculty...' : 'Add Faculty'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
