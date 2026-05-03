import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the centralized axios instance


// Fetch Chat List
export const fetchChatList = createAsyncThunk(
  'chat/fetchChatList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/messages/conversations');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch chats'); // Handle error response
    }
  }
);

// Retrieve all messages for a specific ad involving the authenticated user and the poster
export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async ({adType, adId,userId}, { rejectWithValue }) => {
    // console.log(adType)
    try {
      const response = await api.get(`/api/messages/ad/${adId}/type/${adType}/user/${userId}`); // Adjust the endpoint as needed
      return response.data;
    } catch (error) {
      return rejectWithValue({message: error.response?.data || 'Failed to fetch chat messages',
        status: error.response?.status}); // Handle error response
    }
  }
);

//Send message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/messages', messageData);
      return response.data; // Expected to contain the new message object
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data || 'Failed to send message',
        status: error.response?.status
      });
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    userMessages: [],
    conversation: [],
    error: null,
    loading: false,
    selectedChatId: null,
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChatId = action.payload;
      state.conversation = [];
    },
    clearSelectedChat: (state) => {
      state.selectedChatId = null;
      state.conversation = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.loading = false;
        state.userMessages = action?.payload || []; // Ensure chatList is an array
      })
      .addCase(fetchChatList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.conversation = action.payload
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.status === 404) {
          state.conversation = [];
          state.error = null; // Optional: suppress the error for 404
        } else {
          state.error = action.payload?.message || 'Unknown error';
        }
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Update current conversation
        state.conversation.push(action.payload);
        
        // Update the conversation list (inbox) immediately
        const sentMsg = action.payload;
        const index = state.userMessages.findIndex(m => 
          m.ad_id === sentMsg.ad_id && 
          m.ad_type === sentMsg.ad_type &&
          ((m.sender_id === sentMsg.sender_id && m.receiver_id === sentMsg.receiver_id) ||
           (m.sender_id === sentMsg.receiver_id && m.receiver_id === sentMsg.sender_id))
        );

        if (index !== -1) {
          // Move to top and update message
          const updatedConv = { ...state.userMessages[index], ...sentMsg };
          state.userMessages.splice(index, 1);
          state.userMessages.unshift(updatedConv);
        } else {
          // New conversation
          state.userMessages.unshift(sentMsg);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send message';
      });
  },
});

export const { setSelectedChat, clearSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
