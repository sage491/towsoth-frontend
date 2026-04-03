import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';

interface FooterBrandingProps {
  showCopyright?: boolean;
  showTagline?: boolean;
  showLogo?: boolean;
}

export function FooterBranding({ 
  showCopyright = true,
  showTagline = false,
  showLogo = true 
}: FooterBrandingProps) {
  const { getActiveBranding } = useInstitutionBranding();
  const branding = getActiveBranding();

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 h-10 bg-white border-t border-[#e5e7eb] flex items-center justify-center z-10 pointer-events-none"
    >
      <div className="flex items-center gap-3 text-[11px] text-[#9ca3af]">
        {/* Institution Logo (Small) */}
        {showLogo && branding.logoUrl && (
          <>
            <img 
              src={branding.logoUrl} 
              alt={`${branding.displayName} logo`}
              className="h-5 w-auto object-contain opacity-60"
              onError={(e) => {
                // Hide logo if it fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-[#d1d5db]">|</span>
          </>
        )}
        
        {/* Copyright */}
        {showCopyright && (
          <span>© {currentYear} {branding.displayName}. All rights reserved.</span>
        )}
        
        {/* Separator */}
        {showCopyright && (
          <span className="text-[#d1d5db]">|</span>
        )}
        
        {/* Authorized Portal */}
        <span>Authorized Academic Portal</span>
        
        {/* Tagline (Optional) */}
        {showTagline && branding.tagline && (
          <>
            <span className="text-[#d1d5db]">|</span>
            <span className="italic">{branding.tagline}</span>
          </>
        )}
        
        {/* Brand Color Accent Dot */}
        <span 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: branding.primaryColor }}
        />
      </div>
    </footer>
  );
}