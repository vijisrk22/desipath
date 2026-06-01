import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchLocalAds = createAsyncThunk('localAds/fetchLocalAds', async () => {
    const response = await api.get('/api/local-ads/feed');
    return response.data;
});

export const fetchMyLocalAds = createAsyncThunk('localAds/fetchMyLocalAds', async () => {
    const response = await api.get('/api/local-ads/mine');
    return response.data;
});

export const createLocalAd = createAsyncThunk('localAds/createLocalAd', async (adData) => {
    const response = await api.post('/api/local-ads', adData);
    return response.data;
});

export const updateLocalAd = createAsyncThunk('localAds/updateLocalAd', async ({ id, data }) => {
    const response = await api.put(`/api/local-ads/${id}`, data);
    return response.data;
});

export const deleteLocalAd = createAsyncThunk('localAds/deleteLocalAd', async (id) => {
    const response = await api.delete(`/api/local-ads/${id}`);
    return id;
});

export const updateLocalAdStatus = createAsyncThunk('localAds/updateLocalAdStatus', async ({ id, status, rejection_reason }) => {
    const response = await api.patch(`/api/admin/local-ads/${id}/status`, { status, rejection_reason });
    return response.data;
});

const localAdsSlice = createSlice({
    name: 'localAds',
    initialState: {
        ads: [],
        myAds: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLocalAds.pending, (state) => { state.loading = true; })
            .addCase(fetchLocalAds.fulfilled, (state, action) => {
                state.loading = false;
                state.ads = action.payload.data;
            })
            .addCase(fetchLocalAds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchMyLocalAds.fulfilled, (state, action) => {
                state.myAds = action.payload;
            })
            .addCase(deleteLocalAd.fulfilled, (state, action) => {
                state.myAds = state.myAds.filter(ad => ad.id !== action.payload);
            });
    },
});

export default localAdsSlice.reducer;
