import { createTheme } from '@mui/material/styles';

// Futuristic Black/White/Gray Design System
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      light: '#F5F5F5',
      dark: '#E0E0E0',
      contrastText: '#000000',
    },
    secondary: {
      main: '#1A1A1A',
      light: '#2D2D2D',
      dark: '#0D0D0D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#000000',
      paper: '#0A0A0A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.4)',
    },
    error: {
      main: '#FF4757',
    },
    success: {
      main: '#2ED573',
    },
    warning: {
      main: '#FFA502',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: '"SF Pro Display", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '12px 28px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFFFFF',
            },
          },
        },
      },
    },
  },
});

// CSS Variables for global use
export const cssVariables = `
  :root {
    /* Colors */
    --color-black: #000000;
    --color-white: #FFFFFF;
    --color-gray-50: #FAFAFA;
    --color-gray-100: #F5F5F5;
    --color-gray-200: #E5E5E5;
    --color-gray-300: #D4D4D4;
    --color-gray-400: #A3A3A3;
    --color-gray-500: #737373;
    --color-gray-600: #525252;
    --color-gray-700: #404040;
    --color-gray-800: #262626;
    --color-gray-900: #171717;
    --color-gray-950: #0A0A0A;
    
    /* Accent (subtle) */
    --color-accent: #3B82F6;
    --color-success: #22C55E;
    --color-warning: #F59E0B;
    --color-error: #EF4444;
    
    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-20: 5rem;
    
    /* Border Radius */
    --radius-sm: 6px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-2xl: 32px;
    --radius-full: 9999px;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
    --shadow-glow: 0 0 40px rgba(255, 255, 255, 0.1);
    
    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
    --transition-slow: 500ms ease;
    
    /* Fonts */
    --font-sans: "SF Pro Display", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --font-mono: "SF Mono", "Fira Code", monospace;
  }
`;

