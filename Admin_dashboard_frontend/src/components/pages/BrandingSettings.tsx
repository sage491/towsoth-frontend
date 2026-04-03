import { useState } from 'react';
import { Upload, X, Eye, Save, RotateCcw, AlertCircle, CheckCircle, Image, Palette, Type } from 'lucide-react';
import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';
import { useToast } from '../../contexts/ToastContext';
import { BackgroundWatermark } from '../branding/BackgroundWatermark';
import { FooterBranding } from '../branding/FooterBranding';
import { InstitutionBadge } from '../branding/InstitutionBadge';

export function BrandingSettings() {
  const { 
    state, 
    updateBranding, 
    resetBranding, 
    applyPreview, 
    exitPreview, 
    savePreview, 
    validateColor,
    getActiveBranding 
  } = useInstitutionBranding();
  
  const { success, error, warning } = useToast();
  const branding = getActiveBranding();

  // Form state
  const [formData, setFormData] = useState({
    displayName: branding.displayName,
    primaryColor: branding.primaryColor,
    tagline: branding.tagline || '',
    logoUrl: branding.logoUrl || '',
  });

  // UI state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [watermarkSettings, setWatermarkSettings] = useState({
    enabled: true,
    position: 'center' as 'center' | 'bottom-right' | 'bottom-left',
    opacity: 0.05,
  });
  const [footerSettings, setFooterSettings] = useState({
    enabled: true,
    showCopyright: true,
    showTagline: false,
  });

  // Handle form changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle color change with validation
  const handleColorChange = (color: string) => {
    const validation = validateColor(color);
    handleChange('primaryColor', color);
    
    if (!validation.valid) {
      validation.errors.forEach(err => error(err));
    }
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warn => warning(warn));
    }
  };

  // Handle logo upload (simulated)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      error('Image size must be less than 2MB');
      return;
    }

    // Simulate upload (in real app, this would call uploadLogo API)
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleChange('logoUrl', dataUrl);
      success('Logo uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  // Handle logo removal
  const handleLogoRemove = () => {
    handleChange('logoUrl', '');
    success('Logo removed');
  };

  // Enable preview mode
  const handlePreview = () => {
    applyPreview({
      displayName: formData.displayName,
      primaryColor: formData.primaryColor,
      tagline: formData.tagline,
      logoUrl: formData.logoUrl,
    });
    setIsPreviewMode(true);
    success('Preview mode enabled');
  };

  // Exit preview mode
  const handleExitPreview = () => {
    exitPreview();
    setIsPreviewMode(false);
    // Reset form to original values
    setFormData({
      displayName: branding.displayName,
      primaryColor: branding.primaryColor,
      tagline: branding.tagline || '',
      logoUrl: branding.logoUrl || '',
    });
    success('Preview mode exited');
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isPreviewMode) {
        await savePreview();
        setIsPreviewMode(false);
      } else {
        await updateBranding({
          displayName: formData.displayName,
          primaryColor: formData.primaryColor,
          tagline: formData.tagline,
          logoUrl: formData.logoUrl,
        });
      }
      success('Branding updated successfully');
    } catch (err) {
      error('Failed to update branding');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = async () => {
    if (confirm('Are you sure you want to reset branding to defaults?')) {
      try {
        await resetBranding();
        setFormData({
          displayName: branding.displayName,
          primaryColor: branding.primaryColor,
          tagline: branding.tagline || '',
          logoUrl: branding.logoUrl || '',
        });
        success('Branding reset to defaults');
      } catch (err) {
        error('Failed to reset branding');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#111827] mb-1">Institution Branding</h1>
          <p className="text-[13px] text-[#6b7280]">
            Manage your institution's visual identity and branding elements
          </p>
        </div>
        
        {/* Preview Mode Badge */}
        {isPreviewMode && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#fef3c7] border border-[#fbbf24] text-[#92400e] text-[13px]">
            <Eye className="w-4 h-4" />
            Preview Mode Active
          </div>
        )}
      </div>

      {/* Warning Banner */}
      <div className="bg-[#fef3c7] border-l-4 border-[#f59e0b] p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#92400e] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] text-[#92400e]">
            <strong>Super Admin Access Only</strong> – Changes to branding will affect the entire institution's portal.
          </p>
          <p className="text-[12px] text-[#92400e] mt-1">
            Always preview changes before saving to ensure proper visibility and contrast.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Settings */}
        <div className="col-span-2 space-y-6">
          {/* Logo Upload */}
          <div className="bg-white border border-[#e5e7eb] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#f3f4f6] flex items-center justify-center">
                <Image className="w-4 h-4 text-[#6b7280]" />
              </div>
              <div>
                <h2 className="text-[15px] text-[#111827]">Institution Logo</h2>
                <p className="text-[12px] text-[#6b7280]">Upload your institution's official logo</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Logo Preview */}
              {formData.logoUrl && (
                <div className="relative w-32 h-32 border border-[#e5e7eb] bg-[#fafafa] flex items-center justify-center p-3">
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    onClick={handleLogoRemove}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#dc2626] text-white rounded-full flex items-center justify-center hover:bg-[#b91c1c] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#f9fafb] border border-[#d1d5db] text-[13px] text-[#374151] hover:bg-[#f3f4f6] transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {formData.logoUrl ? 'Replace Logo' : 'Upload Logo'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
                <p className="text-[11px] text-[#9ca3af] mt-2">
                  Recommended: PNG or SVG, max 2MB, square aspect ratio
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white border border-[#e5e7eb] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#f3f4f6] flex items-center justify-center">
                <Type className="w-4 h-4 text-[#6b7280]" />
              </div>
              <div>
                <h2 className="text-[15px] text-[#111827]">Basic Information</h2>
                <p className="text-[12px] text-[#6b7280]">Institution name and tagline</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Institution Name <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                  placeholder="e.g., ABC University"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Tagline <span className="text-[#9ca3af]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                  placeholder="e.g., Excellence in Education"
                />
              </div>
            </div>
          </div>

          {/* Brand Color */}
          <div className="bg-white border border-[#e5e7eb] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#f3f4f6] flex items-center justify-center">
                <Palette className="w-4 h-4 text-[#6b7280]" />
              </div>
              <div>
                <h2 className="text-[15px] text-[#111827]">Brand Color</h2>
                <p className="text-[12px] text-[#6b7280]">Primary color for your institution's identity</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {/* Color Picker */}
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-12 rounded border border-[#d1d5db] cursor-pointer"
                  />
                  <div>
                    <p className="text-[13px] text-[#374151]">{formData.primaryColor}</p>
                    <p className="text-[11px] text-[#9ca3af]">Hex Color Code</p>
                  </div>
                </div>

                {/* Color Preview Swatches */}
                <div className="flex items-center gap-2 ml-auto">
                  <div 
                    className="w-8 h-8 rounded border border-[#e5e7eb]"
                    style={{ backgroundColor: formData.primaryColor }}
                    title="Primary"
                  />
                  <div 
                    className="w-8 h-8 rounded border border-[#e5e7eb]"
                    style={{ backgroundColor: `${formData.primaryColor}80` }}
                    title="50% Opacity"
                  />
                  <div 
                    className="w-8 h-8 rounded border border-[#e5e7eb]"
                    style={{ backgroundColor: `${formData.primaryColor}20` }}
                    title="Light Background"
                  />
                </div>
              </div>

              {/* Quick Color Presets */}
              <div>
                <p className="text-[11px] text-[#9ca3af] mb-2 uppercase tracking-wider">Quick Presets</p>
                <div className="flex items-center gap-2">
                  {[
                    { name: 'Blue', color: '#1E40AF' },
                    { name: 'Green', color: '#15803d' },
                    { name: 'Purple', color: '#7c3aed' },
                    { name: 'Red', color: '#dc2626' },
                    { name: 'Orange', color: '#ea580c' },
                    { name: 'Teal', color: '#0d9488' },
                  ].map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => handleColorChange(preset.color)}
                      className="w-10 h-10 rounded border-2 border-transparent hover:border-[#d1d5db] transition-colors"
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Watermark Settings */}
          <div className="bg-white border border-[#e5e7eb] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[15px] text-[#111827]">Background Watermark</h2>
                <p className="text-[12px] text-[#6b7280]">Subtle logo watermark on dashboard pages</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watermarkSettings.enabled}
                  onChange={(e) => setWatermarkSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 accent-[var(--brand-primary)]"
                />
                <span className="text-[13px] text-[#374151]">Enabled</span>
              </label>
            </div>

            {watermarkSettings.enabled && (
              <div className="space-y-4 pt-4 border-t border-[#f3f4f6]">
                {/* Position */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-2">Position</label>
                  <div className="flex items-center gap-2">
                    {['center', 'bottom-right', 'bottom-left'].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setWatermarkSettings(prev => ({ ...prev, position: pos as any }))}
                        className={`px-4 py-2 text-[12px] border transition-colors ${
                          watermarkSettings.position === pos
                            ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                            : 'bg-white text-[#374151] border-[#d1d5db] hover:bg-[#f9fafb]'
                        }`}
                      >
                        {pos.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-[13px] text-[#374151] mb-2">
                    Opacity: {(watermarkSettings.opacity * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.03"
                    max="0.07"
                    step="0.01"
                    value={watermarkSettings.opacity}
                    onChange={(e) => setWatermarkSettings(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                    className="w-full accent-[var(--brand-primary)]"
                  />
                  <div className="flex justify-between text-[11px] text-[#9ca3af] mt-1">
                    <span>Subtle (3%)</span>
                    <span>Visible (7%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Settings */}
          <div className="bg-white border border-[#e5e7eb] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[15px] text-[#111827]">Footer Branding</h2>
                <p className="text-[12px] text-[#6b7280]">Copyright and institution information in footer</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={footerSettings.enabled}
                  onChange={(e) => setFooterSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 accent-[var(--brand-primary)]"
                />
                <span className="text-[13px] text-[#374151]">Enabled</span>
              </label>
            </div>

            {footerSettings.enabled && (
              <div className="space-y-3 pt-4 border-t border-[#f3f4f6]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerSettings.showCopyright}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, showCopyright: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--brand-primary)]"
                  />
                  <span className="text-[13px] text-[#374151]">Show copyright year</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerSettings.showTagline}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, showTagline: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--brand-primary)]"
                  />
                  <span className="text-[13px] text-[#374151]">Show tagline in footer</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-4">
          {/* Preview Card */}
          <div className="bg-white border border-[#e5e7eb] p-4 sticky top-6">
            <h3 className="text-[13px] text-[#111827] mb-3 uppercase tracking-wider">Live Preview</h3>
            
            {/* Institution Badge Preview */}
            <div className="mb-4">
              <p className="text-[11px] text-[#9ca3af] mb-2">Institution Badge</p>
              <InstitutionBadge variant="detailed" />
            </div>

            {/* Color Palette Preview */}
            <div className="mb-4">
              <p className="text-[11px] text-[#9ca3af] mb-2">Color Palette</p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div 
                    className="h-12 rounded border border-[#e5e7eb]"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <p className="text-[10px] text-[#9ca3af] mt-1">Primary</p>
                </div>
                <div>
                  <div 
                    className="h-12 rounded border border-[#e5e7eb]"
                    style={{ backgroundColor: `${formData.primaryColor}80` }}
                  />
                  <p className="text-[10px] text-[#9ca3af] mt-1">Hover</p>
                </div>
                <div>
                  <div 
                    className="h-12 rounded border border-[#e5e7eb]"
                    style={{ backgroundColor: `${formData.primaryColor}20` }}
                  />
                  <p className="text-[10px] text-[#9ca3af] mt-1">Light</p>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-2 pt-4 border-t border-[#f3f4f6]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9ca3af]">Logo</span>
                <span className={formData.logoUrl ? 'text-[#16a34a] flex items-center gap-1' : 'text-[#dc2626]'}>
                  {formData.logoUrl ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Uploaded
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Missing
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9ca3af]">Watermark</span>
                <span className={watermarkSettings.enabled ? 'text-[#16a34a]' : 'text-[#9ca3af]'}>
                  {watermarkSettings.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9ca3af]">Footer</span>
                <span className={footerSettings.enabled ? 'text-[#16a34a]' : 'text-[#9ca3af]'}>
                  {footerSettings.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {!isPreviewMode ? (
              <>
                <button
                  onClick={handlePreview}
                  className="w-full px-4 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview Changes
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full px-4 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full px-4 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Apply Changes'}
                </button>
                <button
                  onClick={handleExitPreview}
                  className="w-full px-4 py-2.5 bg-[#f9fafb] hover:bg-[#f3f4f6] text-[#374151] text-[13px] font-normal hover:font-semibold border border-[#d1d5db] transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel Preview
                </button>
              </>
            )}
            <button
              onClick={handleReset}
              className="w-full px-4 py-2.5 bg-white hover:bg-[#f9fafb] text-[#dc2626] text-[13px] font-normal hover:font-semibold border border-[#d1d5db] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
