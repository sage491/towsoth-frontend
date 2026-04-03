import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';

interface InstitutionLogoProps {
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  variant?: 'header' | 'footer';
}

export function InstitutionLogo({ 
  size = 'medium',
  showName = true,
  clickable = false,
  onClick,
  variant = 'header'
}: InstitutionLogoProps) {
  const { getActiveBranding } = useInstitutionBranding();
  const branding = getActiveBranding();

  // Size configurations
  const sizeConfig = {
    small: {
      logo: 'h-7',        // 28px
      text: 'text-[13px]',
      subtext: 'text-[10px]'
    },
    medium: {
      logo: 'h-9',        // 36px
      text: 'text-[15px]',
      subtext: 'text-[11px]'
    },
    large: {
      logo: 'h-10',       // 40px
      text: 'text-[17px]',
      subtext: 'text-[12px]'
    }
  };

  const config = sizeConfig[size];

  // Wrapper component
  const Wrapper = clickable ? 'button' : 'div';
  const wrapperProps = clickable 
    ? {
        onClick,
        className: `flex items-center gap-3 transition-opacity hover:opacity-80 ${variant === 'footer' ? 'cursor-pointer' : ''}`,
        type: 'button' as const
      }
    : {
        className: 'flex items-center gap-3'
      };

  return (
    <Wrapper {...wrapperProps}>
      {/* Logo */}
      {branding.logoUrl ? (
        <img
          src={branding.logoUrl}
          alt={`${branding.displayName} logo`}
          className={`${config.logo} w-auto object-contain animate-fade-in`}
          onError={(e) => {
            // Fallback to text avatar if image fails to load
            (e.target as HTMLImageElement).style.display = 'none';
            const fallback = (e.target as HTMLImageElement).nextElementSibling;
            if (fallback) {
              (fallback as HTMLElement).style.display = 'flex';
            }
          }}
        />
      ) : null}
      
      {/* Fallback Avatar (hidden by default, shown if image fails) */}
      <div 
        className={`${config.logo} aspect-square rounded-full flex items-center justify-center text-white ${!branding.logoUrl ? 'flex' : 'hidden'}`}
        style={{ backgroundColor: branding.primaryColor }}
      >
        <span className={config.text}>
          {branding.displayName.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Institution Name */}
      {showName && (
        <div className="flex flex-col">
          <span 
            className={`${config.text} ${variant === 'header' ? 'text-[#111827]' : 'text-[#374151]'} leading-tight`}
          >
            {branding.displayName}
          </span>
          {branding.tagline && variant === 'header' && (
            <span className={`${config.subtext} text-[#9ca3af] leading-tight`}>
              {branding.tagline}
            </span>
          )}
        </div>
      )}
    </Wrapper>
  );
}
