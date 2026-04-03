import { useEffect } from 'react';
import { useInstitutionBranding } from '../../contexts/InstitutionBrandingEngine';
import { generateBrandColorCSS } from '../../utils/brandColorGenerator';

/**
 * BrandColorTokens Component
 * 
 * Injects CSS custom properties (CSS variables) for institution brand colors
 * These tokens are used throughout the application for dynamic theming
 * 
 * Updates automatically when branding changes
 */
export function BrandColorTokens() {
  const { getActiveBranding } = useInstitutionBranding();
  const branding = getActiveBranding();

  useEffect(() => {
    // Generate CSS variables from brand colors
    const cssVars = generateBrandColorCSS(
      branding.primaryColor,
      branding.secondaryColor
    );

    // Inject into document root
    const style = document.createElement('style');
    style.id = 'brand-color-tokens';
    style.textContent = `
      :root {
        ${cssVars}
      }
    `;

    // Remove existing style if present
    const existing = document.getElementById('brand-color-tokens');
    if (existing) {
      existing.remove();
    }

    // Append new style
    document.head.appendChild(style);

    return () => {
      // Cleanup on unmount
      const styleToRemove = document.getElementById('brand-color-tokens');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [branding.primaryColor, branding.secondaryColor]);

  // This component renders nothing - it only injects CSS
  return null;
}
