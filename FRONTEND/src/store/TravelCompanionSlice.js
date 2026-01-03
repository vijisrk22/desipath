import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchTravelCompanions = createAsyncThunk(
    "travelCompanions/fetchTravelCompanions",
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.get("/api/travelCompanions/companion");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch travel companions");
        }
    }
);

export const postTravelCompanion = createAsyncThunk("travelCompanions/postTravelCompanion", async (travelCompanionData, {rejectWithValue}) => {
    try {
        const response = await api.post("/api/travelcompanions", travelCompanionData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to post travel companion");
    }
});

export const fetchTravelers = createAsyncThunk(
    "travelCompanions/fetchTravelers",
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.get("/api/travelcompanions/traveler");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch travelers");
        }
    }
);  

export const postTraveler = createAsyncThunk("travelCompanions/postTraveler", async (travelerData, {rejectWithValue}) => {
    try {
        const response = await api.post("/api/travelcompanions/traveler", travelerData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to post traveler");
    }
});

export const fetchFindCompanionLocation = createAsyncThunk("travelCompanions/findcomplocation", async (_, {rejectWithValue}) => {
    try {
        const response = await api.post("/api/travelcompanions/findcomplocation");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch Find Companion Location");
    }
});


const travelCompanionsSlice = createSlice({ 
    name: "travelCompanion",
    initialState: {
        travelCompanions: [],
        travelers: [],
        error: null,
        loading: false,
    },
    reducers: {
        setTravelCompanions: (state, action) => {
            state.travelCompanions = action.payload;
        },
        clearTravelCompanions: (state) => {
            state.travelCompanions = [];
        },
        setTravelers: (state, action) => {
            state.travelers = action.payload;
        },
        clearTravelers: (state) => {
            state.travelers = [];
        },
    },  
    extraReducers: (builder)=>{
        builder 
            .addCase(fetchTravelCompanions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTravelCompanions.fulfilled, (state, action) => {
                state.loading = false;
                state.travelCompanions = action.payload.travelCompanions || [];
            })      
            .addCase(fetchTravelCompanions.rejected, (state, action) => {   
                state.loading = false;
                state.error = action.payload || "Failed to fetch travel companions";
            })
            .addCase(postTravelCompanion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })  
            .addCase(postTravelCompanion.fulfilled, (state, action) => {            
                state.loading = false;
                state.travelCompanions.push(action.payload.travelCompanions);
            })          
            .addCase(postTravelCompanion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to post travel companion";
            })
            .addCase(fetchTravelers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTravelers.fulfilled, (state, action) => {
                state.loading = false;
                state.travelers = action.payload.travelers || [];
            })      
            .addCase(fetchTravelers.rejected, (state, action) => {   
                state.loading = false;
                state.error = action.payload || "Failed to fetch travelers";
            })
            .addCase(postTraveler.pending, (state) => {
                state.loading = true;
                state.error = null;
            })  
            .addCase(postTraveler.fulfilled, (state, action) => {            
                state.loading = false;
                state.travelers.push(action.payload.travelers);
            })          
            .addCase(postTraveler.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to post traveler";
            });
    }
});

export const {setTravelCompanions, clearTravelCompanions } = travelCompanionsSlice.actions;
export default travelCompanionsSlice.reducer;