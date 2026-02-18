import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';  // ELIMINAMOS IconButton
import { 
    Home as HomeIcon, 
    Timeline as StatsIcon, 
    History as HistoryIcon,
    SentimentSatisfiedAlt as MoodIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const navigate = useNavigate();
    const registros = useSelector((state) => state.moods.registros);
    
  // Contar registros del mes actual
    const today = new Date();
    const registrosEsteMes = registros.filter(r => {
    const fecha = new Date(r.fecha);
    return fecha.getMonth() === today.getMonth() && 
            fecha.getFullYear() === today.getFullYear();
    }).length;

    return (
    <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
        <MoodIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Emoji Mood Tracker
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Badge badgeContent={registrosEsteMes} color="secondary">
            <Button 
                color="inherit" 
                onClick={() => navigate('/')}
                startIcon={<HomeIcon />}
            >
                Calendario
            </Button>
            </Badge>

            <Button 
            color="inherit" 
            onClick={() => navigate('/stats')}
            startIcon={<StatsIcon />}
            >
            Estadísticas
            </Button>

            <Button 
            color="inherit" 
            onClick={() => navigate('/history')}
            startIcon={<HistoryIcon />}
            >
            Historial
            </Button>
        </Box>
        </Toolbar>
    </AppBar>
    );
};

export default Navbar;