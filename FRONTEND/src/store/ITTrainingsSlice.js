import {createSlice, createAsyncThunk} from "@reduxjs/toolkit" ;
import api from "../utils/api" ;
import { set } from "date-fns";


export const fetchLearningPaths = createAsyncThunk(
    "itTrainings/fetchLearningPaths",
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.get("/api/itTrainings/learningPaths") ;
            return response.data ;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch learning paths") ;
        }
    }
) ;

export const postQuery = createAsyncThunk("itTrainings/postSearchQuery", async (searchQuery, {rejectWithValue}) => {
    try {
        const response = await api.post("/api/itTrainings/searchResult", searchQuery);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to search "); 
    }    
});

export const fetchCourseDetails = createAsyncThunk("itTrainings/fetchCourseDetails", async (courseId, {rejectWithValue}) => {
    try {
        const response = await api.get(`/api/itTrainings/course/${courseId}`) ;
        console.log(response)
        return response.data ;  
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch course details") ;  
    }
});

const itTrainingsSlice = createSlice({
    name: "itTrainings",
    initialState: {
        learningPaths: [],
        searchResults: [],
        courseDetails: null,
        error: null,
        loading: false,
    },
    reducers: {
        setLearningPaths: (state, action) => {
            state.learningPaths = action.payload ;
        },
        clearLearningPaths: (state) => {
            state.learningPaths = [] ;
        },
        setSearchResults: (state, action) => {    
            state.searchResults = action.payload ;
        },
        clearSearchResults: (state) => {
            state.searchResults = [] ;
        },  
        setCourseDetails: (state, action) => {  
            state.courseDetails = action.payload ;
        },
        clearCourseDetails: (state) => {
            state.courseDetails = null ;
        },
    },  
    extraReducers: (builder) => {
        builder
            .addCase(fetchLearningPaths.pending, (state) => {
                state.loading = true ;
                state.error = null ;
            })
            .addCase(fetchLearningPaths.fulfilled, (state, action) => {
                state.loading = false ;
                state.learningPaths = action.payload.learningPaths || [] ;
            })
            .addCase(fetchLearningPaths.rejected, (state, action) => {
                state.loading = false ;
                state.error = action.payload ;
            }) 
            .addCase(postQuery.pending, (state) => {
                state.loading = true ;
                state.error = null ;
            })
            .addCase(postQuery.fulfilled, (state, action) => {
                state.loading = false ;
                state.searchResults = action.payload.searchResults || [] ;
            })
            .addCase(postQuery.rejected, (state, action) => {           
                state.loading = false ;
                state.error = action.payload ;
            })
            .addCase(fetchCourseDetails.pending, (state) => {
                state.loading = true ;
                state.error = null ;
            })
            .addCase(fetchCourseDetails.fulfilled, (state, action) => {
                state.loading = false ;
                state.courseDetails = action.payload.courseDetails || null ;
            }) 
            .addCase(fetchCourseDetails.rejected, (state, action) => {    
                state.loading = false ;
                state.error = action.payload ;
            }) 
    },
})

export const {setLearningPaths, clearLearningPaths,  setSearchResults, clearSearchResults,setCourseDetails, clearCourseDetails} = itTrainingsSlice.actions ;
export default itTrainingsSlice.reducer ;