export type ColorPalette = {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryContrast: string;
  error: string;
  offlineBanner: string;
  offlineBannerText: string;
};

export const lightColors: ColorPalette = {
  background: '#F4F5F7',
  surface: '#FFFFFF',
  text: '#1A1C1E',
  textMuted: '#5C6370',
  border: '#E1E4E8',
  primary: '#2563EB',
  primaryContrast: '#FFFFFF',
  error: '#B91C1C',
  offlineBanner: '#FEF3C7',
  offlineBannerText: '#78350F',
};

export const darkColors: ColorPalette = {
  background: '#0F1115',
  surface: '#1A1D23',
  text: '#F2F4F8',
  textMuted: '#A7AEC0',
  border: '#2A2F3A',
  primary: '#60A5FA',
  primaryContrast: '#0B1220',
  error: '#FCA5A5',
  offlineBanner: '#422006',
  offlineBannerText: '#FDE68A',
};
