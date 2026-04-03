import { useState, useEffect } from 'react';
import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';

interface StudentBrandingAnimationProps {
  position?: 'top-right' | 'center-welcome' | 'hero-banner';
  size?: 'small' | 'medium' | 'large';
  showWelcomeText?: boolean;
}

export function StudentBrandingAnimation({ 
  position = 'top-right',
  size = 'medium',
  showWelcomeText = true
}: StudentBrandingAnimationProps) {
  const { getActiveBranding } = useInstitutionBranding();
  const branding = getActiveBranding();
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lottiePlayer, setLottiePlayer] = useState<any>(null);

  // Size configurations
  const sizeConfig = {
    small: {
      desktop: 'w-20 h-20',
      mobile: 'w-16 h-16',
    },
    medium: {
      desktop: 'w-32 h-32',
      mobile: 'w-20 h-20',
    },
    large: {
      desktop: 'w-40 h-40',
      mobile: 'w-24 h-24',
    }
  };

  const config = sizeConfig[size];

  // Position styles
  const positionStyles = {
    'top-right': 'absolute top-6 right-6 z-10',
    'center-welcome': 'mx-auto',
    'hero-banner': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-20',
  };

  // Mock student branding data
  const studentBranding = {
    enabled: true,
    brandingType: 'static' as 'static' | 'gif' | 'lottie' | 'video',
    brandingAssetUrl: branding.logoUrl || '',
    fallbackLogoUrl: branding.logoUrl || '',
    welcomeText: `Welcome to ${branding.displayName}`,
  };

  // Load Lottie player dynamically
  useEffect(() => {
    if (studentBranding.brandingType === 'lottie') {
      import('@lottiefiles/lottie-player').then(() => {
        setLottiePlayer(true);
      }).catch(() => {
        setHasError(true);
      });
    }
  }, [studentBranding.brandingType]);

  if (!studentBranding.enabled || !studentBranding.brandingAssetUrl) {
    return null;
  }

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  const renderBranding = () => {
    if (hasError && studentBranding.fallbackLogoUrl) {
      return (
        <img
          src={studentBranding.fallbackLogoUrl}
          alt={branding.displayName}
          className={`${config.desktop} md:${config.desktop} ${config.mobile} object-contain animate-fade-in`}
          onLoad={handleLoad}
        />
      );
    }

    switch (studentBranding.brandingType) {
      case 'gif':
        return (
          <img
            src={studentBranding.brandingAssetUrl}
            alt={`${branding.displayName} animated logo`}
            className={`${config.desktop} md:${config.desktop} ${config.mobile} object-contain animate-fade-in`}
            onLoad={handleLoad}
            onError={handleError}
          />
        );

      case 'video':
        return (
          <video
            src={studentBranding.brandingAssetUrl}
            className={`${config.desktop} md:${config.desktop} ${config.mobile} object-contain animate-fade-in`}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleLoad}
            onError={handleError}
          />
        );

      case 'lottie':
        if (lottiePlayer) {
          return (
            <div className={`${config.desktop} md:${config.desktop} ${config.mobile} animate-fade-in`}>
              <lottie-player
                src={studentBranding.brandingAssetUrl}
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          );
        }
        return (
          <img
            src={studentBranding.fallbackLogoUrl}
            alt={branding.displayName}
            className={`${config.desktop} md:${config.desktop} ${config.mobile} object-contain animate-fade-in`}
            onLoad={handleLoad}
          />
        );

      case 'static':
      default:
        return (
          <img
            src={studentBranding.brandingAssetUrl || studentBranding.fallbackLogoUrl}
            alt={branding.displayName}
            className={`${config.desktop} md:${config.desktop} ${config.mobile} object-contain animate-fade-in`}
            onLoad={handleLoad}
            onError={handleError}
          />
        );
    }
  };

  return (
    <div className={positionStyles[position]}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {renderBranding()}
          
          {!isLoaded && !hasError && (
            <div className={`${config.desktop} md:${config.desktop} ${config.mobile} absolute inset-0 flex items-center justify-center`}>
              <div 
                className="w-8 h-8 border-4 border-[#e5e7eb] border-t-[var(--brand-primary)] rounded-full animate-spin"
              />
            </div>
          )}
        </div>

        {showWelcomeText && position === 'center-welcome' && (
          <div className="text-center">
            <p className="text-[15px] text-[#111827]">
              {studentBranding.welcomeText}
            </p>
            <div 
              className="h-1 w-16 mx-auto mt-2 rounded-full"
              style={{ backgroundColor: branding.primaryColor }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
