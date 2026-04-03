import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Link as LinkIcon, UserPlus, Mail } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';
import { useToast } from '../../contexts/ToastContext';
import { JoiningLinkDisplay } from './JoiningLinkDisplay';
import { generateJoiningLink, StudentJoiningData, buildJoiningUrl, validateEmail } from '../../utils/joiningLinkUtils';

interface AddStudentWithJoiningLinkProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddStudentWithJoiningLink({ isOpen, onClose, onSuccess }: AddStudentWithJoiningLinkProps) {
  const { streams, batches } = useData();
  const { getActiveBranding } = useInstitutionBranding();
  const { success, error } = useToast();
  const branding = getActiveBranding();
  
  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Form data
  const [formData, setFormData] = useState<Partial<StudentJoiningData>>({
    name: '',
    rollNumber: '',
    personalEmail: '', // Add email field
    stream: '',
    batch: '',
    academicSession: '',
    institutionName: branding.displayName,
    status: 'draft',
  });
  
  // Generated student ID and joining link
  const [generatedStudentId, setGeneratedStudentId] = useState<string>('');
  const [joiningLinkData, setJoiningLinkData] = useState<any>(null);
  
  // Don't render if not open (AFTER all hooks)
  if (!isOpen) return null;
  
  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.rollNumber) {
          error('Please enter student name and roll number');
          return false;
        }
        // Validate email if provided
        if (formData.personalEmail && formData.personalEmail.trim()) {
          const emailValidation = validateEmail(formData.personalEmail);
          if (!emailValidation.isValid) {
            error(emailValidation.error || 'Invalid email address');
            return false;
          }
        }
        return true;
      
      case 2:
        if (!formData.stream || !formData.batch) {
          error('Please select stream and batch');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };
  
  // Navigate to next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Navigate to previous step
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Generate joining link
  const handleGenerateLink = () => {
    // Generate student ID (in production, this comes from backend)
    const studentId = `STU${Date.now()}`;
    setGeneratedStudentId(studentId);
    
    // Generate joining link
    const linkData = generateJoiningLink(
      studentId,
      branding.institutionId,
      'ADMIN001', // Current admin ID
      7 // 7 days expiry
    );
    
    setJoiningLinkData(linkData);
    
    // Update student status
    handleChange('status', 'joining-pending');
    
    success('Student added and joining link generated successfully');
  };
  
  // Regenerate joining link
  const handleRegenerateLink = () => {
    const newLinkData = generateJoiningLink(
      generatedStudentId,
      branding.institutionId,
      'ADMIN001',
      7
    );
    
    setJoiningLinkData(newLinkData);
  };
  
  // Send email
  const handleSendEmail = () => {
    // In production: API call to send email
    if (formData.personalEmail && formData.personalEmail.trim()) {
      console.log('Sending email to:', formData.personalEmail);
      console.log('Joining link:', buildJoiningUrl(joiningLinkData.token));
      success(`Joining link sent to ${formData.personalEmail}`);
    } else {
      error('No email address provided for this student');
    }
  };
  
  // Complete and close
  const handleComplete = () => {
    if (onSuccess) onSuccess();
    onClose();
  };
  
  // Get selected stream/batch names
  const selectedStream = streams.find(s => s.id === formData.stream);
  const selectedBatch = batches.find(b => b.id === formData.batch);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e5e7eb] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-[15px] sm:text-[17px] text-[#111827]">Add New Student</h2>
            <p className="text-[11px] sm:text-[12px] text-[#6b7280] mt-0.5">
              Step {currentStep} of {totalSteps}: {
                currentStep === 1 ? 'Basic Information' :
                currentStep === 2 ? 'Academic Details' :
                'Generate Joining Link'
              }
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
        <div className="px-4 sm:px-6 pt-3 sm:pt-4">
          <div className="flex items-center gap-1 sm:gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex-1 h-1.5 transition-colors ${
                  step <= currentStep
                    ? 'bg-[var(--brand-primary)]'
                    : 'bg-[#e5e7eb]'
                }`} />
                {step < 3 && (
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-[11px] transition-colors ${
                    step < currentStep
                      ? 'bg-[var(--brand-primary)] text-white'
                      : step === currentStep
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-[#e5e7eb] text-[#9ca3af]'
                  }`}>
                    {step < currentStep ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : step}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Student Name <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                  placeholder="e.g., John Doe"
                />
              </div>
              
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Roll Number / Student ID <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.rollNumber || ''}
                  onChange={(e) => handleChange('rollNumber', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                  placeholder="e.g., 2024CS001"
                />
                <p className="text-[11px] text-[#6b7280] mt-1">
                  This will be used for student login and identification
                </p>
              </div>
              
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Student Email
                </label>
                <input
                  type="email"
                  value={formData.personalEmail || ''}
                  onChange={(e) => handleChange('personalEmail', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                  placeholder="e.g., student@example.com"
                />
                <p className="text-[11px] text-[#6b7280] mt-1">
                  If provided, you can send the joining link directly to this email
                </p>
              </div>
            </div>
          )}
          
          {/* Step 2: Academic Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Stream <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={formData.stream || ''}
                  onChange={(e) => handleChange('stream', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream.id} value={stream.id}>
                      {stream.name} ({stream.shortCode})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Batch <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={formData.batch || ''}
                  onChange={(e) => handleChange('batch', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                >
                  <option value="">Select Batch</option>
                  {batches
                    .filter(batch => !formData.stream || batch.streamId === formData.stream)
                    .map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Academic year: {selectedBatch?.academicYear || 'Not selected'}
                </p>
              </div>
            </div>
          )}
          
          {/* Step 3: Generate Joining Link */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {!joiningLinkData ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] p-5 space-y-3">
                    <h3 className="text-[14px] text-[#111827]">Student Information Summary</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Name</p>
                        <p className="text-[13px] text-[#111827]">{formData.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Roll Number</p>
                        <p className="text-[13px] text-[#111827]">{formData.rollNumber}</p>
                      </div>
                      
                      <div>
                        <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Stream</p>
                        <p className="text-[13px] text-[#111827]">{selectedStream?.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Batch</p>
                        <p className="text-[13px] text-[#111827]">{selectedBatch?.name}</p>
                      </div>
                      
                      {formData.personalEmail && formData.personalEmail.trim() && (
                        <div className="col-span-2">
                          <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#6b7280]" />
                            <p className="text-[13px] text-[#111827]">{formData.personalEmail}</p>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Status</p>
                        <span className="inline-flex items-center px-2.5 py-1 bg-[#f3f4f6] border border-[#d1d5db] text-[#6b7280] text-[11px]">
                          Draft
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="bg-[#dbeafe] border-l-4 border-[#3b82f6] p-4 flex items-start gap-3">
                    <LinkIcon className="w-5 h-5 text-[#1e40af] flex-shrink-0" />
                    <div>
                      <p className="text-[13px] text-[#1e40af]">
                        <strong>Next Step:</strong> Generate a secure joining link for the student
                      </p>
                      <ul className="text-[12px] text-[#1e40af] mt-2 ml-4 list-disc space-y-1">
                        <li>Student will receive a unique, one-time use link</li>
                        <li>Link will be valid for 7 days</li>
                        <li>Student can complete their enrollment using this link</li>
                        <li>You can send the link via email or copy it manually</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateLink}
                    className="w-full px-6 py-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[14px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <LinkIcon className="w-5 h-5" />
                    Generate Student Joining Link
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="bg-[#d1fae5] border-l-4 border-[#10b981] p-4 flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#065f46] flex-shrink-0" />
                    <div>
                      <p className="text-[13px] text-[#065f46]">
                        <strong>Student Added Successfully!</strong>
                      </p>
                      <p className="text-[12px] text-[#065f46] mt-1">
                        {formData.name} has been added with status "Joining Pending". 
                        Share the joining link below to complete enrollment.
                      </p>
                    </div>
                  </div>
                  
                  {/* Joining Link Display */}
                  <JoiningLinkDisplay
                    linkData={joiningLinkData}
                    studentName={formData.name || ''}
                    studentEmail={formData.personalEmail}
                    onRegenerate={handleRegenerateLink}
                    onSendEmail={handleSendEmail}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-[#e5e7eb] px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="order-2 sm:order-1">
            {currentStep > 1 && !joiningLinkData && (
              <button
                onClick={handleBack}
                className="w-full sm:w-auto px-4 py-2 text-[13px] text-[#6b7280] hover:text-[#111827] font-normal hover:font-semibold transition-all flex items-center justify-center sm:justify-start gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
          
          <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-[#d1d5db] hover:border-[#9ca3af] text-[#374151] hover:text-[#111827] text-[13px] font-normal hover:font-semibold transition-all"
            >
              {joiningLinkData ? 'Close' : 'Cancel'}
            </button>
            
            {!joiningLinkData && currentStep < 3 && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            {joiningLinkData && (
              <button
                onClick={handleComplete}
                className="px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}