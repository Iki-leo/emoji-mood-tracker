import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Tooltip, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';

// Definimos los estados de ánimo con colores vibrantes
const MOODS = [
    { emoji: '😊', label: 'Feliz', color: '#4caf50', value: 'happy', description: '¡Qué bien!' },
    { emoji: '😐', label: 'Neutral', color: '#ffc107', value: 'neutral', description: 'Normalito' },
    { emoji: '😢', label: 'Triste', color: '#2196f3', value: 'sad', description: 'Día difícil' },
    { emoji: '😡', label: 'Enfadado', color: '#f44336', value: 'angry', description: 'De malas' },
    { emoji: '🥰', label: 'Enamorado', color: '#e91e63', value: 'love', description: '❤️' },
    { emoji: '😴', label: 'Cansado', color: '#9c27b0', value: 'tired', description: 'A dormir' },
    { emoji: '🤔', label: 'Pensativo', color: '#795548', value: 'thinking', description: 'Reflexionando' },
    { emoji: '🎉', label: 'Celebración', color: '#ff9800', value: 'celebration', description: 'Fiesta!' },
];

// Botón animado personalizado
const AnimatedMoodButton = styled(IconButton)(({ theme, moodcolor }) => ({
    fontSize: '3rem',
    padding: theme.spacing(2),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
    transform: 'scale(1.2) rotate(5deg)',
    backgroundColor: `${moodcolor}20`,
    },
    '&:active': {
    transform: 'scale(0.95)',
    },
}));

const MoodSelector = ({ onSelectMood, selectedDate, onClose }) => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [showDescription, setShowDescription] = useState(false);

    const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    setShowDescription(true);
    
    // Pequeña animación antes de seleccionar
    setTimeout(() => {
        onSelectMood(mood);
        setShowDescription(false);
    }, 500);
    };

    return (
    <Fade in={true} timeout={500}>
        <Paper 
        elevation={8} 
        sx={{ 
            p: 4, 
            mt: 2, 
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}
        >
        {/* Decoración de fondo */}
        <Box
            sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 0, 0.1)',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 0.5 },
                '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                '100%': { transform: 'scale(1)', opacity: 0.5 },
            },
            }}
        />

        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            {selectedDate 
            ? `¿Cómo te sientes el ${selectedDate}?` 
            : '¿Cómo te sientes hoy?'}
        </Typography>

        {showDescription && selectedMood && (
            <Fade in={showDescription}>
            <Typography 
                variant="h6" 
                align="center" 
                sx={{ 
                color: selectedMood.color,
                mb: 2,
                animation: 'bounce 0.5s',
                '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
                }}
            >
                {selectedMood.description}
            </Typography>
            </Fade>
        )}

        <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: 2,
            mt: 3 
        }}>
            {MOODS.map((mood) => (
            <Tooltip key={mood.value} title={mood.label} arrow>
                <Box sx={{ textAlign: 'center' }}>
                <AnimatedMoodButton
                    onClick={() => handleMoodClick(mood)}
                    moodcolor={mood.color}
                    sx={{
                    bgcolor: selectedMood?.value === mood.value 
                        ? `${mood.color}30` 
                        : 'transparent',
                    border: selectedMood?.value === mood.value 
                        ? `3px solid ${mood.color}` 
                        : 'none',
                    }}
                >
                    {mood.emoji}
                </AnimatedMoodButton>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {mood.label}
                </Typography>
                </Box>
            </Tooltip>
            ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <IconButton onClick={onClose} size="small">
            <Typography variant="body2">Cerrar ✕</Typography>
            </IconButton>
        </Box>
        </Paper>
    </Fade>
    );
};

export default MoodSelector;