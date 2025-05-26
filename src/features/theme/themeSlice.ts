import { createSlice } from '@reduxjs/toolkit';
import type { ThemeState, ThemeMode } from '../../types';

// Get initial theme from localStorage or system preference
const getInitialTheme = (): ThemeMode => {
  try {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
  }
  // Default to light theme
  return 'dark';
};

// Initial state
const initialState: ThemeState = {
  mode: getInitialTheme(),
};

// Theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';

      // Save to localStorage
      try {
        localStorage.setItem('theme', state.mode);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }

      // Update document class for CSS
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
    setTheme: (state, action) => {
      const newTheme = action.payload as ThemeMode;
      state.mode = newTheme;

      // Save to localStorage
      try {
        localStorage.setItem('theme', newTheme);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }

      // Update document class for CSS
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    },
    initializeTheme: (state) => {
      // Apply theme to document on initialization
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
  },
});

export const { toggleTheme, setTheme, initializeTheme } = themeSlice.actions;

export default themeSlice.reducer;
