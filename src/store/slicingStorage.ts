import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Tipe data untuk item dalam storage
interface StorageItem {
    text: string;
    code: string;
}

// Tipe data untuk state Redux
interface StorageState {
    [key: string]: StorageItem;
}

// Helper function untuk mendapatkan data dari localStorage
const loadFromLocalStorage = (): StorageState => {
    try {
        const data = localStorage.getItem('slicingStorage');
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
};

// Helper function untuk menyimpan data ke localStorage
const saveToLocalStorage = (state: StorageState): void => {
    try {
        localStorage.setItem('slicingStorage', JSON.stringify(state));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
};

// Redux Slice
const slicingStorage = createSlice({
    name: 'slicingStorage',
    initialState: loadFromLocalStorage(),
    reducers: {
        // Update Text berdasarkan key
        updateTextByKey: (state, action: PayloadAction<{ key: string; text: string }>) => {
            const { key, text } = action.payload;
            if (!state[key]) {
                state[key] = { text, code: '' };
            } else {
                state[key].text = text;
            }
            saveToLocalStorage(state);
        },

        // Update Code berdasarkan key
        updateCodeByKey: (state, action: PayloadAction<{ key: string; code: string }>) => {
            const { key, code } = action.payload;
            if (!state[key]) {
                state[key] = { text: '', code };
            } else {
                state[key].code = code;
            }
            saveToLocalStorage(state);
        },

        // Hapus data berdasarkan key
        removeByKey: (state, action: PayloadAction<string>) => {
            delete state[action.payload];
            saveToLocalStorage(state);
        },

        // Hapus semua data
        clearStorage: () => {
            localStorage.removeItem('slicingStorage');
            return {};
        },
    }
});

// Ekspor actions dan reducer
export const { updateTextByKey, updateCodeByKey, removeByKey, clearStorage } = slicingStorage.actions;
export default slicingStorage.reducer;