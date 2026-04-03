import { useState } from 'react';
import { Upload, X, Eye, Save, AlertCircle, CheckCircle, Play, Film, Image as ImageIcon } from 'lucide-react';
import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';
import { useToast } from '../../contexts/ToastContext';

export function StudentBrandingSettings() {
  const { getActiveBranding } = useInstitutionBranding();
  const { success, error } = useToast();
  const branding = getActiveBranding();

  const [formData, setFormData] = useState({
    enabled: true,
    brandingType: 'static' as 'static' | 'gif' | 'lottie' | 'video',
    brandingAssetUrl: '',
    fallbackLogoUrl: branding.logoUrl || '',
    welcomeText: `Welcome to ${branding.displayName}`,
    position: 'top-right' as 'top-right' | 'center-welcome' | 'hero-banner',
    size: 'medium' as 'small' | 'medium' | 'large',
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = {
      gif: ['image/gif'],
      video: ['video/webm', 'video/mp4'],
      lottie: ['application/json'],
    };

    const selectedType = formData.brandingType;
    if (selectedType !== 'static' && selectedType !== 'lottie') {
      const isValid = validTypes[selectedType]?.includes(file.type);
      if (!isValid) {
        error(`Please upload a valid ${selectedType.toUpperCase()} file`);
        return;
      }
    }

    if (file.size > 2 * 1024 * 1024) {
      error('File size must be less than 2MB for optimal performance');
      return;
    }

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleChange('brandingAssetUrl', dataUrl);
      success(`${selectedType.toUpperCase()} uploaded successfully`);
      setTimeout(() => setUploadProgress(0), 1000);
    };

    if (formData.brandingType === 'lottie') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAsset = () => {
    handleChange('brandingAssetUrl', '');
    success('Branding asset removed');
  };

  const handlePreview = () => {
    setIsPreviewMode(true);
    success('Preview mode enabled - View student dashboard to see changes');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Student branding updated successfully');
      setIsPreviewMode(false);
    } catch (err) {
      error('Failed to update student branding');
    } finally {
      setIsSaving(false);
    }
  };

  const getFileTypeLabel = () => {
    switch (formData.brandingType) {
      case 'gif': return 'Animated GIF';
      case 'video': return 'Video (WebM/MP4)';
      case 'lottie': return 'Lottie JSON';
      case 'static': return 'Static Image';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-[#111827] mb-1">Student Dashboard Branding</h1>
          <p className="text-[13px] text-[#6b7280]">
            Display animated or static branding on student dashboard only
          </p>
        </div>
        
        {isPreviewMode && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#dbeafe] border border-[#3b82f6] text-[#1e40af] text-[13px]">
            <Eye className="w-4 h-4" />
            Preview Active
          </div>
        )}
      </div>

      <div className="bg-[#dbeafe] border-l-4 border-[#3b82f6] p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#1e40af] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] text-[#1e40af]">
            <strong>Student Dashboard Only</strong> – This branding appears exclusively on student dashboards, not for faculty or admins.
          </p>
          <p className="text-[12px] text-[#1e40af] mt-1">
            Supports: Animated GIF, Lottie animations, short looping videos (WebM), or static images.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white border border-[#e5e7eb] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] text-[#111827] mb-1">Student Branding</h2>
                <p className="text-[12px] text-[#6b7280]">Enable or disable branding on student dashboard</p>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-[13px] text-[#374151]">
                  {formData.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => handleChange('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#d1d5db] rounded-full peer-checked:bg-[var(--brand-primary)] transition-colors" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] p-5">
            <h2 className="text-[15px] text-[#111827] mb-4">Branding Type</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleChange('brandingType', 'static')}
                className={`p-4 border-2 transition-all ${
                  formData.brandingType === 'static'
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
                    : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                }`}
              >
                <ImageIcon className="w-6 h-6 mx-auto mb-2 text-[#6b7280]" />
                <p className="text-[13px] text-[#111827]">Static Image</p>
                <p className="text-[11px] text-[#9ca3af] mt-1">PNG, JPG, SVG</p>
              </button>

              <button
                onClick={() => handleChange('brandingType', 'gif')}
                className={`p-4 border-2 transition-all ${
                  formData.brandingType === 'gif'
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
                    : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                }`}
              >
                <Film className="w-6 h-6 mx-auto mb-2 text-[#6b7280]" />
                <p className="text-[13px] text-[#111827]">Animated GIF</p>
                <p className="text-[11px] text-[#9ca3af] mt-1">Loop animation</p>
              </button>

              <button
                onClick={() => handleChange('brandingType', 'lottie')}
                className={`p-4 border-2 transition-all ${
                  formData.brandingType === 'lottie'
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
                    : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                }`}
              >
                <Play className="w-6 h-6 mx-auto mb-2 text-[#6b7280]" />
                <p className="text-[13px] text-[#111827]">Lottie Animation</p>
                <p className="text-[11px] text-[#9ca3af] mt-1">JSON format</p>
              </button>

              <button
                onClick={() => handleChange('brandingType', 'video')}
                className={`p-4 border-2 transition-all ${
                  formData.brandingType === 'video'
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
                    : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                }`}
              >
                <Film className="w-6 h-6 mx-auto mb-2 text-[#6b7280]" />
                <p className="text-[13px] text-[#111827]">Video Loop</p>
                <p className="text-[11px] text-[#9ca3af] mt-1">WebM, MP4 (muted)</p>
              </button>
            </div>

            <div className="mt-4 p-3 bg-[#fef3c7] border border-[#fbbf24] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#92400e] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#92400e]">
                <strong>Performance Tip:</strong> Keep file size under 2MB. Lottie animations are recommended for smooth performance.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] p-5">
            <h2 className="text-[15px] text-[#111827] mb-4">Upload Branding Asset</h2>

            {formData.brandingAssetUrl && (
              <div className="mb-4 relative">
                <div className="w-40 h-40 border-2 border-[#e5e7eb] bg-[#fafafa] flex items-center justify-center p-4">
                  {formData.brandingType === 'gif' && (
                    <img src={formData.brandingAssetUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  )}
                  {formData.brandingType === 'video' && (
                    <video src={formData.brandingAssetUrl} autoPlay loop muted className="max-w-full max-h-full object-contain" />
                  )}
                  {formData.brandingType === 'static' && (
                    <img src={formData.brandingAssetUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  )}
                  {formData.brandingType === 'lottie' && (
                    <div className="text-center">
                      <Play className="w-12 h-12 mx-auto text-[#6b7280] mb-2" />
                      <p className="text-[11px] text-[#9ca3af]">Lottie JSON loaded</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleRemoveAsset}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#dc2626] text-white rounded-full flex items-center justify-center hover:bg-[#b91c1c] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[13px] transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                {formData.brandingAssetUrl ? 'Replace Asset' : `Upload ${getFileTypeLabel()}`}
                <input 
                  type="file" 
                  accept={
                    formData.brandingType === 'gif' ? 'image/gif' :
                    formData.brandingType === 'video' ? 'video/webm,video/mp4' :
                    formData.brandingType === 'lottie' ? 'application/json,.json' :
                    'image/*'
                  }
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--brand-primary)] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-[11px] text-[#9ca3af]">
                {formData.brandingType === 'gif' && 'Recommended: Transparent background, smooth loop, < 2MB'}
                {formData.brandingType === 'video' && 'Recommended: WebM format, muted, short loop (3-5 sec), < 2MB'}
                {formData.brandingType === 'lottie' && 'Recommended: Export from LottieFiles or After Effects, < 500KB'}
                {formData.brandingType === 'static' && 'Recommended: PNG with transparency, square aspect ratio'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] p-5">
            <h2 className="text-[15px] text-[#111827] mb-4">Display Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-2">Position on Dashboard</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'top-right', label: 'Top Right' },
                    { value: 'center-welcome', label: 'Center Welcome' },
                    { value: 'hero-banner', label: 'Hero Banner' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange('position', option.value)}
                      className={`px-3 py-2 text-[12px] border transition-colors ${
                        formData.position === option.value
                          ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                          : 'bg-white text-[#374151] border-[#d1d5db] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-[#374151] mb-2">Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'small', label: 'Small (80px)' },
                    { value: 'medium', label: 'Medium (128px)' },
                    { value: 'large', label: 'Large (160px)' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange('size', option.value)}
                      className={`px-3 py-2 text-[12px] border transition-colors ${
                        formData.size === option.value
                          ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                          : 'bg-white text-[#374151] border-[#d1d5db] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5">
                  Welcome Text <span className="text-[#9ca3af]">(Optional, shown only in Center Welcome)</span>
                </label>
                <input
                  type="text"
                  value={formData.welcomeText}
                  onChange={(e) => handleChange('welcomeText', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#d1d5db] text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all"
                  placeholder="e.g., Welcome to ABC University"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#e5e7eb] p-4 sticky top-6">
            <h3 className="text-[13px] text-[#111827] mb-3 uppercase tracking-wider">Live Preview</h3>
            
            {formData.enabled && formData.brandingAssetUrl ? (
              <div className="border-2 border-dashed border-[#e5e7eb] bg-[#fafafa] p-6 min-h-[200px] flex items-center justify-center relative">
                {formData.position === 'center-welcome' && (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-3 bg-white border border-[#e5e7eb] flex items-center justify-center">
                      {formData.brandingType === 'gif' && (
                        <img src={formData.brandingAssetUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                      )}
                      {formData.brandingType === 'video' && (
                        <video src={formData.brandingAssetUrl} autoPlay loop muted className="max-w-full max-h-full object-contain" />
                      )}
                      {formData.brandingType === 'lottie' && (
                        <Play className="w-12 h-12 text-[#6b7280]" />
                      )}
                      {formData.brandingType === 'static' && (
                        <img src={formData.brandingAssetUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                      )}
                    </div>
                    <p className="text-[13px] text-[#111827]">{formData.welcomeText}</p>
                    <div 
                      className="h-1 w-12 mx-auto mt-2 rounded-full"
                      style={{ backgroundColor: branding.primaryColor }}
                    />
                  </div>
                )}
                
                {formData.position === 'top-right' && (
                  <div className="absolute top-3 right-3 w-20 h-20 bg-white border border-[#e5e7eb] flex items-center justify-center">
                    <div className="w-16 h-16">
                      {formData.brandingType === 'gif' && (
                        <img src={formData.brandingAssetUrl} alt="Preview" className="w-full h-full object-contain" />
                      )}
                      {formData.brandingType === 'static' && (
                        <img src={formData.brandingAssetUrl} alt="Preview" className="w-full h-full object-contain" />
                      )}
                    </div>
                  </div>
                )}

                {formData.position === 'hero-banner' && (
                  <div className="w-32 h-32 opacity-20">
                    {formData.brandingType === 'gif' && (
                      <img src={formData.brandingAssetUrl} alt="Preview" className="w-full h-full object-contain" />
                    )}
                  </div>
                )}

                <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-[#9ca3af] uppercase tracking-wider">
                  Student Dashboard Preview
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#e5e7eb] bg-[#fafafa] p-6 min-h-[200px] flex items-center justify-center">
                <p className="text-[12px] text-[#9ca3af] text-center">
                  {!formData.enabled ? 'Branding disabled' : 'Upload an asset to preview'}
                </p>
              </div>
            )}

            <div className="space-y-2 mt-4 pt-4 border-t border-[#f3f4f6]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9ca3af]">Status</span>
                <span className={formData.enabled ? 'text-[#16a34a] flex items-center gap-1' : 'text-[#9ca3af]'}>
                  {formData.enabled ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </>
                  ) : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9ca3af]">Type</span>
                <span className="text-[#111827]">{getFileTypeLabel()}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9ca3af]">Asset</span>
                <span className={formData.brandingAssetUrl ? 'text-[#16a34a]' : 'text-[#9ca3af]'}>
                  {formData.brandingAssetUrl ? 'Uploaded' : 'Not uploaded'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handlePreview}
              disabled={!formData.brandingAssetUrl}
              className="w-full px-4 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4" />
              Preview on Student Dashboard
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.brandingAssetUrl}
              className="w-full px-4 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
