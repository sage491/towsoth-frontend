import DOMPurify from 'dompurify';
import validator from 'validator';

/**
 * Security utilities for input validation and sanitization
 * Protects against XSS, SQL injection, and other security threats
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - The potentially unsafe HTML string
 * @param {object} config - DOMPurify configuration options
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (dirty, config = {}) => {
  if (typeof dirty !== 'string') return '';
  
  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  };
  
  return DOMPurify.sanitize(dirty, { ...defaultConfig, ...config });
};

/**
 * Sanitize user input by removing potentially dangerous characters
 * Prevents SQL injection and other injection attacks
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // For text inputs, use DOMPurify to handle HTML/script content
  // ALLOW_DATA_ATTR: false prevents data: URLs
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  });
  
  // Remove SQL injection attempts
  let sanitized = cleaned
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comment syntax
    .replace(/\/\*/g, '') // Remove multi-line comment start
    .replace(/\*\//g, '') // Remove multi-line comment end
    .trim();
  
  return sanitized;
};

/**
 * Validate and sanitize email address
 * @param {string} email - Email address to validate
 * @returns {object} - { isValid: boolean, sanitized: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, sanitized: '' };
  }
  
  const sanitized = email.trim().toLowerCase();
  const isValid = validator.isEmail(sanitized);
  
  return { isValid, sanitized };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, strength: string, errors: array }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, strength: 'weak', errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  let strength = 'weak';
  if (errors.length === 0) {
    strength = password.length >= 12 ? 'strong' : 'medium';
  } else if (errors.length <= 2) {
    strength = 'medium';
  }
  
  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};

/**
 * Sanitize text input for safe storage and display
 * @param {string} text - Text input to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized text
 */
export const sanitizeText = (text, maxLength = 1000) => {
  if (typeof text !== 'string') return '';
  
  // Use DOMPurify to remove all HTML tags and dangerous content
  const sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  }).trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

/**
 * Validate URL and ensure it's safe
 * @param {string} url - URL to validate
 * @returns {object} - { isValid: boolean, sanitized: string }
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, sanitized: '' };
  }
  
  const sanitized = url.trim();
  
  // Check if it's a valid URL
  const isValid = validator.isURL(sanitized, {
    protocols: ['http', 'https'],
    require_protocol: true,
  });
  
  // Additional check to prevent javascript:, data:, and vbscript: protocols
  const lowerUrl = sanitized.toLowerCase();
  const isSafe = !lowerUrl.startsWith('javascript:') && 
                 !lowerUrl.startsWith('data:') &&
                 !lowerUrl.startsWith('vbscript:') &&
                 !lowerUrl.includes('javascript:') &&
                 !lowerUrl.includes('data:') &&
                 !lowerUrl.includes('vbscript:');
  
  return {
    isValid: isValid && isSafe,
    sanitized,
  };
};

/**
 * Escape special characters for safe use in API queries
 * @param {string} input - Input string
 * @returns {string} - Escaped string
 */
export const escapeSpecialChars = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate and sanitize form data object
 * @param {object} formData - Form data object
 * @param {object} rules - Validation rules
 * @returns {object} - { isValid: boolean, sanitized: object, errors: object }
 */
export const validateFormData = (formData, rules = {}) => {
  const sanitized = {};
  const errors = {};
  let isValid = true;
  
  for (const [key, value] of Object.entries(formData)) {
    const rule = rules[key] || {};
    
    // Sanitize based on type
    if (rule.type === 'email') {
      const result = validateEmail(value);
      sanitized[key] = result.sanitized;
      if (!result.isValid && rule.required) {
        errors[key] = 'Invalid email address';
        isValid = false;
      }
    } else if (rule.type === 'url') {
      const result = validateURL(value);
      sanitized[key] = result.sanitized;
      if (!result.isValid && rule.required) {
        errors[key] = 'Invalid URL';
        isValid = false;
      }
    } else if (rule.type === 'password') {
      const result = validatePassword(value);
      sanitized[key] = value; // Don't sanitize passwords, just validate
      if (!result.isValid && rule.required) {
        errors[key] = result.errors.join(', ');
        isValid = false;
      }
    } else {
      // Default text sanitization
      sanitized[key] = sanitizeText(value, rule.maxLength || 1000);
      
      // Check required
      if (rule.required && !sanitized[key]) {
        errors[key] = `${key} is required`;
        isValid = false;
      }
    }
  }
  
  return { isValid, sanitized, errors };
};

/**
 * Check if a string contains potential SQL injection patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if suspicious patterns detected
 */
export const containsSQLInjection = (input) => {
  if (typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(--|;|\/\*|\*\/)/g,
    /('|(\\')|('')|(%27)|(\\')|(\"))/g,
    /(\bOR\b.*=.*|1=1|1=0)/gi,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Rate limiting helper for client-side throttling
 */
export class RateLimiter {
  constructor(maxAttempts = 5, timeWindow = 60000) {
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow; // in milliseconds
  }
  
  /**
   * Check if action is allowed
   * @param {string} key - Identifier for the action (e.g., 'login', 'api-call')
   * @returns {boolean} - True if action is allowed
   */
  isAllowed(key) {
    const now = Date.now();
    const record = this.attempts.get(key) || { count: 0, firstAttempt: now };
    
    // Reset if time window has passed
    if (now - record.firstAttempt > this.timeWindow) {
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return true;
    }
    
    // Check if limit exceeded
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    // Increment counter
    this.attempts.set(key, { ...record, count: record.count + 1 });
    return true;
  }
  
  /**
   * Reset attempts for a key
   * @param {string} key - Identifier to reset
   */
  reset(key) {
    this.attempts.delete(key);
  }
}

export default {
  sanitizeHTML,
  sanitizeInput,
  sanitizeText,
  validateEmail,
  validatePassword,
  validateURL,
  escapeSpecialChars,
  validateFormData,
  containsSQLInjection,
  RateLimiter,
};
