import { configureStore } from '@reduxjs/toolkit';
import moodReducer from './moodSlice';

export const store = configureStore({
    reducer: {
    moods: moodReducer,
    },
});