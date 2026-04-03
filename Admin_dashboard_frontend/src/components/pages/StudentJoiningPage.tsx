import { useState, useEffect } from 'react';
import { Check, AlertCircle, Lock, Mail, Phone, User, Calendar, MapPin, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';
import { 
  validateJoiningLink, 
  validatePassword, 
  validateEmail, 
  validatePhone,
  ValidationResult 
} from '../../utils/joiningLinkUtils';

interface StudentJoiningPageProps {
  token: string;
}

export function StudentJoiningPage({ token }: StudentJoiningPageProps) {
  const { getActiveBranding } = useInstitutionBranding();
  const branding = getActiveBranding();
  
  // Loading and validation states
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Mock link data (in production, fetch from backend using token)
  const [linkData] = useState({
    token,
    studentId: 'STU2024001',
    institutionId: branding.institutionId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(),
    isUsed: false,
    generatedBy: 'ADMIN001',
  });
  
  // Pre-filled student data (read-only)
  const [studentData] = useState({
    name: 'John Doe',
    rollNumber: '2024CS001',
    stream: 'Computer Science',
    batch: 'CS-A 2024',
    academicSession: '2024-2025',
    institutionName: branding.displayName,
  });
  
  // Form data (student fills)
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    personalEmail: '',
    phoneNumber: '',
    guardianName: '',
    guardianPhone: '',
    previousQualification: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Validate joining link on load
  useEffect(() => {
    const validateLink = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const validation = validateJoiningLink(linkData);
      
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid joining link');
        setIsValid(false);
      } else {
        setIsValid(true);
      }
      
      setIsLoading(false);
    };
    
    validateLink();
  }, [token]);
  
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
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // Required fields
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (!formData.personalEmail) newErrors.personalEmail = 'Email is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    
    // Email validation
    if (formData.personalEmail) {
      const emailValidation = validateEmail(formData.personalEmail);
      if (!emailValidation.isValid) {
        newErrors.personalEmail = emailValidation.error || 'Invalid email';
      }
    }
    
    // Phone validation
    if (formData.phoneNumber) {
      const phoneValidation = validatePhone(formData.phoneNumber);
      if (!phoneValidation.isValid) {
        newErrors.phoneNumber = phoneValidation.error || 'Invalid phone number';
      }
    }
    
    // Guardian phone validation
    if (formData.guardianPhone) {
      const phoneValidation = validatePhone(formData.guardianPhone);
      if (!phoneValidation.isValid) {
        newErrors.guardianPhone = phoneValidation.error || 'Invalid phone number';
      }
    }
    
    // Password validation
    if (formData.password) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.error || 'Invalid password';
      }
    }
    
    // Password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In production: API call to complete student enrollment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      setIsSubmitted(true);
    } catch (err) {
      alert('Failed to complete enrollment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-12 h-12 border-4 border-[#e5e7eb] border-t-[var(--brand-primary)] rounded-full animate-spin mx-auto mb-4"
          />
          <p className="text-[13px] text-[#6b7280]">Verifying joining link...</p>
        </div>
      </div>
    );
  }
  
  // Invalid link
  if (!isValid) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
        <div className="bg-white border border-[#e5e7eb] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#fee2e2] rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[#dc2626]" />
          </div>
          <h1 className="text-[20px] text-[#111827] mb-2">Invalid Joining Link</h1>
          <p className="text-[13px] text-[#6b7280] mb-6">
            {validationError}
          </p>
          <p className="text-[12px] text-[#9ca3af]">
            Please contact your institution's admission office for assistance.
          </p>
        </div>
      </div>
    );
  }
  
  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
        <div className="bg-white border border-[#e5e7eb] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#d1fae5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#16a34a]" />
          </div>
          <h1 className="text-[20px] text-[#111827] mb-2">Enrollment Complete!</h1>
          <p className="text-[13px] text-[#6b7280] mb-6">
            Welcome to {studentData.institutionName}, {studentData.name}!
          </p>
          <div className="bg-[#f9fafb] border border-[#e5e7eb] p-4 mb-6 text-left">
            <p className="text-[12px] text-[#6b7280] mb-2">Your Login Credentials:</p>
            <p className="text-[13px] text-[#111827]">
              <strong>Student ID:</strong> {studentData.rollNumber}
            </p>
            <p className="text-[13px] text-[#111827]">
              <strong>Password:</strong> (as set by you)
            </p>
          </div>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[13px] font-normal hover:font-semibold transition-all"
          >
            Go to Student Login
          </a>
        </div>
      </div>
    );
  }
  
  // Joining form
  return (
    <div className="min-h-screen bg-[#f9fafb] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white border border-[#e5e7eb] p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {branding.logoUrl && (
              <img 
                src={branding.logoUrl} 
                alt={branding.displayName}
                className="h-12 w-auto object-contain"
              />
            )}
            <div>
              <h1 className="text-[20px] text-[#111827]">{studentData.institutionName}</h1>
              <p className="text-[13px] text-[#6b7280]">Student Enrollment Portal</p>
            </div>
          </div>
          
          <div className="bg-[#dbeafe] border-l-4 border-[#3b82f6] p-4 flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-[#1e40af] flex-shrink-0" />
            <div>
              <p className="text-[13px] text-[#1e40af]">
                <strong>Welcome, {studentData.name}!</strong>
              </p>
              <p className="text-[12px] text-[#1e40af] mt-1">
                Complete the form below to finish your enrollment. All fields marked with * are required.
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pre-filled Information (Read-only) */}
          <div className="bg-white border border-[#e5e7eb] p-6">
            <h2 className="text-[15px] text-[#111827] mb-4">Your Admission Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Name</label>
                <p className="text-[13px] text-[#111827] bg-[#f9fafb] border border-[#e5e7eb] px-4 py-2.5">
                  {studentData.name}
                </p>
              </div>
              
              <div>
                <label className="block text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Roll Number</label>
                <p className="text-[13px] text-[#111827] bg-[#f9fafb] border border-[#e5e7eb] px-4 py-2.5">
                  {studentData.rollNumber}
                </p>
              </div>
              
              <div>
                <label className="block text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Stream</label>
                <p className="text-[13px] text-[#111827] bg-[#f9fafb] border border-[#e5e7eb] px-4 py-2.5">
                  {studentData.stream}
                </p>
              </div>
              
              <div>
                <label className="block text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Batch</label>
                <p className="text-[13px] text-[#111827] bg-[#f9fafb] border border-[#e5e7eb] px-4 py-2.5">
                  {studentData.batch}
                </p>
              </div>
              
              <div className="col-span-2">
                <label className="block text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Academic Session</label>
                <p className="text-[13px] text-[#111827] bg-[#f9fafb] border border-[#e5e7eb] px-4 py-2.5">
                  {studentData.academicSession}
                </p>
              </div>
            </div>
          </div>
          
          {/* Personal Details */}
          <div className="bg-white border border-[#e5e7eb] p-6">
            <h2 className="text-[15px] text-[#111827] mb-4">Personal Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Date of Birth <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.dateOfBirth ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-[11px] text-[#dc2626] mt-1">{errors.dateOfBirth}</p>
                )}
              </div>
              
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Gender <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`w-full px-4 py-2.5 border ${errors.gender ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-[11px] text-[#dc2626] mt-1">{errors.gender}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Details */}
          <div className="bg-white border border-[#e5e7eb] p-6">
            <h2 className="text-[15px] text-[#111827] mb-4">Contact Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Address <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#9ca3af]" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={2}
                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.address ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all resize-none`}
                    placeholder="Street address, apartment, etc."
                  />
                </div>
                {errors.address && (
                  <p className="text-[11px] text-[#dc2626] mt-1">{errors.address}</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    City <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${errors.city ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.city}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    State <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${errors.state ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                  />
                  {errors.state && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.state}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Pincode <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${errors.pincode ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                    maxLength={6}
                  />
                  {errors.pincode && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Personal Email <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                      type="email"
                      value={formData.personalEmail}
                      onChange={(e) => handleChange('personalEmail', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${errors.personalEmail ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.personalEmail && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.personalEmail}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5">
                    Phone Number <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${errors.phoneNumber ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-[11px] text-[#dc2626] mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Guardian Details (Optional) */}
          <div className="bg-white border border-[#e5e7eb] p-6">
            <h2 className="text-[15px] text-[#111827] mb-1">Guardian Details</h2>
            <p className="text-[12px] text-[#6b7280] mb-4">(Optional)</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">Guardian Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => handleChange('guardianName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                    placeholder="Parent or guardian name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">Guardian Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="tel"
                    value={formData.guardianPhone}
                    onChange={(e) => handleChange('guardianPhone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.guardianPhone ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                {errors.guardianPhone && (
                  <p className="text-[11px] text-[#dc2626] mt-1">{errors.guardianPhone}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Academic Background (Optional) */}
          <div className="bg-white border border-[#e5e7eb] p-6">
            <h2 className="text-[15px] text-[#111827] mb-1">Academic Background</h2>
            <p className="text-[12px] text-[#6b7280] mb-4">(Optional)</p>
            
            <div>
              <label className="block text-[13px] text-[#374151] mb-1.5">Previous Qualification</label>
              <input
                type="text"
                value={formData.previousQualification}
                onChange={(e) => handleChange('previousQualification', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                placeholder="e.g., High School, 12th Grade, etc."
              />
            </div>
          </div>
          
          {/* Account Setup */}
          <div className="bg-white border border-[#e5e7eb] p-6">
            <h2 className="text-[15px] text-[#111827] mb-4">Account Setup</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Create Password <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-2.5 border ${errors.password ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-[#dc2626] mt-1">{errors.password}</p>
                )}
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Must contain uppercase, lowercase, and numbers. Minimum 8 characters.
                </p>
              </div>
              
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Confirm Password <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-2.5 border ${errors.confirmPassword ? 'border-[#dc2626]' : 'border-[#d1d5db]'} text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-[#dc2626] mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit */}
          <div className="bg-white border border-[#e5e7eb] p-6">
            <div className="bg-[#fef3c7] border-l-4 border-[#fbbf24] p-4 flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-[#92400e] flex-shrink-0" />
              <div>
                <p className="text-[13px] text-[#92400e]">
                  <strong>Important:</strong> Once you submit this form, your account will be activated and you cannot make changes. 
                  Please review all information carefully before proceeding.
                </p>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[14px] font-normal hover:font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Completing Enrollment...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Complete Enrollment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
