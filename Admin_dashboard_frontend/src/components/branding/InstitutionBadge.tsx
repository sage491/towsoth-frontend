import { Shield, Lock, CheckCircle } from 'lucide-react';
import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';

interface InstitutionBadgeProps {
  variant?: 'compact' | 'detailed';
  showLicense?: boolean;
}

export function InstitutionBadge({ 
  variant = 'compact',
  showLicense = true 
}: InstitutionBadgeProps) {
  const { getActiveBranding } = useInstitutionBranding();
  const branding = getActiveBranding();

  if (variant === 'compact') {
    return (
      <div className="bg-white border border-[#e5e7eb] p-3 flex items-center gap-3 pointer-events-none select-none">
        {/* Logo */}
        {branding.logoUrl ? (
          <img 
            src={branding.logoUrl} 
            alt={branding.displayName}
            className="w-8 h-8 object-contain"
          />
        ) : (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px]"
            style={{ backgroundColor: branding.primaryColor }}
          >
            {branding.displayName.charAt(0)}
          </div>
        )}
        
        {/* Institution Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[12px] text-[#111827] truncate">
              {branding.displayName}
            </p>
            {showLicense && (
              <CheckCircle 
                className="w-3.5 h-3.5 text-[#16a34a] flex-shrink-0" 
                strokeWidth={2}
              />
            )}
          </div>
          {showLicense && (
            <p className="text-[10px] text-[#9ca3af] uppercase tracking-wider">
              Licensed Edition
            </p>
          )}
        </div>
        
        {/* Lock Icon */}
        <Lock className="w-4 h-4 text-[#9ca3af] flex-shrink-0" />
      </div>
    );
  }

  // Detailed variant
  return (
    <div className="bg-white border border-[#e5e7eb] p-4 pointer-events-none select-none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${branding.primaryColor}15` }}
        >
          <Shield 
            className="w-5 h-5" 
            style={{ color: branding.primaryColor }}
          />
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-0.5">
            Institution Identity
          </p>
          <p className="text-[13px] text-[#111827]">
            Official Portal
          </p>
        </div>
      </div>
      
      {/* Institution Details */}
      <div className="space-y-2 pt-3 border-t border-[#f3f4f6]">
        <div className="flex items-start gap-2">
          <span className="text-[11px] text-[#9ca3af] w-20 flex-shrink-0">Institution:</span>
          <span className="text-[11px] text-[#111827]">{branding.displayName}</span>
        </div>
        
        {branding.tagline && (
          <div className="flex items-start gap-2">
            <span className="text-[11px] text-[#9ca3af] w-20 flex-shrink-0">Tagline:</span>
            <span className="text-[11px] text-[#6b7280] italic">{branding.tagline}</span>
          </div>
        )}
        
        {showLicense && (
          <div className="flex items-start gap-2">
            <span className="text-[11px] text-[#9ca3af] w-20 flex-shrink-0">Edition:</span>
            <span className="text-[11px] text-[#16a34a] flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Licensed & Authorized
            </span>
          </div>
        )}
        
        <div className="flex items-start gap-2">
          <span className="text-[11px] text-[#9ca3af] w-20 flex-shrink-0">Status:</span>
          <span className="text-[11px] text-[#111827] flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#9ca3af]" />
            Secured Access
          </span>
        </div>
      </div>
      
      {/* Brand Color Indicator */}
      <div className="mt-3 pt-3 border-t border-[#f3f4f6] flex items-center gap-2">
        <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider">Brand Identity</span>
        <div 
          className="w-4 h-4 rounded border border-[#e5e7eb]"
          style={{ backgroundColor: branding.primaryColor }}
        />
      </div>
    </div>
  );
}
