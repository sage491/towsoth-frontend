import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';

interface BackgroundWatermarkProps {
  position?: 'center' | 'bottom-right' | 'bottom-left';
  opacity?: number; // 0.03 to 0.07
  showText?: boolean;
}

export function BackgroundWatermark({ 
  position = 'center', 
  opacity = 0.05,
  showText = false 
}: BackgroundWatermarkProps) {
  const { getActiveBranding } = useInstitutionBranding();
  const branding = getActiveBranding();

  // Don't render if no logo
  if (!branding.logoUrl) {
    return null;
  }

  // Ensure opacity is within safe range
  const safeOpacity = Math.max(0.03, Math.min(0.07, opacity));

  // Position styles
  const positionStyles = {
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
  };

  return (
    <div 
      className={`fixed ${positionStyles[position]} pointer-events-none select-none z-0`}
      aria-hidden="true"
    >
      {/* Logo Watermark */}
      <div className="relative">
        <img
          src={branding.logoUrl}
          alt=""
          className="w-64 h-64 object-contain"
          style={{ opacity: safeOpacity }}
        />
        
        {/* Optional Text Below Logo */}
        {showText && (
          <div 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
            style={{ opacity: safeOpacity * 1.5 }}
          >
            <p className="text-[13px] text-[#6b7280]">
              {branding.displayName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
