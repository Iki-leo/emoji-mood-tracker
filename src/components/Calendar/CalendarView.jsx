import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Box, Typography, Alert, Snackbar } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import DayCell from './DayCell';
import MonthNavigator from './MonthNavigator';
import MoodSelector from '../MoodSelector/MoodSelector';
import NoteForm from '../Notes/NoteForm';
import { addMood } from '../../redux/moodSlice';

// Configurar dayjs en español
dayjs.locale('es');

const CalendarView = () => {
    const dispatch = useDispatch();
    const registros = useSelector((state) => state.moods.registros);
    
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showMoodSelector, setShowMoodSelector] = useState(false);
    const [selectedDayData, setSelectedDayData] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [monthStats, setMonthStats] = useState({ total: 0, happiness: 0 });

  // Calcular estadísticas del mes actual
    useEffect(() => {
    const monthMoods = registros.filter(r => 
        dayjs(r.fecha).month() === currentMonth.month() &&
        dayjs(r.fecha).year() === currentMonth.year()
    );
    
    const total = monthMoods.length;
    const happyCount = monthMoods.filter(r => r.emoji === '😊' || r.emoji === '🥰' || r.emoji === '🎉').length;
    const happinessPercentage = total > 0 ? Math.round((happyCount / total) * 100) : 0;
    
    setMonthStats({ total, happiness: happinessPercentage });
    }, [registros, currentMonth]);

  // Generar los días del mes
    const generateDaysInMonth = () => {
    const daysInMonth = currentMonth.daysInMonth();
    const firstDayOfMonth = currentMonth.startOf('month').day(); // 0 = Domingo (en USA, pero en español es lunes=1)
    
    // Ajustar para que la semana empiece en lunes (día 1)
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    
    // Cabecera de días de la semana
    const header = weekDays.map(day => (
        <Grid item xs={12/7} key={`header-${day}`}>
        <Typography align="center" fontWeight="bold" color="text.secondary">
            {day}
        </Typography>
        </Grid>
    ));
    
    // Días vacíos del principio
    for (let i = 0; i < startDay; i++) {
        days.push(
        <Grid item xs={12/7} key={`empty-start-${i}`}>
            <Box sx={{ height: '100px', opacity: 0.3 }} />
        </Grid>
        );
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = currentMonth.date(day).format('YYYY-MM-DD');
        const moodRecord = registros.find(r => r.fecha === dateStr);
        
        days.push(
        <Grid item xs={12/7} key={dateStr}>
            <DayCell 
            day={day} 
            date={dateStr}
            mood={moodRecord}
            onClick={() => {
                setSelectedDate(currentMonth.date(day));
                setSelectedDayData(moodRecord || { fecha: dateStr });
                setShowMoodSelector(true);
            }}
            />
        </Grid>
        );
    }
    
    // Completar la última semana si es necesario
    const totalCells = startDay + daysInMonth;
    const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;
    
    for (let i = 0; i < remainingCells; i++) {
        days.push(
        <Grid item xs={12/7} key={`empty-end-${i}`}>
            <Box sx={{ height: '100px', opacity: 0.3 }} />
        </Grid>
        );
    }
    
    return { header, days };
    };

    const handleMoodSelected = (mood) => {
    if (selectedDate) {
        const newRecord = {
        fecha: selectedDate.format('YYYY-MM-DD'),
        emoji: mood.emoji,
        nota: selectedDayData?.nota || '',
        };

        dispatch(addMood(newRecord));
        setShowMoodSelector(false);
        setShowSuccess(true);

      // Actualizar el día seleccionado
        setSelectedDayData(prev => ({
        ...prev,
        emoji: mood.emoji,
        }));
    }
    };

    const { header, days } = generateDaysInMonth();

    return (
    <Box sx={{ p: 3 }}>
      {/* Navegador de meses */}
        <MonthNavigator 
        currentMonth={currentMonth}
        onPrevMonth={() => setCurrentMonth(prev => prev.subtract(1, 'month'))}
        onNextMonth={() => setCurrentMonth(prev => prev.add(1, 'month'))}
        onToday={() => setCurrentMonth(dayjs())}
        />

      {/* Estadísticas rápidas del mes */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Grid container spacing={2}>
            <Grid item xs={6}>
            <Typography variant="body2">Días registrados:</Typography>
            <Typography variant="h6">{monthStats.total}</Typography>
            </Grid>
            <Grid item xs={6}>
            <Typography variant="body2">Índice de felicidad:</Typography>
            <Typography variant="h6">{monthStats.happiness}% 😊</Typography>
            </Grid>
        </Grid>
        </Paper>

      {/* Calendario */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
        <Grid container spacing={1}>
          {/* Cabecera de días */}
            {header}

          {/* Días del mes */}
            {days}
        </Grid>
        </Paper>

      {/* Selector de ánimo modal */}
        {showMoodSelector && (
        <MoodSelector 
            onSelectMood={handleMoodSelected}
            selectedDate={selectedDate?.format('DD/MM/YYYY')}
            onClose={() => setShowMoodSelector(false)}
        />
        )}

      {/* Formulario de nota */}
        {selectedDayData?.emoji && (
        <NoteForm 
            fecha={selectedDayData.fecha}
            initialNote={selectedDayData?.nota || ''}
            onNoteSaved={() => setShowSuccess(true)}
        />
        )}

      {/* Notificación de éxito */}
        <Snackbar 
        open={showSuccess} 
        autoHideDuration={2000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
        <Alert severity="success" variant="filled">
            ¡Estado de ánimo guardado! ✨
        </Alert>
        </Snackbar>
    </Box>
    );
};

export default CalendarView;