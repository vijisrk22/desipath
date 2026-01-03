import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

export const getStates = createAsyncThunk("location/getStates", async (_, {rejectWithValue}) =>{
    try{
        const response = await api.get("/api/location/states")
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data|| "Failed to get states");
    }
})


export const getCities = createAsyncThunk("location/getCities", async (stateId, {rejectWithValue}) =>{
    try{
        const response = await api.get(`/api/location/cities?stateId=${stateId}`)
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data|| "Failed to get cities");
    }
})

export const getZipcodes = createAsyncThunk("location/getZipcodes", async (city, {rejectWithValue}) =>{
    try{
        console.log(city);
        const response = await api.get(`/api/location/zipcodes?city=${city}`)
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data|| "Failed to get zipcodes");
    }
})

export const getLocations = createAsyncThunk(
  "location/getLocations",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/location/locations?filter=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get locations");
    }
  }
);

const locationSlice = createSlice({
    name: "location",
    initialState:{
        states_data: [],
        cities_data: [],
        zipcodes_data: [],
        locations_data: [],
        error: null,
        loading: false,
    },
    reducers:{
        setStates: (state,action) =>{
            state.states_data = action.payload;
        },
        setCities: (state,action) =>{
            state.cities_data = action.payload;
        },
        setZipcodes: (state,action) =>{
            state.zipcodes_data = action.payload;
        },  
        setLocations: (state,action) =>{
            state.locations_data = action.payload;
        },  
        clearStates: (state)=>{
            state.states_data = [];
        },
        clearCities: (state)=>{
            state.cities_data = [];
        },
        clearZipcodes: (state)=>{
            state.zipcodes_data = [];
        },
        clearLocations: (state)=>{
            state.locations_data = [];
        }
    },
    extraReducers:(builder) =>{
        builder
            .addCase(getStates.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getStates.fulfilled,(state,action)=>{
                state.loading = false;
                state.states_data = action.payload || [];
            })
            .addCase(getStates.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to fetch states";
            })

            .addCase(getCities.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getCities.fulfilled,(state,action)=>{
                state.loading = false;
                state.cities_data = action.payload || [];
            })
            .addCase(getCities.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to fetch cities";
            })
            .addCase(getZipcodes.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getZipcodes.fulfilled,(state,action)=>{
                state.loading = false;
                state.zipcodes_data = action.payload || [];
            })
            .addCase(getZipcodes.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to fetch cities";
            })
            .addCase(getLocations.pending,(state)=>{
                state.loading = true;
                state.error = null;
            }) 
            .addCase(getLocations.fulfilled,(state,action)=>{
                state.loading = false;
                state.locations_data = action.payload || [];
            })  
            .addCase(getLocations.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to fetch locations";
            })
    }

})

export const {setStates,setCities, setZipcodes,setLocations, clearCities, clearStates, clearZipcodes,clearLocations} = locationSlice.actions;
export default locationSlice.reducer;