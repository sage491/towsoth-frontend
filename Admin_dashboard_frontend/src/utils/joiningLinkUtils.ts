/**
 * Student Joining Link Utilities
 * Handles token generation, validation, and security for student joining links
 */

export type StudentStatus = 'draft' | 'joining-pending' | 'active' | 'expired';

export interface JoiningLinkData {
  token: string;
  studentId: string;
  institutionId: string;
  expiresAt: Date;
  createdAt: Date;
  isUsed: boolean;
  generatedBy: string;
}

export interface StudentJoiningData {
  // Pre-filled (read-only)
  studentId: string;
  name: string;
  rollNumber: string;
  stream: string;
  batch: string;
  academicSession: string;
  institutionName: string;
  
  // Student fills
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  personalEmail?: string;
  phoneNumber?: string;
  guardianName?: string;
  guardianPhone?: string;
  previousQualification?: string;
  password?: string;
  
  // Metadata
  status: StudentStatus;
  joiningLink?: JoiningLinkData;
}

/**
 * Generate a secure random token for joining link
 */
export function generateSecureToken(): string {
  // In production, use crypto.randomBytes or similar
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Generate joining link data
 */
export function generateJoiningLink(
  studentId: string,
  institutionId: string,
  generatedBy: string,
  expiryDays: number = 7
): JoiningLinkData {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + expiryDays);
  
  return {
    token: generateSecureToken(),
    studentId,
    institutionId,
    expiresAt,
    createdAt: now,
    isUsed: false,
    generatedBy,
  };
}

/**
 * Build complete joining URL
 */
export function buildJoiningUrl(token: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/join/${token}`;
}

/**
 * Validate joining link
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateJoiningLink(linkData: JoiningLinkData): ValidationResult {
  // Check if already used
  if (linkData.isUsed) {
    return {
      isValid: false,
      error: 'This joining link has already been used. Please contact your institution.',
    };
  }
  
  // Check if expired
  const now = new Date();
  if (now > linkData.expiresAt) {
    return {
      isValid: false,
      error: 'This joining link has expired. Please contact your institution for a new link.',
    };
  }
  
  return { isValid: true };
}

/**
 * Calculate time remaining for link expiry
 */
export function getTimeRemaining(expiresAt: Date): {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
} {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, isExpired: false };
}

/**
 * Format expiry time for display
 */
export function formatExpiryTime(expiresAt: Date): string {
  const { days, hours, minutes, isExpired } = getTimeRemaining(expiresAt);
  
  if (isExpired) {
    return 'Expired';
  }
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  }
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  }
  
  return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long',
    };
  }
  
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }
  
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }
  
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }
  
  return { isValid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }
  
  return { isValid: true };
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const phoneRegex = /^[0-9]{10}$/;
  
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit phone number',
    };
  }
  
  return { isValid: true };
}

/**
 * Get status badge color
 */
export function getStatusColor(status: StudentStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'draft':
      return {
        bg: '#f3f4f6',
        text: '#6b7280',
        border: '#d1d5db',
      };
    case 'joining-pending':
      return {
        bg: '#fef3c7',
        text: '#92400e',
        border: '#fbbf24',
      };
    case 'active':
      return {
        bg: '#d1fae5',
        text: '#065f46',
        border: '#10b981',
      };
    case 'expired':
      return {
        bg: '#fee2e2',
        text: '#991b1b',
        border: '#ef4444',
      };
    default:
      return {
        bg: '#f3f4f6',
        text: '#6b7280',
        border: '#d1d5db',
      };
  }
}

/**
 * Get status display label
 */
export function getStatusLabel(status: StudentStatus): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'joining-pending':
      return 'Joining Pending';
    case 'active':
      return 'Active';
    case 'expired':
      return 'Link Expired';
    default:
      return 'Unknown';
  }
}
