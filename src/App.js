import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch } from 'react-redux';
import { Button, Box, Typography } from '@mui/material';
import theme from './theme';
import Layout from './components/Shared/Layout';
import { loadDemoData } from './redux/moodSlice';

// Componente temporal para probar
const HomeTemp = () => {
  const dispatch = useDispatch();
  
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        ¡Emoji Mood Tracker funcionando! 🎉
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => dispatch(loadDemoData())}
        sx={{ mt: 2 }}
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
            <Route path="/" element={<HomeTemp />} />
            <Route path="/stats" element={<Typography>Estadísticas</Typography>} />
            <Route path="/history" element={<Typography>Historial</Typography>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;