import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// *km 내 주차장
export const fetchNearbyParkingPlaces = createAsyncThunk(
    'parkingResults/fetchNearbyParkingPlaces',
    async ({latitude, longitude}, { getState, rejectWithValue }) => {
        try {
            const response = await fetch(`/api/find1kmInParking?lat=${latitude}&lon=${longitude}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const nearbyResults = await response.json();
            
            // 현재 검색 결과와 합치고 중복 제거
            const currentResults = getState().parkingResults.result;
            const combinedResults = [...currentResults, ...nearbyResults];
            return Array.from(new Map(
                combinedResults.map(item => [item.prkplceNo, item])
            ).values());
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }
    }
);

// 주차장 검색
export const fetchParkingPlaces = createAsyncThunk(
    'parkingResults/fetchParkingPlaces',
    async (keyword, { dispatch, rejectWithValue }) => {
        try {
            // 새로운 키워드 검색 시 결과 초기화
            dispatch(resetResults());
            
            const parkresponse = await fetch(`/api/search?parkplace=${keyword}`);
            if (!parkresponse.ok) {
                throw new Error(`HTTP error! status: ${parkresponse.status}`);
            }
            const searchResults = await parkresponse.json();
            
            return searchResults; // 새로운 검색 결과만 반환
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }
    }
);

const parkingResultsSlice = createSlice({
    name: 'parkingResults',
    initialState: {
        result: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetResults: (state) => {
            state.result = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNearbyParkingPlaces.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNearbyParkingPlaces.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
                state.error = null;
            })
            .addCase(fetchNearbyParkingPlaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchParkingPlaces.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchParkingPlaces.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
                state.error = null;
            })
            .addCase(fetchParkingPlaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { resetResults } = parkingResultsSlice.actions;
export default parkingResultsSlice.reducer;
