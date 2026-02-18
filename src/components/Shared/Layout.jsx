import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
    <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        pb: 4 
    }}>
        <Navbar />
        <Container maxWidth="lg">
        {children}
        </Container>
    </Box>
    );
};

export default Layout;