import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from "../utils/api";

export const fetchCars = createAsyncThunk("cars/fetchCars", async(_, {rejectWithValue}) =>{
    try{
        const response = await api.get("/api/cars");
        return response.data;

    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch cars");
    }
})

export const fetchCarById = createAsyncThunk("cars/fetchCarById", async(carId, {rejectWithValue})=>{
    try{
        const response = await api.get(`/api/cars/${carId}`);
        // console.log(response)
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch car details")
    }
})

export const postCar = createAsyncThunk("cars/postCar", async(carData, {rejectWithValue})=>{
    try{
        const response = await api.post("/api/cars", carData);
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to post car")
    }
})

export const searchCar = createAsyncThunk("cars/searchCar", async(searchQuery, {rejectWithValue})=>{
    try{
        const response = await api.post("/api/cars/search", searchQuery)
        console.log(response)
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to search");
    }
})

export const getCarMake = createAsyncThunk("cars/getCarMake", async(_, {rejectWithValue})=>{
    try{
        const response = await api.get("/api/cars/make");
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch car makes");
    }
})

export const getCarModel = createAsyncThunk("cars/getCarModel", async(make, {rejectWithValue})=>{
    try{
        const response = await api.get(`/api/cars/models?make=${make}`);
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch car models");
    }
})

export const deleteCar = createAsyncThunk("cars/deleteCar", async(carId, {rejectWithValue})=>{
    try{
        const response = await api.delete(`/api/cars/${carId}`);
        return response.data; // Assuming the API returns the deleted car or a success message
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to delete car"); // Handle error response
    }
})

export const updateCar = createAsyncThunk("cars/updateCar", async({carId, carData}, {rejectWithValue})=>{
    try{
        const response = await api.put(`/api/cars/${carId}`, carData);
        return response.data; // Assuming the API returns the updated car
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to update car"); // Handle error response
    }
})
//


const carsSlice = createSlice({
    name: "cars",
    initialState:{
        cars: [],
        car_make:[],
        car_model: [],
        carDetails: null,
        error: null,
        loading: false,
    },
    reducers:{
        setCars: (state,action) =>{
            state.cars = action.payload;
        },
        clearCars: (state)=>{
            state.cars = [];
        },
        clearCarDetails: (state) =>{
            state.carDetails = null;
        },
        setCarMake: (state, action) => {
            state.car_make = action.payload;
        },
        clearCarMake: (state) => {  
            state.car_make = [];
        },
        setCarModel: (state, action) => {
            state.car_model = action.payload;
        },
        clearCarModel: (state) => {
            state.car_model = [];
        }   
    },
    extraReducers: (builder)=>{
        builder
            .addCase(fetchCars.pending, (state)=>{
                state.loading =true;
                state.error = null;
            }) .addCase(fetchCars.fulfilled, (state,action)=>{
                state.loading = false;
                state.cars = action.payload || [];
            })
            .addCase(fetchCars.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to fetch cars";
            })
            .addCase(fetchCarById.pending, (state)=>{
                state.loading = true;
                state.error= null;
            })
            .addCase(fetchCarById.fulfilled, (state,action)=>{ 
                state.loading = false;
                console.log(action.payload)
                state.carDetails = action.payload || null; // Ensure carDetails is an object or null
            })
            .addCase(fetchCarById.rejected, (state,action)=>{  
                state.loading = false;
                state.error = action.payload || "Failed to fetch car details";
            }
            )
            .addCase(postCar.pending, (state)=>{
                state.loading = true;
                state.error= null;
            } )
            .addCase(postCar.fulfilled, (state,action)=>{
                state.loading = false;
                state.cars.push(action.payload); // Add the new car to the list of cars
            })
            .addCase(postCar.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to post car";
            })  
            .addCase(searchCar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCar.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = action.payload || [];  // Update cars with the search result
            })
            .addCase(searchCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to search rooms";
                state.cars = [];
            })
            .addCase(getCarMake.pending, (state) => {
                state.loading = true;
                state.error = null;
            })  
            .addCase(getCarMake.fulfilled, (state, action) => {
                state.loading = false;
                state.car_make = action.payload || [];  // Update car makes
            })
            .addCase(getCarMake.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch car makes";
                state.car_make = [];
            })  
            .addCase(getCarModel.pending, (state) => {
                state.loading = true;
                state.error = null;
            }) 
            .addCase(getCarModel.fulfilled, (state, action) => {
                state.loading = false;
                state.car_model = action.payload || [];  // Update car models
            })
            .addCase(getCarModel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch car models";
                state.car_model = [];
            })
            .addCase(deleteCar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = state.cars.filter(car => car.id !== action.payload.id);
            })
            .addCase(deleteCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete car";
            })
            .addCase(updateCar.pending, (state) => {      
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCar.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.cars.findIndex(car => car.id === action.payload.id);
                if (index !== -1) {
                    state.cars[index] = action.payload; // Update the car in the list
                }
            })
            .addCase(updateCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update car";
            });  

}
})

export const {setCars, clearCars, clearCarDetails,setCarMake,
    clearCarMake,
    setCarModel,
    clearCarModel,} = carsSlice.actions;
export default carsSlice.reducer;