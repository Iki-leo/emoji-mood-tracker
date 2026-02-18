import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
    Container, Grid, Paper, Typography, Box, 
    Chip, Avatar, Divider, Card, CardContent 
} from '@mui/material';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    LineChart, Line, CartesianGrid 
} from 'recharts';
import {
    SentimentSatisfiedAlt as HappyIcon,
    SentimentNeutral as NeutralIcon,
    SentimentVeryDissatisfied as SadIcon,
    TrendingUp as TrendingUpIcon,
    CalendarToday as CalendarIcon,
    Tag as TagIcon
} from '@mui/icons-material';

// Colores para los gráficos
const COLORS = {
    '😊': '#4caf50',
    '😐': '#ffc107',
    '😢': '#2196f3',
    '😡': '#f44336',
    '🥰': '#e91e63',
    '😴': '#9c27b0',
    '🤔': '#795548',
    '🎉': '#ff9800',
};

const StatsPage = () => {
    const registros = useSelector((state) => state.moods.registros);

  // Calcular estadísticas con useMemo para optimizar
    const stats = useMemo(() => {
    if (registros.length === 0) return null;

    // 1. Distribución de estados de ánimo
    const moodCounts = {};
    const moodRatings = {};
    
    registros.forEach(r => {
      // Contar emojis
        moodCounts[r.emoji] = (moodCounts[r.emoji] || 0) + 1;
        
      // Acumular ratings por emoji
        if (r.rating) {
        if (!moodRatings[r.emoji]) {
            moodRatings[r.emoji] = { sum: 0, count: 0 };
        }
        moodRatings[r.emoji].sum += r.rating;
        moodRatings[r.emoji].count += 1;
        }
    });

    // 2. Datos para gráfico de pastel
    const pieData = Object.entries(moodCounts).map(([emoji, count]) => ({
        name: emoji,
        value: count,
        label: `${emoji} ${count} días`
    }));

    // 3. Evolución temporal (últimos 30 días)
    const today = new Date();
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const registro = registros.find(r => r.fecha === dateStr);
        
        last30Days.push({
        fecha: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        rating: registro?.rating || 0,
        emoji: registro?.emoji || '❌',
        completo: registro ? 'Completo' : 'Vacío'
        });
    }

    // 4. Tags más usados
    const tagCounts = {};
    registros.forEach(r => {
        if (r.tags && Array.isArray(r.tags)) {
        r.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
        }
    });

    const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

    // 5. Estadísticas generales
    const totalDias = registros.length;
    const diasConNota = registros.filter(r => r.nota && r.nota.length > 0).length;
    const ratingPromedio = registros.reduce((acc, r) => acc + (r.rating || 0), 0) / totalDias;
    
    // Emoji más frecuente
    const emojiMasFrecuente = Object.entries(moodCounts)
        .sort((a, b) => b[1] - a[1])[0];

    return {
        pieData,
        last30Days,
        topTags,
        totalDias,
        diasConNota,
        ratingPromedio: ratingPromedio.toFixed(1),
        emojiMasFrecuente: emojiMasFrecuente ? emojiMasFrecuente[0] : '😊',
        moodCounts
    };
    }, [registros]);

    if (!stats) {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
            📊 Estadísticas
        </Typography>
        <Paper sx={{ p: 4 }}>
            <Typography variant="h6" color="text.secondary">
            No hay datos suficientes para mostrar estadísticas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Registra algunos días en el calendario para ver tus estadísticas
            </Typography>
        </Paper>
        </Container>
    );
    }

    return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'light' }}>
        📊 Tus Estadísticas Emocionales
        </Typography>

      {/* Tarjetas de resumen */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 3 }}>
            <Card elevation={3}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="primary" />
                <Typography variant="h6">Total días</Typography>
                </Box>
                <Typography variant="h3" sx={{ mt: 2 }}>
                {stats.totalDias}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                días registrados
                </Typography>
            </CardContent>
            </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
            <Card elevation={3}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="success" />
                <Typography variant="h6">Rating medio</Typography>
                </Box>
                <Typography variant="h3" sx={{ mt: 2 }}>
                {stats.ratingPromedio} ⭐
                </Typography>
                <Typography variant="body2" color="text.secondary">
                sobre 5 estrellas
                </Typography>
            </CardContent>
            </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
            <Card elevation={3}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HappyIcon color="warning" />
                <Typography variant="h6">Más frecuente</Typography>
                </Box>
                <Typography variant="h3" sx={{ mt: 2 }}>
                {stats.emojiMasFrecuente}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {stats.moodCounts[stats.emojiMasFrecuente]} días
                </Typography>
            </CardContent>
            </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
            <Card elevation={3}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TagIcon color="info" />
                <Typography variant="h6">Con notas</Typography>
                </Box>
                <Typography variant="h3" sx={{ mt: 2 }}>
                {stats.diasConNota}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                días con notas
                </Typography>
            </CardContent>
            </Card>
        </Grid>
        </Grid>

      {/* Gráficos */}
        <Grid container spacing={3}>
        {/* Gráfico de pastel - Distribución de ánimos */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
                Distribución de Estados de Ánimo
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#999'} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            </Paper>
        </Grid>

        {/* Gráfico de barras - Frecuencia por estado */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
                Frecuencia por Estado
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={stats.pieData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                    {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#999'} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </Paper>
        </Grid>

        {/* Evolución temporal */}
        <Grid size={{ xs: 12 }}>
            <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
                Evolución Últimos 30 Días
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={stats.last30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                    content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                        <Paper sx={{ p: 1 }}>
                            <Typography variant="body2">Fecha: {data.fecha}</Typography>
                            <Typography variant="body2">Rating: {data.rating} ⭐</Typography>
                            <Typography variant="body2">Ánimo: {data.emoji}</Typography>
                        </Paper>
                        );
                    }
                    return null;
                    }}
                />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Valoración del día"
                />
                </LineChart>
            </ResponsiveContainer>
            </Paper>
        </Grid>

        {/* Tags populares */}
        {stats.topTags.length > 0 && (
            <Grid size={{ xs: 12 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                🏷️ Tags más usados
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {stats.topTags.map(({ tag, count }) => (
                    <Chip
                    key={tag}
                    label={`${tag} (${count})`}
                    color="primary"
                    variant="outlined"
                    avatar={<Avatar>{count}</Avatar>}
                    sx={{ fontSize: '1rem', py: 2 }}
                    />
                ))}
                </Box>
            </Paper>
            </Grid>
        )}
        </Grid>
    </Container>
    );
};

export default StatsPage;