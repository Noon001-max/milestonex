import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme
        app: {
          background: '#F8FAFC',
          homeBackground: '#F1F5F9',
          zoneHairline: '#E2E8F0',
          surface: '#FFFFFF',
          'secondary-surface': '#F1F5F9',
          text: '#0F172A',
          'text-secondary': '#475569',
          border: '#E2E8F0',
          accent: '#4F46E5',
          'accent-hover': '#4338CA',
          success: '#10B981',
          error: '#EF4444',

          // Dark theme
          'background-dark': '#030712',
          'surface-dark': '#0B1329',
          'secondary-surface-dark': '#1E293B',
          'text-dark': '#F8FAFC',
          'text-secondary-dark': '#94A3B8',
          'border-dark': '#1E293B',
          'accent-dark': '#6366F1',
          'accent-hover-dark': '#818CF8',
          'success-dark': '#10B981',
          'error-dark': '#EF4444',
        },
      },
      backgroundColor: {
        app: {
          light: '#F8FAFC',
          home: '#F1F5F9',
          surface: '#FFFFFF',
          secondary: '#F1F5F9',
        },
        'app-dark': {
          light: '#030712',
          surface: '#0B1329',
          secondary: '#1E293B',
        },
      },
      textColor: {
        app: {
          primary: '#0F172A',
          secondary: '#475569',
        },
        'app-dark': {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
      },
      borderColor: {
        app: {
          light: '#E2E8F0',
          dark: '#1E293B',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
