import { createSlice } from '@reduxjs/toolkit';
import { lightTheme, darkTheme } from '../assets/themes';
import { ThemeType } from '../assets/themes/themeTypes';

interface ThemeState {
    theme: 'light' | 'dark';
    colors: ThemeType;
}

const initialState: ThemeState = {
    // theme: 'light',
    // colors: lightTheme
    theme: 'dark',
    colors: darkTheme
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            if (state.theme === 'light') {
                state.theme = 'dark';
                state.colors = darkTheme;
            } else {
                state.theme = 'light';
                state.colors = lightTheme;
            }
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            state.colors = action.payload === 'light' ? lightTheme : darkTheme;
        }
    }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;