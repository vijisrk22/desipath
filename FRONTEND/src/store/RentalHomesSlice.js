import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchRentalHomes = createAsyncThunk("rentalHomes/fetchRentalHomes", async(_, {rejectWithValue}) =>{
    try{
        const response = await api.get("/api/rentalhomes");
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch rental homes"); // Handle error response
    }
})

export const fetchRentalHomeById = createAsyncThunk("rentalHomes/fetchRentalHomeById", async(rentalHomeId, {rejectWithValue})=>{
    try{
        const response = await api.get(`/api/rentalhomes/${rentalHomeId}`);
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch rental home details"); // Handle error response
    }
})

export const postRentalHome = createAsyncThunk("rentalHomes/postRentalHome", async(rentalHomeData, {rejectWithValue}) =>{
    try{
    //    console.log(rentalHomeData)
        const response = await api.post("/api/rentalhomes", rentalHomeData)
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to post rental home"); // Handle error response
    }
})

export const searchRentalHome = createAsyncThunk("rentalHomes/searchRentalHome", async(searchQuery, {rejectWithValue})=>{
    try{
        const response = await api.post("/api/rentalhomes/search", searchQuery);
        console.log(response)
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to search rental homes"); // Handle error response
    }
})

export const deleteRentalHome = createAsyncThunk("rentalHomes/deleteRentalHome", async(rentalHomeId, {rejectWithValue})=>{
    try{
        const response = await api.delete(`/api/rentalhomes/${rentalHomeId}`);
        return response.data; // Assuming the API returns the deleted rental home data
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to delete rental home"); // Handle error response
    }
})

export const updateRentalHome = createAsyncThunk("rentalHomes/updateRentalHome", async({rentalHomeId, rentalHomeData}, {rejectWithValue})=>{
    try{
        const response = await api.put(`/api/rentalhomes/${rentalHomeId}`, rentalHomeData);
        return response.data; // Assuming the API returns the updated rental home data
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to update rental home"); // Handle error response
    }
})   


const rentalHomesSlice = createSlice({
    name: "rentalHomes",
    initialState:{
        rentalHomes: [],
        rentalHomeDetails: null,
        error: null,
        loading: false,

    },
    reducers:{
        setRentalHomes: (state,action) =>{
            state.rentalHomes = action.payload;
        },
        clearRentalHomes: (state)=>{
            state.rentalHomes = [];
        },
        clearRentalHomeDetails: (state)=>{
            state.rentalHomeDetails = null;}
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchRentalHomes.pending, (state)=>{
                state.loading = true;
                state.error= null;
            })
            .addCase(fetchRentalHomes.fulfilled, (state,action)=>{
                state.loading = false;
                state.rentalHomes = action.payload || []; 
            })
            .addCase(fetchRentalHomes.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to fetch rental homes";
            })
            .addCase(fetchRentalHomeById.pending, (state)=>{
                state.loading = true;
                state.error= null;
            })
            .addCase(fetchRentalHomeById.fulfilled, (state,action)=>{ 
                state.loading = false;
                state.rentalHomeDetails = action.payload || null; // Ensure rentalHomeDetails is an object or null
            })
            .addCase(fetchRentalHomeById.rejected, (state,action)=>{  
                state.loading = false;
                state.error = action.payload || "Failed to fetch rental home details";
            }
            )
            .addCase(postRentalHome.pending, (state)=>{
                state.loading = true;
                state.error= null;
            } )
            .addCase(postRentalHome.fulfilled, (state,action)=>{
                state.loading = false;
                state.rentalHomes.push(action.payload); // Add the new room to the list of rooms
            })
            .addCase(postRentalHome.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to post rental home";
            })  
            .addCase(searchRentalHome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchRentalHome.fulfilled, (state, action) => {
                state.loading = false;
                state.rentalHomes = action.payload || [];  // Update rentalHomes with the search result
            })
            .addCase(searchRentalHome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to search rental homes";
                state.rentalHomes = [];
            })
            .addCase(deleteRentalHome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })  
            .addCase(deleteRentalHome.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted rental home from the list
                state.rentalHomes = state.rentalHomes.filter(
                    (rentalHome) => rentalHome.id !== action.payload.id
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
                const index = state.rentalHomes.findIndex(
                    (rentalHome) => rentalHome.id === action.payload.id
                );
                if (index !== -1) {
                    state.rentalHomes[index] = action.payload; // Update the rental home with the new data
                }
            })
    }
    
})

export const {setRentalHomes, clearRentalHomes, clearRentalHomeDetails} = rentalHomesSlice.actions;
export default rentalHomesSlice.reducer;