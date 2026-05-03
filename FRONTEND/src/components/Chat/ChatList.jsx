import { Box, Paper, Typography } from "@mui/material";
import ChatListCard from "./ChatListCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchChatList } from "../../store/ChatSlice";

function ChatList() {
  const dispatch = useDispatch();
  const { userMessages, loading, error } = useSelector((state) => state.chat); 
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    dispatch(fetchChatList());
    const interval = setInterval(() => {
      dispatch(fetchChatList());
    }, 30000); // Poll every 30s as requested
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        height: "calc(100vh - 180px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid #f3f4f6" }}>
        <Typography
          sx={{
            color: "#111827",
            fontSize: "1.25rem",
            fontWeight: "700",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Messages
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1.5,
          backgroundColor: "#fafafa",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d1d5db",
            borderRadius: "4px",
          },
        }}
      >
        {loading && userMessages.length === 0 ? (
           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
             <Typography sx={{ color: '#9ca3af' }}>Loading chats...</Typography>
           </Box>
        ) : userMessages.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.9rem" }}>
              No messages yet.
            </Typography>
          </Box>
        ) : (
          userMessages
            .filter((chat) => chat?.chatPartner && Number(chat.chatPartner.id) !== Number(user?.id))
            .map((chat) => (
              <ChatListCard 
                key={`${chat.ad_type}-${chat.ad_id}-${chat.chatPartner.id}`} 
                chat={chat} 
              />
            ))
        )}
      </Box>
    </Paper>
  );
}

export default ChatList;
