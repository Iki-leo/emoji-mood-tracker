import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Button, Box } from '@mui/material';  // AÑADIMOS TYPOGRAPHY AQUÍ
import { useDispatch } from 'react-redux';
import theme from './theme';
import Layout from './components/Shared/Layout';
import HomePage from './pages/HomePage';
import { loadDemoData } from './redux/moodSlice';

// Componente temporal para botón de demo
const DemoButton = () => {
  const dispatch = useDispatch();
  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
      <Button 
        variant="contained" 
        onClick={() => dispatch(loadDemoData())}
        sx={{ borderRadius: 28, px: 3 }}
      >
        Cargar Datos de Ejemplo
      </Button>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<Typography>Estadísticas</Typography>} />
            <Route path="/history" element={<Typography>Historial</Typography>} />
          </Routes>
          <DemoButton />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;