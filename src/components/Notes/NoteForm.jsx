import React from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Paper, TextField, Button, Box, Typography } from '@mui/material';
import { updateMood } from '../../redux/moodSlice';

const NoteForm = ({ fecha, initialNote, onNoteSaved }) => {
    const dispatch = useDispatch();

    const formik = useFormik({
    initialValues: {
        nota: initialNote || '',
    },
    validationSchema: Yup.object({
        nota: Yup.string()
        .max(50, 'La nota no puede tener más de 50 caracteres')
        .min(0, ''),
    }),
    onSubmit: (values, { resetForm }) => {
        dispatch(updateMood({ fecha, nota: values.nota }));
        if (onNoteSaved) onNoteSaved();
      resetForm({ values: { nota: values.nota } }); // Mantener el valor pero resetear el estado "dirty"
    },
    });

    return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
        📝 Nota personal
        </Typography>
        <form onSubmit={formik.handleSubmit}>
        <TextField
            fullWidth
            id="nota"
            name="nota"
            label="¿Qué pasó hoy?"
            value={formik.values.nota}
            onChange={formik.handleChange}
            error={formik.touched.nota && Boolean(formik.errors.nota)}
            helperText={formik.touched.nota && formik.errors.nota}
            multiline
            rows={3}
            variant="outlined"
            placeholder="Escribe una nota sobre tu día..."
            sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!formik.dirty}
            >
            Guardar Nota
            </Button>
        </Box>
        </form>
    </Paper>
    );
};

export default NoteForm;