import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
    primary: {
        main: '#1976d2',
    },
    secondary: {
        main: '#dc004e',
    },
    mood: {
        happy: '#4caf50',
        neutral: '#ffc107',
        sad: '#2196f3',
        angry: '#f44336',
        love: '#e91e63',
        tired: '#9c27b0',
    },
    },
    typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
        fontWeight: 600,
    },
    },
    components: {
    MuiPaper: {
        defaultProps: {
        elevation: 2,
        },
        styleOverrides: {
        root: {
            borderRadius: 12,
        },
        },
    },
    },
});

export default theme;