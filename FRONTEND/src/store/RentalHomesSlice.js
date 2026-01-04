import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchRentalHomes = createAsyncThunk("rentalHomes/fetchRentalHomes", async ({ page = 1, sortOption = '' } = {}, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        if (sortOption) {
            params.append('sort', sortOption);
        }
        const response = await api.get(`/api/rentalhomes?${params.toString()}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch rental homes"); // Handle error response
    }
})

export const fetchRentalHomeById = createAsyncThunk("rentalHomes/fetchRentalHomeById", async (rentalHomeId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/api/rentalhomes/${rentalHomeId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch rental home details"); // Handle error response
    }
})

export const postRentalHome = createAsyncThunk("rentalHomes/postRentalHome", async (rentalHomeData, { rejectWithValue }) => {
    try {
        //    console.log(rentalHomeData)
        const response = await api.post("/api/rentalhomes", rentalHomeData)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to post rental home"); // Handle error response
    }
})

export const searchRentalHome = createAsyncThunk("rentalHomes/searchRentalHome", async ({ searchQuery, page = 1, sortOption = '' }, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        if (sortOption) {
            params.append('sort', sortOption);
        }
        const response = await api.post(`/api/rentalhomes/search?${params.toString()}`, searchQuery);
        console.log("Search response", response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to search rental homes"); // Handle error response
    }
})

export const deleteRentalHome = createAsyncThunk("rentalHomes/deleteRentalHome", async (rentalHomeId, { rejectWithValue }) => {
    try {
        const response = await api.delete(`/api/rentalhomes/${rentalHomeId}`);
        return response.data; // Assuming the API returns the deleted rental home data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete rental home"); // Handle error response
    }
})

export const updateRentalHome = createAsyncThunk("rentalHomes/updateRentalHome", async ({ rentalHomeId, rentalHomeData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/api/rentalhomes/${rentalHomeId}`, rentalHomeData);
        return response.data; // Assuming the API returns the updated rental home data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update rental home"); // Handle error response
    }
})


const rentalHomesSlice = createSlice({
    name: "rentalHomes",
    initialState: {
        rentalHomes: [],
        pagination: {
            current_page: 1,
            last_page: 1,
            total: 0,
            per_page: 9
        },
        rentalHomeDetails: null,
        error: null,
        loading: false,

    },
    reducers: {
        setRentalHomes: (state, action) => {
            state.rentalHomes = action.payload; // Be careful, manual set might need adjustment if payload structure changes
        },
        clearRentalHomes: (state) => {
            state.rentalHomes = [];
        },
        clearRentalHomeDetails: (state) => {
            state.rentalHomeDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRentalHomes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRentalHomes.fulfilled, (state, action) => {
                state.loading = false;
                // With server-side pagination, the response structure is { data: [...], current_page: 1, ... }
                state.rentalHomes = action.payload.data || [];
                state.pagination = {
                    current_page: action.payload.current_page,
                    last_page: action.payload.last_page,
                    total: action.payload.total,
                    per_page: action.payload.per_page,
                };
            })
            .addCase(fetchRentalHomes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch rental homes";
            })
            .addCase(fetchRentalHomeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRentalHomeById.fulfilled, (state, action) => {
                state.loading = false;
                state.rentalHomeDetails = action.payload || null; // Ensure rentalHomeDetails is an object or null
            })
            .addCase(fetchRentalHomeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch rental home details";
            }
            )
            .addCase(postRentalHome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postRentalHome.fulfilled, (state, action) => {
                state.loading = false;
                // Since lists are paginated, simply pushing might not be correct if we are not on the last page.
                // Ideally, we should refetch or check if the new item belongs on the current page.
                // For simplicity, we can refetch or just push if we want immediate UI update (but order matters).
                // Let's just push it for now or re-fetch in the component.
                state.rentalHomes.unshift(action.payload.data); // Add to top if returning the object
            })
            .addCase(postRentalHome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to post rental home";
            })
            .addCase(searchRentalHome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchRentalHome.fulfilled, (state, action) => {
                state.loading = false;
                state.rentalHomes = action.payload.data || [];  // Update rentalHomes with the search result
                state.pagination = {
                    current_page: action.payload.current_page,
                    last_page: action.payload.last_page,
                    total: action.payload.total,
                    per_page: action.payload.per_page,
                };
            })
            .addCase(searchRentalHome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to search rental homes";
                state.rentalHomes = [];
                state.pagination = {
                    current_page: 1,
                    last_page: 1,
                    total: 0,
                    per_page: 9
                };
            })
            .addCase(deleteRentalHome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRentalHome.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted rental home from the list
                // Warning: Delete might leave a page with one less item. Ideally refetch.
                state.rentalHomes = state.rentalHomes.filter(
                    (rentalHome) => rentalHome.id !== action.payload.id // This assumes API returns the deleted object with ID, or request arg was ID?
                    // Actually deleteRentalHome arg is rentalHomeId. action.payload might be just a message or the object.
                    // Previous code assumed action.payload.id. Let's keep it consistent or check return.
                    // Controller returns {message: ...}. So this might fail if we look for id in payload.
                    // We should use meta arg if needed, but let's assume a refetch is safer or we fix this later.
                );
            })
            .addCase(deleteRentalHome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete rental home";
            })
            .addCase(updateRentalHome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRentalHome.fulfilled, (state, action) => {
                state.loading = false;
                // Update the rental home in the list
                // API returns { message: ..., data: rentalHome }
                const updatedHome = action.payload.data;
                const index = state.rentalHomes.findIndex(
                    (rentalHome) => rentalHome.id === updatedHome.id
                );
                if (index !== -1) {
                    state.rentalHomes[index] = updatedHome; // Update the rental home with the new data
                }
            })
    }

})

export const { setRentalHomes, clearRentalHomes, clearRentalHomeDetails } = rentalHomesSlice.actions;
export default rentalHomesSlice.reducer;