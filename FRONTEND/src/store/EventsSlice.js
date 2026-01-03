import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/events");
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch events"
      );
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/events/${eventId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch event details"
      );
    }
  }
);  

export const postEvent = createAsyncThunk(
  "events/postEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/events", eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to post event"
      );
    }
  }
);      

const eventsSlice = createSlice({
    name: "events", 
    initialState: {
        events: [],
        eventDetails: null,
        error: null,
        loading: false,
    },
    reducers: {
        setEvents: (state, action) => {
            state.events = action.payload;
        },
        clearEvents: (state) => {
            state.events = [];
        },
        clearEventDetails: (state) => {
            state.eventDetails = null;
        },
    },  
    extraReducers: (builder) => {       
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.events || [];
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch events";
            })
            .addCase(fetchEventById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventById.fulfilled, (state, action) => {
                state.loading = false;
                state.eventDetails = action.payload || null;
            })
            .addCase(fetchEventById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch event details";
            })
            .addCase(postEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postEvent.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally update the events list with the new event
                state.events.push(action.payload.event);
            })
            .addCase(postEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to post event";
            });
    }
}); 

export const { setEvents, clearEvents, clearEventDetails } = eventsSlice.actions;
export default eventsSlice.reducer;


