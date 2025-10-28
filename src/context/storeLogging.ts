import { PayloadAction } from "@reduxjs/toolkit";
import buildingStore from "../System/Lib/Widgets";
export enum RuntimeFlow {
    iddle,
    running,
    stop,
    error,
}

export default buildingStore(
    'logging',
    {
        logging: [] as any[],
        runTime: RuntimeFlow.iddle,
        result: {},
        running: false,
    },
    {
        setRunning(state, action: PayloadAction<boolean>) {
            state.running = action.payload
        },

        setResult(state, action: any) {
            state.result = action.payload
        },

        startProcess(state) {
            state.runTime = RuntimeFlow.running
            state.logging = [];
            state.result = {};
        },

        stopProcess(state) {
            state.runTime = RuntimeFlow.stop
        },

        setRunTime(state, action: PayloadAction<RuntimeFlow>) {
            state.runTime = action.payload
        },

        setLogging(state, action: PayloadAction<any[]>) {
            state.logging = action.payload
        },
        
    },
    _ => {
    },
    getState => ({
        getLogging: () => getState().logging,
    })
)