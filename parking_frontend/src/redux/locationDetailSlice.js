import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    detailLatitude: null,
    detailLongitude: null,
};

const locationDetailSlice = createSlice({
    name: 'locationDetail',
    initialState,
    reducers: {
        setDetailLocation: (state, action) => {
            state.detailLatitude = action.payload.latitude;
            state.detailLongitude = action.payload.longitude;
        },
        DetailLocation: (state) => {
            state.detailLatitude = null;
            state.detailLongitude = null;
        },
    },
});

export const { setDetailLocation, DetailLocation } = locationDetailSlice.actions;
export default locationDetailSlice.reducer;