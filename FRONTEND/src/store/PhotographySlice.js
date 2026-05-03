import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchPhotographers = createAsyncThunk(
  'photography/fetchPhotographers',
  async (params = {}) => {
    const response = await api.get('/api/photography/search', { params });
    return response.data.data;
  }
);

export const deletePhotographer = createAsyncThunk(
  'photography/deletePhotographer',
  async (id) => {
    await api.delete(`/api/photography/delete/${id}`);
    return id;
  }
);

export const updatePhotographer = createAsyncThunk(
  'photography/updatePhotographer',
  async ({ id, data }) => {
    const response = await api.post(`/api/photography/update/${id}`, data);
    return response.data.data;
  }
);

const photographySlice = createSlice({
  name: 'photography',
  initialState: {
    photographers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotographers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPhotographers.fulfilled, (state, action) => {
        state.loading = false;
        state.photographers = action.payload;
      })
      .addCase(fetchPhotographers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default photographySlice.reducer;
