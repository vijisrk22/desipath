import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchHouses = createAsyncThunk("houses/fetchHouses", async(_, {rejectWithValue})=>{
    try{
        const response = await api.get("/api/homes");
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

const housesSlice = createSlice({
    name: "houses",
    initialState:{
        houses: [],
        houseDetails: null,
        error: null,
        loading: false,

    },
    reducers:{
        setHouses: (state,action) =>{
            state.houses = action.payload;
        },
        clearHouses: (state)=>{
            state.houses = [];
        },
        clearHouseDetails: (state)=>{
            state.houseDetails = null;}
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchHouses.pending, (state)=>{
                state.loading = true;
                state.error= null;
            })
            .addCase(fetchHouses.fulfilled, (state,action)=>{
                state.loading = false;
                state.houses = action.payload || []; // Ensure rooms is an array
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

    }
})

export const {setHouses, clearHouses, clearHouseDetails} = housesSlice.actions;
export default housesSlice.reducer;