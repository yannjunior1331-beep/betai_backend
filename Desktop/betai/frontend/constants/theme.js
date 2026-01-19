// app/constants/theme.js
export const theme = {
  colors: {
    // Dark theme colors
    background: '#0F172A',
    cardBackground: '#1E293B',
    cardElevated: '#334155',
    
    // Text colors
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    
    // Accent colors for probabilities
    highProbability: '#22C55E', // Green
    mediumProbability: '#FBBF24', // Amber/Yellow
    lowProbability: '#EF4444', // Red
    neutralProbability: '#60A5FA', // Blue
    
    // Status colors
    liveStatus: '#DC2626',
    upcomingStatus: '#3B82F6',
    finishedStatus: '#8B5CF6',
    
    // UI elements
    border: '#334155',
    divider: '#475569',
    
    // Gradient/Highlight
    accent: '#00D4AA',
    accentLight: '#5EEAD4',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  
  typography: {
    small: {
      fontSize: 12,
      lineHeight: 16,
    },
    body: {
      fontSize: 14,
      lineHeight: 20,
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
    title: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '700',
    },
    header: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '800',
    },
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export default theme;