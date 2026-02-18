import { createSlice } from '@reduxjs/toolkit';

// Función para cargar datos guardados
const loadFromLocalStorage = () => {
    try {
    const saved = localStorage.getItem('moodTracker');
    return saved ? JSON.parse(saved) : [];
    } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
    }
};

const initialState = {
    registros: loadFromLocalStorage(),
    loading: false,
    error: null,
};

export const moodSlice = createSlice({
    name: 'moods',
    initialState,
    reducers: {
    addMood: (state, action) => {
        const index = state.registros.findIndex(r => r.fecha === action.payload.fecha);
        if (index >= 0) {
        state.registros[index] = { ...state.registros[index], ...action.payload };
        } else {
        state.registros.push(action.payload);
        }
      // Guardar en localStorage
        localStorage.setItem('moodTracker', JSON.stringify(state.registros));
    },
    
    updateMood: (state, action) => {
        const index = state.registros.findIndex(r => r.fecha === action.payload.fecha);
        if (index >= 0) {
        state.registros[index] = { ...state.registros[index], ...action.payload };
        localStorage.setItem('moodTracker', JSON.stringify(state.registros));
        }
    },
    
    deleteMood: (state, action) => {
        state.registros = state.registros.filter(r => r.fecha !== action.payload);
        localStorage.setItem('moodTracker', JSON.stringify(state.registros));
    },
    
    // Para datos de demostración
    loadDemoData: (state) => {
        const today = new Date();
        const demoData = [];
        
      // Generar datos de los últimos 30 días
        for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const fechaStr = date.toISOString().split('T')[0];
        
        const emojis = ['😊', '😐', '😢', '😡', '🥰', '😴'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
            demoData.push({
            fecha: fechaStr,
            emoji: randomEmoji,
            nota: `Día de ejemplo ${i + 1}`,
            });
        }

        state.registros = demoData;
        localStorage.setItem('moodTracker', JSON.stringify(demoData));
        },
    },
});

export const { addMood, updateMood, deleteMood, loadDemoData } = moodSlice.actions;
export default moodSlice.reducer;