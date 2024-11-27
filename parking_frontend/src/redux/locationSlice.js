import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    latitude: 33.450701,
    longitude: 126.570667,
    loading: false,
    error: null,
    source: 'default'
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.source = action.payload.source;
            state.status = 'succeeded';
        },
        setLocationError: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        setLoading: (state) => {
            state.status = 'loading';
        },
    },
});

export const {
    setLocation,
    setLocationError,
    setLoading,
} = locationSlice.actions;

export default locationSlice.reducer;
