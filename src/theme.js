import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0f3c78'
    },
    secondary: {
      main: '#f4b000'
    },
    background: {
      default: '#050914',
      paper: 'rgba(255,255,255,0.04)'
    },
    text: {
      primary: '#e9ecf7',
      secondary: '#c8d4f4'
    }
  },
  shape: {
    borderRadius: 14
  },
  typography: {
    fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
    h3: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    subtitle1: { letterSpacing: 0.2 }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          background: 'radial-gradient(circle at 20% 20%, #0e1a35, #050914 55%, #03060f)'
        },
        '#root': {
          minHeight: '100vh'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.45)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.07)',
          backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          boxShadow: '0 16px 48px rgba(0,0,0,0.35)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700
        }
      }
    }
  }
});

export default theme;
