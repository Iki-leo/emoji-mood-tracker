import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarView from '../components/Calendar/CalendarView';

const HomePage = () => {
    return (
    <Box>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'light' }}>
        ¿Cómo te sientes hoy?
        </Typography>
        <CalendarView />
    </Box>
    );
};

export default HomePage;