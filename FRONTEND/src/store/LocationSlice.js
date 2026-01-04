import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api"; // Assuming api instance exists

export const fetchLocations = createAsyncThunk(
    "location/fetchLocations",
    async (query, { rejectWithValue }) => {
        try {
            const response = await api.get(`/location/locations?filter=${query}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch locations");
        }
    }
);

export const reverseGeocode = createAsyncThunk(
    "location/reverseGeocode",
    async ({ lat, lng }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/location/reverse?lat=${lat}&lng=${lng}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to reverse geocode");
        }
    }
);

const locationSlice = createSlice({
    name: "location",
    initialState: {
        locations: [],
        currentLocation: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearLocations: (state) => {
            state.locations = [];
        },
        setCurrentLocation: (state, action) => {
            state.currentLocation = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLocations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLocations.fulfilled, (state, action) => {
                state.loading = false;
                state.locations = action.payload;
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(reverseGeocode.pending, (state) => {
                state.loading = true; // Optional: separate loading state for geocoding
            })
            .addCase(reverseGeocode.fulfilled, (state, action) => {
                state.loading = false;
                state.currentLocation = action.payload;
            })
            .addCase(reverseGeocode.rejected, (state, action) => {
                state.loading = false;
                // Don't necessarily error out loudly for geocode failure, just ignore or log
                // state.error = action.payload; 
            });
    },
});

export const { clearLocations, setCurrentLocation } = locationSlice.actions;
export default locationSlice.reducer;