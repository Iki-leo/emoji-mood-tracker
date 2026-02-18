import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
    Paper, TextField, Button, Box, Typography, 
    Alert, Collapse, IconButton, Rating, Tooltip
} from '@mui/material';
import { 
    Close as CloseIcon,
    Save as SaveIcon,
    EmojiEmotions as EmojiIcon 
} from '@mui/icons-material';
import { updateMood } from '../../redux/moodSlice';

// Esquema de validación con Yup
const validationSchema = Yup.object({
    nota: Yup.string()
    .max(100, 'La nota es demasiado larga (máximo 100 caracteres)')
    .min(3, 'La nota debe tener al menos 3 caracteres')
    .required('La nota es obligatoria'),
    
    rating: Yup.number()
    .min(1, 'Valora tu día del 1 al 5')
    .max(5, 'Valora tu día del 1 al 5')
    .required('Valora cómo fue tu día'),
    
    tags: Yup.string()
    .matches(
        /^[a-zA-Z0-9,\s]*$/,
        'Solo letras, números y comas para separar'
    )
});

const NoteForm = ({ fecha, initialNote = '', initialRating = 3, onNoteSaved }) => {
    const dispatch = useDispatch();
    const [showSuccess, setShowSuccess] = useState(false);

    const formik = useFormik({
    initialValues: {
        nota: initialNote,
        rating: initialRating,
        tags: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      // Procesar tags (convertir string en array)
        const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
        
      // Guardar en Redux
        dispatch(updateMood({ 
        fecha, 
        nota: values.nota,
        rating: values.rating,
        tags: tagsArray
        }));

      // Mostrar mensaje de éxito
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        if (onNoteSaved) onNoteSaved();
        setSubmitting(false);
    },
    });

  // Consejos según la puntuación
    const getRatingAdvice = (rating) => {
    switch(rating) {
        case 1: return '💪 Ánimo, mañana será mejor';
        case 2: return '🌱 Pequeños pasos cuentan';
        case 3: return '✨ Un día normal también es bueno';
        case 4: return '🌟 ¡Qué bien! Sigue así';
        case 5: return '🎉 ¡Día perfecto! Comparte la alegría';
        default: return '';
    }
    };

    return (
    <Paper 
        elevation={3} 
        sx={{ 
        p: 3, 
        mt: 2, 
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e0e0e0'
        }}
    >
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmojiIcon color="primary" />
        Detalles del día {fecha}
        </Typography>

      {/* Mensaje de éxito animado */}
        <Collapse in={showSuccess}>
        <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            action={
            <IconButton size="small" onClick={() => setShowSuccess(false)}>
                <CloseIcon fontSize="inherit" />
            </IconButton>
            }
        >
            ¡Nota guardada correctamente! ✅
        </Alert>
        </Collapse>

        <form onSubmit={formik.handleSubmit}>
        {/* Rating con estrellas */}
        <Box sx={{ mb: 3 }}>
            <Typography component="legend" gutterBottom>
            ¿Cómo valoras tu día? ⭐
            </Typography>
            <Rating
            name="rating"
            value={formik.values.rating}
            onChange={(event, newValue) => {
                formik.setFieldValue('rating', newValue);
            }}
            size="large"
            sx={{ fontSize: '2rem' }}
            />
            {formik.values.rating > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {getRatingAdvice(formik.values.rating)}
            </Typography>
            )}
            {formik.touched.rating && formik.errors.rating && (
            <Typography color="error" variant="caption">
                {formik.errors.rating}
            </Typography>
            )}
        </Box>

        {/* Nota personal */}
        <TextField
            fullWidth
            id="nota"
            name="nota"
            label="📝 Nota personal"
            value={formik.values.nota}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nota && Boolean(formik.errors.nota)}
            helperText={formik.touched.nota && formik.errors.nota}
            multiline
            rows={3}
            variant="outlined"
            placeholder="¿Qué pasó hoy? Cuéntame los detalles..."
            sx={{ mb: 2 }}
        />

        {/* Tags (categorías) */}
        <TextField
            fullWidth
            id="tags"
            name="tags"
            label="🏷️ Tags (separados por comas)"
            value={formik.values.tags}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tags && Boolean(formik.errors.tags)}
            helperText={formik.touched.tags && formik.errors.tags}
            variant="outlined"
            placeholder="trabajo, familia, deporte, amigos..."
            sx={{ mb: 2 }}
        />

        {/* Botones */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Tooltip title="Descartar cambios">
            <span> {/* Wrapper necesario para Tooltip con elemento disabled */}
                <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => formik.resetForm()}
                disabled={!formik.dirty}
                >
                Cancelar
                </Button>
            </span>
            </Tooltip>

            <Tooltip title="Guardar nota">
            <span> {/* Wrapper necesario para Tooltip con elemento disabled */}
                <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
                startIcon={<SaveIcon />}
                >
                Guardar Nota
                </Button>
            </span>
            </Tooltip>
        </Box>

        {/* Contador de caracteres */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
            {formik.values.nota.length}/100 caracteres
        </Typography>
        </form>
    </Paper>
    );
};

export default NoteForm;