import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import theme from './theme';
import Layout from './components/Shared/Layout';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import { loadDemoData } from './redux/moodSlice';

const DemoButton = () => {
  const dispatch = useDispatch();
  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
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
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/history" element={<StatsPage />} /> {/* De momento redirigimos a stats */}
          </Routes>
          <DemoButton />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;