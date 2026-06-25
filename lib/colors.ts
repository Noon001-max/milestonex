/**
 * Application Color System
 * Exported as CSS color values for use in components and Tailwind classes
 */

export const colors = {
  // Light Theme
  background: '#F8FAFC',
  homeBackground: '#F1F5F9',
  zoneHairline: '#E2E8F0',
  surface: '#FFFFFF',
  secondarySurface: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  border: '#E2E8F0',
  accent: '#4F46E5',
  accentHover: '#4338CA',
  success: '#10B981',
  error: '#EF4444',

  // Dark Theme
  backgroundDark: '#030712',
  surfaceDark: '#0B1329',
  secondarySurfaceDark: '#1E293B',
  textDark: '#F8FAFC',
  textSecondaryDark: '#94A3B8',
  borderDark: '#1E293B',
  accentDark: '#6366F1',
  accentHoverDark: '#818CF8',
  successDark: '#10B981',
  errorDark: '#EF4444',
} as const;

/**
 * Utility to get theme-aware color
 */
export function getColor(colorName: keyof typeof colors, isDark?: boolean): string {
  const key = isDark && colorName in colors ? (colorName + 'Dark' as keyof typeof colors) : colorName;
  return colors[key];
}
