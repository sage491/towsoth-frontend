import { useState, useRef } from 'react';
import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';
import {
  Palette,
  Upload,
  X,
  AlertTriangle,
  RotateCcw,
  Save,
  Building2,
  Image as ImageIcon,
  ChevronDown,
  Info,
} from 'lucide-react';

export function InstitutionBrandingSettings() {
  const {
    state,
    updateBranding,
    resetBranding,
    rollbackToPrevious,
    validateColor,
    validateBranding,
    uploadLogo,
    removeLogo,
    getActiveBranding,
  } = useInstitutionBranding();

  const activeBranding = getActiveBranding();

  const [formData, setFormData] = useState({
    displayName: activeBranding.displayName,
    primaryColor: activeBranding.primaryColor,
    secondaryColor: activeBranding.secondaryColor || '',
    tagline: activeBranding.tagline || '',
  });

  const [validation, setValidation] = useState({ valid: true, warnings: [], errors: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    setHasUnsavedChanges(true);

    // Live validation
    const validationResult = validateBranding(newFormData);
    setValidation(validationResult);
  };

  const handleSave = async () => {
    if (!validation.valid) {
      alert('Please fix validation errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      await updateBranding(formData);
      setHasUnsavedChanges(false);
      alert('Branding updated successfully!');
    } catch (error) {
      alert(`Failed to save: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setFormData({
      displayName: state.branding.displayName,
      primaryColor: state.branding.primaryColor,
      secondaryColor: state.branding.secondaryColor || '',
      tagline: state.branding.tagline || '',
    });
    setHasUnsavedChanges(false);
  };

  const handleReset = async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
      return;
    }

    try {
      await resetBranding();
      setFormData({
        displayName: state.branding.displayName,
        primaryColor: state.branding.primaryColor,
        secondaryColor: state.branding.secondaryColor || '',
        tagline: state.branding.tagline || '',
      });
      setShowResetConfirm(false);
      setHasUnsavedChanges(false);
      alert('Branding reset to default');
    } catch (error) {
      alert(`Failed to reset: ${error}`);
    }
  };

  const handleRollback = async () => {
    try {
      await rollbackToPrevious();
      setFormData({
        displayName: state.branding.displayName,
        primaryColor: state.branding.primaryColor,
        secondaryColor: state.branding.secondaryColor || '',
        tagline: state.branding.tagline || '',
      });
      setHasUnsavedChanges(false);
      alert('Rolled back to previous version');
    } catch (error) {
      alert(`Failed to rollback: ${error}`);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadLogo(file);
      alert('Logo uploaded successfully!');
    } catch (error) {
      alert(`Failed to upload logo: ${error}`);
    }
  };

  const handleLogoRemove = async () => {
    try {
      await removeLogo();
      alert('Logo removed');
    } catch (error) {
      alert(`Failed to remove logo: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-[#6b7280]" />
          <h1 className="text-[20px] text-[#111827]">Institution Branding</h1>
        </div>
        <p className="text-[13px] text-[#6b7280]">
          Customize your institution's identity across the platform
        </p>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="mb-6 px-4 py-3 bg-[#fef3c7] border-l-2 border-[#f59e0b] flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
          <p className="text-[13px] text-[#92400e]">You have unsaved changes</p>
        </div>
      )}

      {/* Form Section */}
      <div className="space-y-8">
        {/* Institution Identity */}
        <div>
          <h2 className="text-[15px] text-[#111827] mb-4">Institution Identity</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[13px] text-[#374151] mb-2">
                Institution Name <span className="text-[#dc2626]">*</span>
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
                placeholder="e.g., St. Xavier's College"
                maxLength={100}
              />
              <p className="text-[11px] text-[#9ca3af] mt-1.5">
                This name appears in the header, reports, and dashboards. {formData.displayName.length}/100
              </p>
            </div>

            <div>
              <label className="block text-[13px] text-[#374151] mb-2">Tagline (Optional)</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
                placeholder="e.g., Excellence in Education"
                maxLength={200}
              />
              <p className="text-[11px] text-[#9ca3af] mt-1.5">
                Appears below institution name in the header
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e5e7eb]" />

        {/* Brand Colors */}
        <div>
          <h2 className="text-[15px] text-[#111827] mb-4">Brand Colors</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[13px] text-[#374151] mb-2">
                Primary Color <span className="text-[#dc2626]">*</span>
              </label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-[#e5e7eb] cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: formData.primaryColor }}
                  onClick={() => document.getElementById('colorInput')?.click()}
                />
                <input
                  id="colorInput"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="hidden"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-[#d1d5db] text-[13px] font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
                  placeholder="#1E40AF"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
              <p className="text-[11px] text-[#9ca3af] mt-1.5">
                Used for subtle accents, active indicators, and highlights
              </p>
              {formData.primaryColor && (() => {
                const colorValidation = validateColor(formData.primaryColor);
                return colorValidation.warnings.map((warning, i) => (
                  <div key={i} className="flex items-start gap-2 mt-2 px-3 py-2 bg-[#fef3c7] border-l-2 border-[#f59e0b]">
                    <AlertTriangle className="w-3 h-3 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#92400e]">{warning}</p>
                  </div>
                ));
              })()}
            </div>

            {/* Advanced Section - Collapsible */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-[13px] text-[#6b7280] hover:text-[#374151] transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                Advanced (Optional)
              </button>

              {showAdvanced && (
                <div className="mt-4 pl-6 border-l border-[#e5e7eb]">
                  <label className="block text-[13px] text-[#374151] mb-2">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-[#e5e7eb] cursor-pointer transition-transform hover:scale-105"
                      style={{ backgroundColor: formData.secondaryColor || formData.primaryColor }}
                      onClick={() => document.getElementById('secondaryColorInput')?.click()}
                    />
                    <input
                      id="secondaryColorInput"
                      type="color"
                      value={formData.secondaryColor || formData.primaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="hidden"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-[#d1d5db] text-[13px] font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
                      placeholder="#8B5CF6 (optional)"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>
                  <p className="text-[11px] text-[#9ca3af] mt-1.5">
                    Used for badges, charts, and secondary elements
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#e5e7eb]" />

        {/* Logo Upload */}
        <div>
          <h2 className="text-[15px] text-[#111827] mb-4">Institution Logo</h2>
          
          <div className="flex items-center gap-6">
            {activeBranding.logoUrl ? (
              <div className="flex items-center gap-4">
                <img
                  src={activeBranding.logoUrl}
                  alt="Institution Logo"
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <p className="text-[13px] text-[#374151] mb-1">Current Logo</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[12px] text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                    >
                      Replace
                    </button>
                    <span className="text-[#d1d5db]">•</span>
                    <button
                      onClick={handleLogoRemove}
                      className="text-[12px] text-[#dc2626] hover:text-[#b91c1c] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#f3f4f6] rounded flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-[#d1d5db]" />
                </div>
                <div>
                  <p className="text-[13px] text-[#6b7280] mb-1">No logo uploaded</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[12px] text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                  >
                    Upload Logo
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/svg+xml,image/jpeg"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
          <p className="text-[11px] text-[#9ca3af] mt-3">
            PNG, SVG, or JPEG • Max 2MB • Falls back to initials if not provided
          </p>
        </div>

        <div className="border-t border-[#e5e7eb]" />

        {/* Mini Live Preview */}
        <div>
          <h2 className="text-[15px] text-[#111827] mb-4">Preview</h2>
          
          <div className="space-y-4">
            {/* Header Preview */}
            <div>
              <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-2">Header</p>
              <div className="flex items-center gap-3 py-3 border-b-2" style={{ borderBottomColor: formData.primaryColor }}>
                {activeBranding.logoUrl ? (
                  <img src={activeBranding.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                ) : (
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-[12px]"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    {formData.displayName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-[13px] text-[#111827]">{formData.displayName}</p>
                  {formData.tagline && (
                    <p className="text-[11px] text-[#6b7280]">{formData.tagline}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Active Menu Preview */}
            <div>
              <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-2">Active Menu Item</p>
              <div className="flex items-center gap-3 py-2 border-l-2" style={{ borderLeftColor: formData.primaryColor }}>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.primaryColor + '30' }} />
                <p className="text-[13px]" style={{ color: formData.primaryColor }}>Dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Messages */}
        {validation.errors.length > 0 && (
          <div className="px-4 py-3 bg-[#fee2e2] border-l-2 border-[#dc2626]">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#dc2626] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#dc2626]">Validation Errors</p>
            </div>
            <ul className="ml-6 space-y-1">
              {validation.errors.map((error, i) => (
                <li key={i} className="text-[12px] text-[#b91c1c] list-disc">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-[#e5e7eb]" />

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#111827] text-white text-[13px] hover:bg-[#1f2937] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!validation.valid || isSaving || !hasUnsavedChanges}
          >
            {isSaving ? 'Saving...' : 'Save Branding'}
          </button>

          <button
            onClick={handleDiscard}
            className="px-5 py-2.5 border border-[#d1d5db] text-[13px] text-[#374151] hover:bg-[#f9fafb] transition-colors"
            disabled={!hasUnsavedChanges}
          >
            Discard Changes
          </button>

          <div className="flex-1" />

          <button
            onClick={handleRollback}
            className="px-4 py-2.5 text-[13px] text-[#6b7280] hover:text-[#374151] transition-colors disabled:opacity-50"
            disabled={state.brandingHistory.length < 2}
            title="Rollback to previous version"
          >
            <RotateCcw className="w-4 h-4 inline mr-1" />
            Rollback
          </button>

          <button
            onClick={handleReset}
            className={`px-4 py-2.5 text-[13px] transition-colors ${
              showResetConfirm
                ? 'text-[#dc2626] hover:text-[#b91c1c]'
                : 'text-[#6b7280] hover:text-[#374151]'
            }`}
            title="Reset to platform default"
          >
            <RotateCcw className="w-4 h-4 inline mr-1" />
            {showResetConfirm ? 'Confirm Reset?' : 'Reset to Default'}
          </button>
        </div>

        {/* Accessibility Info */}
        <div className="px-4 py-3 bg-[#f0f9ff] border-l-2 border-[#3b82f6]">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] text-[#1e40af]">
                Brand colors are applied as subtle accents only. Core UI remains neutral for accessibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}