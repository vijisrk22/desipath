import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchHouses = createAsyncThunk("houses/fetchHouses", async({ page = 1, sortOption = '' } = {}, {rejectWithValue})=>{
    try{
        const params = new URLSearchParams();
        params.append('page', page);
        if (sortOption) {
            params.append('sort', sortOption);
        }
        const response = await api.get(`/api/homes?${params.toString()}`);
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch houses"); // Handle error response
    }
})

export const fetchHouseById = createAsyncThunk("houses/fetchHouseById", async(houseId, {rejectWithValue})=>{
    try{
        const response = await api.get(`/api/homes/${houseId}`);
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch house details"); // Handle error response
    }
})

export const postHouse = createAsyncThunk("houses/postHouse", async(houseData, {rejectWithValue}) =>{
    try{
        const response = await api.post("/api/homes", houseData) 
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to post house"); // Handle error response
    }
})

export const searchHouse = createAsyncThunk("houses/searchHouse", async ({ searchQuery, page = 1, sortOption = '' }, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        if (sortOption) {
            params.append('sort', sortOption);
        }
        const response = await api.post(`/api/homes/search?${params.toString()}`, searchQuery);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to search houses");
    }
})

export const updateHouse = createAsyncThunk("houses/updateHouse", async({ houseId, houseData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/api/homes/${houseId}`, houseData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update house");
    }
})

const housesSlice = createSlice({
    name: "houses",
    initialState:{
        houses: [],
        pagination: {
            current_page: 1,
            last_page: 1,
            total: 0,
            per_page: 12,
            from: 0,
            to: 0
        },
        houseDetails: null,
        error: null,
        loading: false,
        lastSearchQuery: null,
    },
    reducers:{
        setHouses: (state,action) =>{
            state.houses = action.payload;
        },
        clearHouses: (state)=>{
            state.houses = [];
        },
        clearHouseDetails: (state)=>{
            state.houseDetails = null;
        },
        resetSearchState: (state) => {
            state.houses = [];
            state.pagination = {
                current_page: 1,
                last_page: 1,
                total: 0,
                per_page: 12,
                from: 0,
                to: 0
            };
            state.lastSearchQuery = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchHouses.pending, (state)=>{
                state.loading = true;
                state.error= null;
            })
            .addCase(fetchHouses.fulfilled, (state,action)=>{
                state.loading = false;
                state.houses = action.payload.data || []; // Extract data
                state.pagination = {
                    current_page: action.payload.current_page,
                    last_page: action.payload.last_page,
                    total: action.payload.total,
                    per_page: action.payload.per_page,
                    from: action.payload.from,
                    to: action.payload.to,
                };
            })
            .addCase(fetchHouses.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to fetch houses";
            })
            .addCase(fetchHouseById.pending, (state)=>{
                state.loading = true;
                state.error= null;
            })
            .addCase(fetchHouseById.fulfilled, (state,action)=>{ 
                state.loading = false;
                state.houseDetails = action.payload || null; // Ensure roomDetails is an object or null
            })
            .addCase(fetchHouseById.rejected, (state,action)=>{  
                state.loading = false;
                state.error = action.payload || "Failed to fetch house details";
            }
            )
            .addCase(postHouse.pending, (state)=>{
                state.loading = true;
                state.error= null;
            } )
            .addCase(postHouse.fulfilled, (state,action)=>{
                state.loading = false;
                state.houses.push(action.payload); // Add the new room to the list of rooms
            })
            .addCase(postHouse.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to post house";
            })  
            .addCase(searchHouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchHouse.fulfilled, (state, action) => {
                state.loading = false;
                state.houses = action.payload.data || [];
                state.pagination = {
                    current_page: action.payload.current_page,
                    last_page: action.payload.last_page,
                    total: action.payload.total,
                    per_page: action.payload.per_page,
                    from: action.payload.from,
                    to: action.payload.to,
                };
                state.lastSearchQuery = action.meta.arg.searchQuery;
            })
            .addCase(searchHouse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to search houses";
                state.houses = [];
                state.pagination = {
                    current_page: 1,
                    last_page: 1,
                    total: 0,
                    per_page: 9
                };
            })
            .addCase(updateHouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHouse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.houses.findIndex(h => h.id === action.payload.id);
                if (index !== -1) {
                    state.houses[index] = action.payload;
                }
            })
            .addCase(updateHouse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update house";
            });
    }
})

export const {setHouses, clearHouses, clearHouseDetails, resetSearchState} = housesSlice.actions;
export default housesSlice.reducer;
