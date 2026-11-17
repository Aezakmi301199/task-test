import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#5e3fc7' },
    background: { default: '#f5f4fb', paper: '#fff' },
    text: { primary: '#231b36', secondary: '#61576f' },
    divider: '#e8e2ef',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: { fontWeight: 760, letterSpacing: '-0.055em', lineHeight: 1.05 },
    h2: { fontSize: '1.125rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, #eae3ff, transparent 38rem)',
        },
        ':focus-visible, .Mui-focusVisible': {
          outline: '2px solid #5e3fc7',
          outlineOffset: '2px',
        },
      },
    },
  },
});
