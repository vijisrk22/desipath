import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const deleteKidsClass = createAsyncThunk(
    'kidsClass/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/api/kids-classes/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateKidsClass = createAsyncThunk(
    'kidsClass/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/kids-classes/${id}`, data);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const kidsClassSlice = createSlice({
    name: 'kidsClass',
    initialState: {
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteKidsClass.pending, (state) => { state.loading = true; })
            .addCase(deleteKidsClass.fulfilled, (state) => { state.loading = false; })
            .addCase(deleteKidsClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default kidsClassSlice.reducer;
