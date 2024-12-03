import { configureStore } from '@reduxjs/toolkit';
import parkingResultsReducer from './parkingResultsSlice';
import locationSlice from "./locationSlice";
import locationDetailReducer from "./locationDetailSlice";

const store = configureStore({
    reducer: {
        location: locationSlice,
        parkingResults: parkingResultsReducer,
        locationDetail: locationDetailReducer
    },
});

export default store;
