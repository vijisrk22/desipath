import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from "../utils/api"; // Import the centralized axios instance`

export const fetchRooms = createAsyncThunk("roommates/fetchRooms", async(_, {rejectWithValue})=>{
    try{
        const response = await api.get("/api/roommates");
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch rooms"); // Handle error response
    }
})

export const fetchRoomById = createAsyncThunk("roommates/fetchRoomById", async(roomId, {rejectWithValue})=>{
    try{
        const response = await api.get(`/api/roommates/${roomId}`);
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to fetch room details"); // Handle error response
    }
})

export const postRoom = createAsyncThunk("roommates/postRoom", async(roomData, {rejectWithValue}) =>{
    try{
        const response = await api.post("/api/roommates", roomData)
    
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to post room"); // Handle error response
    }
})

export const searchRoom = createAsyncThunk("roommates/searchRoom", async(searchQuery, {rejectWithValue})=>{
    try{
        const response = await api.post("api/roommates/search", searchQuery)
    
        return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to search");
    }
})

export const deleteRoom = createAsyncThunk("roommates/deleteRoom", async(roomId, {rejectWithValue})=>{
    try{
        const response = await api.delete(`/api/roommates/${roomId}`);
        return response.data; // Assuming the API returns the deleted room or a success message
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to delete room"); // Handle error response
    }
})

export const updateRoom = createAsyncThunk("roommates/updateRoom", async({roomId, roomData}, {rejectWithValue})=>{
    try{
        console.log(roomId, roomData)
        const response = await api.put(`/api/roommates/${roomId}`, roomData);
        return response.data; // Assuming the API returns the updated room
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to update room"); // Handle error response
    }
})

const roommatesSlice = createSlice({
    name: "roommates",
    initialState:{
        rooms: [],
        roomDetails: null,
        error: null,
        loading: false,
    },
    reducers:{
        setRooms: (state,action) =>{
            state.rooms = action.payload;
        },
        clearRooms: (state)=>{
            state.rooms = [];
        },
        clearRoomDetails: (state)=>{
            state.roomDetails = null;}
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchRooms.pending, (state)=>{
                state.loading = true;
                state.error= null;
            })
            .addCase(fetchRooms.fulfilled, (state,action)=>{
                state.loading = false;
                state.rooms = action.payload || []; // Ensure rooms is an array
            })
            .addCase(fetchRooms.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to fetch rooms";
            })
            .addCase(fetchRoomById.pending, (state)=>{
                state.loading = true;
                state.error= null;
            })
            .addCase(fetchRoomById.fulfilled, (state,action)=>{ 
                state.loading = false;
                state.roomDetails = action.payload || null; // Ensure roomDetails is an object or null
            })
            .addCase(fetchRoomById.rejected, (state,action)=>{  
                state.loading = false;
                state.error = action.payload || "Failed to fetch room details";
            }
            )
            .addCase(postRoom.pending, (state)=>{
                state.loading = true;
                state.error= null;
            } )
            .addCase(postRoom.fulfilled, (state,action)=>{
                state.loading = false;
                state.rooms.push(action.payload); // Add the new room to the list of rooms
            })
            .addCase(postRoom.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload || "Failed to post room";
            })  
            .addCase(searchRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchRoom.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Search result:", action.payload);
                state.rooms = action.payload || [];  // Update rooms with the search result
            })
            .addCase(searchRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to search rooms";
                state.rooms = [];
            })
            .addCase(deleteRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })  
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted room from the list of rooms
                state.rooms = state.rooms.filter(room => room.id !== action.payload.id);
            })  
            .addCase(deleteRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete room";
            })
            .addCase(updateRoom.pending, (state) => {      
                state.loading = true;
                state.error = null;
            })  
            .addCase(updateRoom.fulfilled, (state, action) => {
                state.loading = false;
                // Update the room in the list of rooms
                const index = state.rooms.findIndex(room => room.id === action.payload.id);
                if (index !== -1) {
                    state.rooms[index] = action.payload; // Update the room with the new data
                }
            })  
            .addCase(updateRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update room";
            }); 

    }
})

export const {setRooms, clearRooms, clearRoomDetails} = roommatesSlice.actions;
export default roommatesSlice.reducer;