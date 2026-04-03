import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { logger } from '../utils/logger';
import { safeJsonParse, safeJsonStringify } from '../utils/storageUtils';

// Branding Configuration
export interface BrandingConfig {
  institutionId: string;
  institutionName: string;
  displayName: string;
  primaryColor: string;
  secondaryColor?: string;
  logoUrl?: string;
  favicon?: string;
  tagline?: string;
}

// Audit Log Entry
export interface BrandingAuditLog {
  id: string;
  institutionId: string;
  adminId: string;
  adminName: string;
  action: 'branding-updated' | 'branding-reset' | 'logo-uploaded' | 'logo-removed';
  field?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Validation Result
export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

interface InstitutionBrandingState {
  branding: BrandingConfig;
  previewBranding: BrandingConfig | null;
  isPreviewMode: boolean;
  auditLog: BrandingAuditLog[];
  brandingHistory: BrandingConfig[];
}

interface InstitutionBrandingContextType {
  state: InstitutionBrandingState;
  
  // Branding Management
  updateBranding: (updates: Partial<BrandingConfig>) => Promise<void>;
  resetBranding: () => Promise<void>;
  rollbackToPrevious: () => Promise<void>;
  
  // Preview Mode
  applyPreview: (updates: Partial<BrandingConfig>) => void;
  exitPreview: () => void;
  savePreview: () => Promise<void>;
  
  // Validation
  validateColor: (color: string) => ValidationResult;
  validateBranding: (config: Partial<BrandingConfig>) => ValidationResult;
  
  // Color Utilities
  getContrastRatio: (color: string, background?: string) => number;
  getDarkerShade: (color: string, amount?: number) => string;
  getLighterShade: (color: string, amount?: number) => string;
  
  // Logo Management
  uploadLogo: (file: File) => Promise<string>;
  removeLogo: () => Promise<void>;
  
  // Audit
  getAuditLog: () => BrandingAuditLog[];
  clearAuditLog: () => void;
  
  // Active Branding (respects preview mode)
  getActiveBranding: () => BrandingConfig;
}

const InstitutionBrandingContext = createContext<InstitutionBrandingContextType | undefined>(undefined);

// Default Platform Branding (Fallback)
const DEFAULT_BRANDING: BrandingConfig = {
  institutionId: 'default',
  institutionName: 'Towsoth University',
  displayName: 'Towsoth University',
  primaryColor: '#1e40af', // Professional blue
  secondaryColor: '#8b5cf6', // Subtle purple
  tagline: 'Excellence in Education',
};

const STORAGE_KEY = 'institutionBranding';
const AUDIT_LOG_KEY = 'brandingAuditLog';
const HISTORY_KEY = 'brandingHistory';

export function InstitutionBrandingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InstitutionBrandingState>(() => {
    const savedBranding = localStorage.getItem(STORAGE_KEY);
    const savedAuditLog = localStorage.getItem(AUDIT_LOG_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);

    return {
      branding: safeJsonParse<BrandingConfig>(savedBranding, DEFAULT_BRANDING),
      previewBranding: null,
      isPreviewMode: false,
      auditLog: safeJsonParse<BrandingAuditLog[]>(savedAuditLog, []),
      brandingHistory: safeJsonParse<BrandingConfig[]>(savedHistory, [DEFAULT_BRANDING]),
    };
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, safeJsonStringify(state.branding, '{}'));
    localStorage.setItem(AUDIT_LOG_KEY, safeJsonStringify(state.auditLog, '[]'));
    localStorage.setItem(HISTORY_KEY, safeJsonStringify(state.brandingHistory, '[]'));
  }, [state.branding, state.auditLog, state.brandingHistory]);

  // Apply branding to CSS variables
  useEffect(() => {
    const activeBranding = state.isPreviewMode && state.previewBranding 
      ? state.previewBranding 
      : state.branding;

    const root = document.documentElement;
    root.style.setProperty('--brand-primary', activeBranding.primaryColor);
    root.style.setProperty('--brand-secondary', activeBranding.secondaryColor || activeBranding.primaryColor);
    root.style.setProperty('--brand-primary-hover', getDarkerShade(activeBranding.primaryColor, 10));
    root.style.setProperty('--brand-primary-light', getLighterShade(activeBranding.primaryColor, 80));

    // Update page title
    document.title = `${activeBranding.displayName} - Admin Portal`;
  }, [state.branding, state.previewBranding, state.isPreviewMode]);

  const addAuditLog = (
    action: BrandingAuditLog['action'],
    field: string | undefined,
    oldValue: string | undefined,
    newValue: string | undefined,
    metadata?: Record<string, any>
  ) => {
    const logEntry: BrandingAuditLog = {
      id: crypto.randomUUID(),
      institutionId: state.branding.institutionId,
      adminId: 'current-admin', // TODO: Replace with actual admin ID
      adminName: 'Current Admin', // TODO: Replace with actual admin name
      action,
      field,
      oldValue,
      newValue,
      timestamp: new Date().toISOString(),
      metadata,
    };

    setState((prev) => ({
      ...prev,
      auditLog: [logEntry, ...prev.auditLog].slice(0, 100), // Keep last 100
    }));

    logger.info('[Branding Audit]', logEntry);
  };

  // Color Utilities
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((x) => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getContrastRatio = (color: string, background: string = '#ffffff'): number => {
    const l1 = getLuminance(color);
    const l2 = getLuminance(background);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const getDarkerShade = (hex: string, amount: number = 20): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = (100 - amount) / 100;
    return rgbToHex(
      Math.max(0, rgb.r * factor),
      Math.max(0, rgb.g * factor),
      Math.max(0, rgb.b * factor)
    );
  };

  const getLighterShade = (hex: string, amount: number = 20): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = amount / 100;
    return rgbToHex(
      Math.min(255, rgb.r + (255 - rgb.r) * factor),
      Math.min(255, rgb.g + (255 - rgb.g) * factor),
      Math.min(255, rgb.b + (255 - rgb.b) * factor)
    );
  };

  // Validation
  const validateColor = (color: string): ValidationResult => {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Check format
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      errors.push('Invalid color format. Must be a valid HEX color (e.g., #1E40AF)');
      return { valid: false, warnings, errors };
    }

    // Check contrast with white background
    const contrastWithWhite = getContrastRatio(color, '#ffffff');
    if (contrastWithWhite < 3) {
      warnings.push('Low contrast with white background. May affect readability.');
    }

    // Check contrast with black text
    const contrastWithBlack = getContrastRatio('#000000', color);
    if (contrastWithBlack < 4.5) {
      warnings.push('Low contrast for black text on this color. Avoid using as background for text.');
    }

    // Check if too light
    const luminance = getLuminance(color);
    if (luminance > 0.8) {
      warnings.push('Color is very light. May not be visible against white backgrounds.');
    }

    return {
      valid: true,
      warnings,
      errors,
    };
  };

  const validateBranding = (config: Partial<BrandingConfig>): ValidationResult => {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Validate display name
    if (config.displayName !== undefined) {
      if (config.displayName.trim().length === 0) {
        errors.push('Institution name cannot be empty');
      }
      if (config.displayName.length > 100) {
        errors.push('Institution name is too long (max 100 characters)');
      }
    }

    // Validate primary color
    if (config.primaryColor) {
      const colorValidation = validateColor(config.primaryColor);
      warnings.push(...colorValidation.warnings);
      errors.push(...colorValidation.errors);
    }

    // Validate secondary color
    if (config.secondaryColor) {
      const colorValidation = validateColor(config.secondaryColor);
      warnings.push(...colorValidation.warnings.map(w => `Secondary color: ${w}`));
      errors.push(...colorValidation.errors.map(e => `Secondary color: ${e}`));
    }

    return {
      valid: errors.length === 0,
      warnings,
      errors,
    };
  };

  // Branding Management
  const updateBranding = async (updates: Partial<BrandingConfig>): Promise<void> => {
    // Validate
    const validation = validateBranding(updates);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const oldBranding = state.branding;
    const newBranding = { ...oldBranding, ...updates };

    setState((prev) => ({
      ...prev,
      branding: newBranding,
      brandingHistory: [newBranding, ...prev.brandingHistory].slice(0, 10), // Keep last 10
      isPreviewMode: false,
      previewBranding: null,
    }));

    // Log each changed field
    Object.keys(updates).forEach((key) => {
      const field = key as keyof BrandingConfig;
      if (oldBranding[field] !== updates[field]) {
        addAuditLog(
          'branding-updated',
          field,
          String(oldBranding[field]),
          String(updates[field]),
          { validation }
        );
      }
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  const resetBranding = async (): Promise<void> => {
    const oldBranding = state.branding;

    setState((prev) => ({
      ...prev,
      branding: DEFAULT_BRANDING,
      brandingHistory: [DEFAULT_BRANDING, ...prev.brandingHistory].slice(0, 10),
      isPreviewMode: false,
      previewBranding: null,
    }));

    addAuditLog('branding-reset', undefined, JSON.stringify(oldBranding), JSON.stringify(DEFAULT_BRANDING));

    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  const rollbackToPrevious = async (): Promise<void> => {
    if (state.brandingHistory.length < 2) {
      throw new Error('No previous version available');
    }

    const previousBranding = state.brandingHistory[1];
    const currentBranding = state.branding;

    setState((prev) => ({
      ...prev,
      branding: previousBranding,
      isPreviewMode: false,
      previewBranding: null,
    }));

    addAuditLog(
      'branding-updated',
      'rollback',
      JSON.stringify(currentBranding),
      JSON.stringify(previousBranding),
      { action: 'rollback' }
    );

    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  // Preview Mode
  const applyPreview = (updates: Partial<BrandingConfig>) => {
    const previewBranding = { ...state.branding, ...updates };
    setState((prev) => ({
      ...prev,
      previewBranding,
      isPreviewMode: true,
    }));
  };

  const exitPreview = () => {
    setState((prev) => ({
      ...prev,
      previewBranding: null,
      isPreviewMode: false,
    }));
  };

  const savePreview = async (): Promise<void> => {
    if (!state.previewBranding) {
      throw new Error('No preview to save');
    }

    await updateBranding(state.previewBranding);
  };

  // Logo Management
  const uploadLogo = async (file: File): Promise<string> => {
    // Validate file
    if (!file.type.match(/^image\/(png|svg\+xml|jpeg)$/)) {
      throw new Error('Invalid file type. Only PNG, SVG, and JPEG are supported.');
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 2MB.');
    }

    // Simulate upload - in production, upload to cloud storage
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const logoUrl = e.target?.result as string;
        
        await updateBranding({ logoUrl });
        addAuditLog('logo-uploaded', 'logoUrl', state.branding.logoUrl, logoUrl, {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        });

        resolve(logoUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeLogo = async (): Promise<void> => {
    const oldLogoUrl = state.branding.logoUrl;
    await updateBranding({ logoUrl: undefined });
    addAuditLog('logo-removed', 'logoUrl', oldLogoUrl, undefined);
  };

  // Audit
  const getAuditLog = () => state.auditLog;

  const clearAuditLog = () => {
    setState((prev) => ({
      ...prev,
      auditLog: [],
    }));
  };

  const getActiveBranding = (): BrandingConfig => {
    return state.isPreviewMode && state.previewBranding 
      ? state.previewBranding 
      : state.branding;
  };

  return (
    <InstitutionBrandingContext.Provider
      value={{
        state,
        updateBranding,
        resetBranding,
        rollbackToPrevious,
        applyPreview,
        exitPreview,
        savePreview,
        validateColor,
        validateBranding,
        getContrastRatio,
        getDarkerShade,
        getLighterShade,
        uploadLogo,
        removeLogo,
        getAuditLog,
        clearAuditLog,
        getActiveBranding,
      }}
    >
      {children}
    </InstitutionBrandingContext.Provider>
  );
}

export function useInstitutionBranding() {
  const context = useContext(InstitutionBrandingContext);
  if (!context) {
    throw new Error('useInstitutionBranding must be used within InstitutionBrandingProvider');
  }
  return context;
}
