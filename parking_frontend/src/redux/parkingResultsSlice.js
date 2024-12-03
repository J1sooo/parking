import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// *km 내 주차장
export const NearbyParkingPlaces = createAsyncThunk(
    'parkingResults/NearbyParkingPlaces',
    async ({latitude, longitude}, { getState }) => {
        try {
            const nearbyResponse = await fetch(`/api/findKmInParking?lat=${latitude}&lon=${longitude}`);
            const nearbyResults = await nearbyResponse.json();
            
            // 현재 검색 결과와 합치고 중복 제거
            const currentResults = getState().parkingResults.result;
            const combinedResults = [...currentResults, ...nearbyResults];
            return Array.from(new Map(
                combinedResults.map(item => [item.prkplceNo, item])
            ).values());
        } catch (error) {
            console.error(error);
        }
    }
);

// 주차장 검색
export const fetchParkingPlaces = createAsyncThunk(
    'parkingResults/fetchParkingPlaces',
    async (keyword, { dispatch }) => {
        try {
            // 새로운 키워드 검색 시 결과 초기화
            dispatch(resetResults());
            
            const parkresponse = await fetch(`/api/search?parkplace=${keyword}`);
            const searchResults = await parkresponse.json();
            
            return searchResults;
        } catch (error) {
            console.error(error);
        }
    }
);

const parkingResultsSlice = createSlice({
    name: 'parkingResults',
    initialState: {
        result: [],
        loading: false,
    },
    reducers: {
        resetResults: (state) => {
            state.result = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(NearbyParkingPlaces.pending, (state) => {
                state.loading = true;
            })
            .addCase(NearbyParkingPlaces.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
            })
            .addCase(NearbyParkingPlaces.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(fetchParkingPlaces.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchParkingPlaces.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
            })
            .addCase(fetchParkingPlaces.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export const { resetResults } = parkingResultsSlice.actions;
export default parkingResultsSlice.reducer;
