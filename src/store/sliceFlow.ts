import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RuntimeFlow } from '../context/storeLogging';

const sliceFlow = createSlice({
    name: 'sliceFlow',
    initialState: {
        logging: [] as any[],
        runTime: RuntimeFlow.iddle,
        result: {}
    },
    reducers: {
        setResult(state, action: any) {
            state.result = action.payload
        },

        startProcess(state) {
            state.runTime = RuntimeFlow.running
            state.logging = [];
            state.result = {};
        },

        setRunTime(state, action: PayloadAction<RuntimeFlow>) {
            state.runTime = action.payload
        },

        setLogging(state, action: PayloadAction<any[]>) {
            state.logging = action.payload
        },
    }
});

export const { setResult, startProcess, setRunTime, setLogging } = sliceFlow.actions;
export default sliceFlow.reducer;