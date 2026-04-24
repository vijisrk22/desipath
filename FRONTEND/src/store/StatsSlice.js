import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

let isFetchingInProgress = false;

export const fetchAdCounts = createAsyncThunk(
    'stats/fetchAdCounts',
    async (categories, { getState, rejectWithValue }) => {
        if (isFetchingInProgress) return rejectWithValue("Fetch already in progress");
        isFetchingInProgress = true;
        
        try {
            const results = await Promise.all(
                categories.filter(c => !c.comingSoon).map(async (cat) => {
                    try {
                        const response = await api.get(cat.countPath);
                        return { id: cat.id, count: response.data.count };
                    } catch (err) {
                        return { id: cat.id, count: 0 };
                    }
                })
            );

            const newCounts = {};
            results.forEach(res => {
                newCounts[res.id] = res.count;
            });
            isFetchingInProgress = false;
            return newCounts;
        } catch (error) {
            isFetchingInProgress = false;
            return rejectWithValue(error.message);
        }
    }
);

const statsSlice = createSlice({
    name: 'stats',
    initialState: {
        counts: {},
        loading: false,
        lastFetched: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdCounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdCounts.fulfilled, (state, action) => {
                state.loading = false;
                state.counts = action.payload;
                state.lastFetched = Date.now();
            })
            .addCase(fetchAdCounts.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default statsSlice.reducer;
