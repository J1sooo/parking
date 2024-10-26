import { configureStore } from '@reduxjs/toolkit';
import parkingResultsReducer from './parkingResultsSlice';
import locationSlice from "./locationSlice";

const store = configureStore({
    reducer: {
        location: locationSlice,
        parkingResults: parkingResultsReducer
    },
});

export default store;
