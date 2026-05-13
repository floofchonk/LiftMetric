import { useEffect, useState } from 'react';
import { useEntity } from './useEntity';
import { brandSettingsEntityConfig } from '../entities/BrandSettings';

type BrandSettings = {
  id: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  fontFamily: string;
  fontHeading: string;
  companyName: string;
  tagline: string;
  created_at: string;
  updated_at: string;
};

const defaultBranding = {
  primaryColor: '#2563eb',
  secondaryColor: '#7c3aed',
  accentColor: '#06b6d4',
  logoUrl: '',
  fontFamily: 'Inter',
  fontHeading: 'Montserrat',
  companyName: 'Lift Metric',
  tagline: 'Advanced Financial Analysis',
};

export function useBranding() {
  const { items: brandSettingsItems, loading } = useEntity<BrandSettings>(brandSettingsEntityConfig);
  const [branding, setBranding] = useState(defaultBranding);

  useEffect(() => {
    if (brandSettingsItems.length > 0) {
      const latest = brandSettingsItems[0];
      setBranding({
        primaryColor: latest.primaryColor,
        secondaryColor: latest.secondaryColor,
        accentColor: latest.accentColor,
        logoUrl: latest.logoUrl,
        fontFamily: latest.fontFamily,
        fontHeading: latest.fontHeading,
        companyName: latest.companyName,
        tagline: latest.tagline,
      });
    }
  }, [brandSettingsItems]);

  // Apply fonts to document
  useEffect(() => {
    if (branding.fontFamily || branding.fontHeading) {
      const fontFamilies = [branding.fontFamily, branding.fontHeading].filter(Boolean);
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?${fontFamilies.map(f => `family=${f.replace(/\s+/g, '+')}:wght@400;500;600;700`).join('&')}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [branding.fontFamily, branding.fontHeading]);

  const applyToElement = (element: 'heading' | 'body' | 'primary' | 'secondary' | 'accent') => {
    const styles: Record<string, React.CSSProperties> = {
      heading: {
        fontFamily: branding.fontHeading,
        color: branding.primaryColor,
      },
      body: {
        fontFamily: branding.fontFamily,
      },
      primary: {
        backgroundColor: branding.primaryColor,
        color: '#ffffff',
      },
      secondary: {
        backgroundColor: branding.secondaryColor,
        color: '#ffffff',
      },
      accent: {
        backgroundColor: branding.accentColor,
        color: '#ffffff',
      },
    };
    return styles[element] || {};
  };

  const getColorPalette = () => ({
    primary: branding.primaryColor,
    secondary: branding.secondaryColor,
    accent: branding.accentColor,
  });

  const getCompanyInfo = () => ({
    name: branding.companyName,
    tagline: branding.tagline,
    logo: branding.logoUrl,
  });

  // Expose brandSettings for components that need it
  const brandSettings = {
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    accentColor: branding.accentColor,
    logoUrl: branding.logoUrl,
    fontFamily: branding.fontFamily,
    fontHeading: branding.fontHeading,
    companyName: branding.companyName,
    tagline: branding.tagline,
  };

  return {
    branding,
    brandSettings,
    loading,
    applyToElement,
    getColorPalette,
    getCompanyInfo,
  };
}
