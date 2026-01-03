import { Box, Paper, Typography } from "@mui/material";
import ChatListCard from "./ChatListCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchChatList } from "../../store/ChatSlice";

function ChatList() {
  const dispatch = useDispatch();
  const { userMessages, loading, error } = useSelector((state) => state.chat); // Access loading and error from the Redux store
  const { user } = useSelector((state) => state.user);
  const chatList = [];

  useEffect(() => {
    dispatch(fetchChatList());
    const interval = setInterval(() => {
      dispatch(fetchChatList());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  userMessages.forEach((msg) => {
    const isSender = msg.sender_id === user.id;

    const loggedInUser = isSender
      ? { id: msg.sender_id, name: msg.sender_name }
      : { id: msg.receiver_id, name: msg.receiver_name };

    const chatPartner = isSender
      ? { id: msg.receiver_id, name: msg.receiver_name }
      : { id: msg.sender_id, name: msg.sender_name };

    const existingChat = chatList.find(
      (chat) =>
        chat.ad_id === msg.ad_id &&
        chat.ad_type === msg.ad_type &&
        chat.chatPartner.id === (isSender ? msg.receiver_id : msg.sender_id)
    );

    if (existingChat) {
      existingChat.messages.push(msg);
    } else {
      chatList.push({
        ad_id: msg.ad_id,
        ad_type: msg.ad_type,
        loggedInUser,
        chatPartner,
        messages: [msg],
      });
    }
  });

  return (
    <Paper
      elevation={10}
      sx={{
        borderRadius: "10px",
        borderColor: "#d1d5db",
        borderStyle: "solid",
        borderWidth: "1px",
        px: "15px",
        py: "20px",
        height: "100vh", // Set a fixed height for scrollable content
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          color: "#1f2937 ",
          fontSize: "1.5rem",
          lineHeight: "1.75rem",
          fontWeight: "bold",
        }}
        className="font-dmsans"
      >
        Messages
      </Typography>
      <Box
        sx={{
          flex: 1, // Takes remaining space
          overflowY: "auto", // Enable vertical scrolling
          pr: "5px", // Prevents content from hiding behind scrollbar
          "&::-webkit-scrollbar": {
            width: "5px", // Thin scrollbar
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent", // Track color
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#9ca3af", // Thumb color (gray-400)
            borderRadius: "10px", // Rounded edges
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#6b7280", // Darker gray on hover
          },
        }}
      >
        {chatList.length === 0 && (
          <Typography sx={{ textAlign: "center", mt: 12, color: "#6b7280" }}>
            No messages yet.
          </Typography>
        )}

        {chatList?.map((chat) => (
          <ChatListCard key={`${chat.ad_type}${chat.ad_id}`} chat={chat} />
        ))}
      </Box>
    </Paper>
  );
}

export default ChatList;
