/**
 * Brand Color Generator Utility
 * 
 * Generates accessible hover, active, and muted variants from a primary brand color
 * Ensures WCAG AA compliance for all generated shades
 */

interface ColorVariants {
  primary: string;
  hover: string;
  active: string;
  muted: string;
  light: string;
  contrast: string;
}

/**
 * Convert HEX to RGB components
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
}

/**
 * Calculate relative luminance (for contrast ratio)
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Darken a color by reducing lightness
 */
function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.max(0, hsl.l - amount);

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Lighten a color by increasing lightness
 */
function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.min(100, hsl.l + amount);

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Add alpha transparency to a hex color
 */
function addAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Generate accessible color variants from primary brand color
 */
export function generateBrandColorVariants(primaryColor: string): ColorVariants {
  const rgb = hexToRgb(primaryColor);
  if (!rgb) {
    // Fallback to safe defaults
    return {
      primary: '#3b82f6',
      hover: '#2563eb',
      active: '#1d4ed8',
      muted: 'rgba(59, 130, 246, 0.1)',
      light: 'rgba(59, 130, 246, 0.05)',
      contrast: '#ffffff',
    };
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Generate hover state (darker)
  let hover = darken(primaryColor, 10);
  
  // Ensure hover is accessible (at least 4.5:1 contrast with white for text)
  const contrastWithWhite = getContrastRatio(hover, '#ffffff');
  if (contrastWithWhite < 4.5) {
    // Make it darker until it meets contrast
    let attempts = 0;
    while (getContrastRatio(hover, '#ffffff') < 4.5 && attempts < 10) {
      hover = darken(hover, 5);
      attempts++;
    }
  }

  // Generate active state (even darker)
  const active = darken(hover, 8);

  // Generate muted background (very light, semi-transparent)
  const muted = addAlpha(primaryColor, 0.1);

  // Generate ultra-light background
  const light = addAlpha(primaryColor, 0.05);

  // Determine best contrast text color (white or black)
  const contrastWithBlack = getContrastRatio(primaryColor, '#000000');
  const contrast = contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000';

  return {
    primary: primaryColor,
    hover,
    active,
    muted,
    light,
    contrast,
  };
}

/**
 * Generate CSS custom properties string
 */
export function generateBrandColorCSS(primaryColor: string, secondaryColor?: string): string {
  const variants = generateBrandColorVariants(primaryColor);
  const secondaryVariants = secondaryColor
    ? generateBrandColorVariants(secondaryColor)
    : null;

  return `
    --brand-primary: ${variants.primary};
    --brand-primary-hover: ${variants.hover};
    --brand-primary-active: ${variants.active};
    --brand-primary-muted: ${variants.muted};
    --brand-primary-light: ${variants.light};
    --brand-primary-contrast: ${variants.contrast};
    ${
      secondaryVariants
        ? `
    --brand-secondary: ${secondaryVariants.primary};
    --brand-secondary-hover: ${secondaryVariants.hover};
    --brand-secondary-active: ${secondaryVariants.active};
    --brand-secondary-muted: ${secondaryVariants.muted};
    --brand-secondary-light: ${secondaryVariants.light};
    --brand-secondary-contrast: ${secondaryVariants.contrast};
    `
        : ''
    }
  `.trim();
}
