import React, { useState } from 'react';
import { Paper, Box, Typography, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { MoreVert as MoreIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { deleteMood } from '../../redux/moodSlice';

// Mapa de colores para cada emoji (igual que antes)
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
    
    '&:hover': {
    transform: 'scale(1.05) translateY(-5px)',
    boxShadow: theme.shadows[8],
    '& .menu-button': {
        opacity: 1,
    },
    },
}));

const DayCell = ({ day, date, mood, onClick }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    
    const hasMood = mood && mood.emoji;
    const moodColor = hasMood ? MOOD_COLORS[mood.emoji] : '#f0f0f0';

    const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
    };

    const handleEdit = (event) => {
    handleMenuClose(event);
    onClick(); // Abre el selector de ánimo
    };

    const handleDeleteClick = (event) => {
    handleMenuClose(event);
    setOpenDialog(true);
    };

    const handleDeleteConfirm = () => {
    dispatch(deleteMood(date));
    setOpenDialog(false);
    };

    const handleDeleteCancel = () => {
    setOpenDialog(false);
    };

    return (
    <>
        <StyledDayCell
        elevation={hasMood ? 3 : 1}
        moodcolor={moodColor}
        hasmood={hasMood}
        onClick={onClick}
        data-testid={`day-${day}`}
        >
        {/* Menú de opciones (solo si hay mood) */}
        {hasMood && (
            <>
            <IconButton
                className="menu-button"
                size="small"
                onClick={handleMenuClick}
                sx={{
                position: 'absolute',
                top: 2,
                right: 2,
                opacity: 0,
                transition: 'opacity 0.2s',
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.2)',
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                },
                }}
            >
                <MoreIcon fontSize="small" />
            </IconButton>
            
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
            >
                <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Editar
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Eliminar
                </MenuItem>
            </Menu>
            </>
        )}

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

      {/* Diálogo de confirmación para eliminar */}
        <Dialog
        open={openDialog}
        onClose={handleDeleteCancel}
        onClick={(e) => e.stopPropagation()}
        >
        <DialogTitle>¿Eliminar registro?</DialogTitle>
        <DialogContent>
            <DialogContentText>
            ¿Estás seguro de que quieres eliminar el registro del día {day}?
            Esta acción no se puede deshacer.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
            </Button>
        </DialogActions>
        </Dialog>
    </>
    );    
};

DayCell.defaultProps = {
    mood: null,
};

export default DayCell;