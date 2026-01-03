import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api"; // Centralized axios instance

// LOGIN
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const request = await api.post("/api/login", userCredentials);
      const response = request.data;

      // Save only token (and maybe user info separately if needed)
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  }
);

// GOOGLE LOGIN
export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (credential, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/google", {
        token: credential,
      });
      const data = res.data;

      // Store token and user in localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Google sign-in failed",
        status: error.response?.status,
      });
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const request = await api.post("/api/register", userCredentials);
      const response = request.data;
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }
);

//Update User Profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    console.log(userData)
    try {
      const request = await api.patch("/api/profile", userData);
      const response = request.data;
      // Update local storage with new user data
      localStorage.setItem("user", JSON.stringify(response.data));
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: JSON.parse(localStorage.getItem("user")) || null,
    accessToken: localStorage.getItem("access_token") || null,
    error: null,
  },

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.access_token;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.accessToken = null;
      const status = action.payload?.status;

      if (status === 401) {
        state.error = "Invalid email or password";
      } else {
        state.error = action.payload?.message || "Something went wrong";
      }
    });

    // GOOGLE LOGIN
    builder.addCase(googleLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.access_token;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(googleLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Google login failed";
    });

    // REGISTER
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
      // Not setting user or token here because user still needs to login after register
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      const status = action.payload?.status;

      if (status === 409) {
        state.error = "This email is already registered";
      } else if (status === 422) {
        state.error = "Issue registering user"; // Customize this message if you want
      } else {
        state.error = action.payload?.message || "Something went wrong";
      }
    });

    // LOGOUT
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.accessToken = null;
      state.error = null;
    });

    // Update User Profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      console.log("User profile updated:", action.payload);
      state.user = action.payload.data;
      localStorage.setItem("user", JSON.stringify(action.payload.data));
      state.error = null;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      const status = action.payload?.status;

      if (status === 422) {
        state.error = "Invalid data provided";
      } else {
        state.error = action.payload?.message || "Something went wrong";
      }
    });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
