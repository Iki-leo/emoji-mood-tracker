import React from 'react';
import { Paper, Box, Typography, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';

// Mapa de colores para cada emoji
const MOOD_COLORS = {
    '😊': '#4caf50',
    '😐': '#ffc107',
    '😢': '#2196f3',
    '😡': '#f44336',
    '🥰': '#e91e63',
    '😴': '#9c27b0',
    '🤔': '#795548',
    '🎉': '#ff9800',
};

// Celda con efectos hover
const StyledDayCell = styled(Paper)(({ theme, moodcolor, hasmood }) => ({
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: hasmood ? moodcolor : '#ffffff',
    color: hasmood ? 'white' : 'inherit',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.spacing(1.5),
    
    '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s',
    },

    '&:hover': {
    transform: 'scale(1.05) translateY(-5px)',
    boxShadow: theme.shadows[8],
    '&::before': {
        opacity: 1,
    },
    '& .day-number': {
        transform: 'scale(1.2)',
    },
    },

    '&:active': {
    transform: 'scale(0.98)',
    },
}));

const DayCell = ({ day, date, mood, onClick }) => {
    const hasMood = mood && mood.emoji;
    const moodColor = hasMood ? MOOD_COLORS[mood.emoji] : '#f0f0f0';

    return (
    <Zoom in={true} style={{ transitionDelay: `${day * 10}ms` }}>
        <StyledDayCell
        elevation={hasMood ? 3 : 1}
        moodcolor={moodColor}
        hasmood={hasMood}
        onClick={onClick}
        data-testid={`day-${day}`}
        >
        <Typography 
            variant="h6" 
            className="day-number"
            sx={{ 
            fontWeight: 'bold',
            transition: 'transform 0.2s',
            textShadow: hasMood ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
            }}
        >
            {day}
        </Typography>
        
        {hasMood && (
            <Zoom in={true} timeout={300}>
            <Box sx={{ 
                fontSize: '2rem',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-5px)' },
                },
            }}>
                {mood.emoji}
            </Box>
            </Zoom>
        )}
        
        {mood?.nota && (
            <Typography 
            variant="caption" 
            sx={{ 
                position: 'absolute',
                bottom: 2,
                left: 4,
                right: 4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.6rem',
                color: hasMood ? 'rgba(255,255,255,0.9)' : 'text.secondary',
            }}
            >
            {mood.nota}
            </Typography>
        )}
        </StyledDayCell>
    </Zoom>
    );
};

// PropTypes con valores por defecto
DayCell.defaultProps = {
    mood: null,
};

export default DayCell;