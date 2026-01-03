import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import ChatScreenHeader from "./ChatScreenHeader";
import { format, isToday, isYesterday } from "date-fns";
import SendIcon from "@mui/icons-material/Send";
import { fetchChatMessages, sendMessage } from "../../store/ChatSlice";
import { useDispatch, useSelector } from "react-redux";

function ChatScreen({ loggedInUser, chatPartner, adId, adType }) {
  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";

  const { conversation } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return format(new Date(timestamp), "hh:mm a");
  };

  const formatDayLabel = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "eeee");
  };

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(conversation || []);

  useEffect(() => {
    setMessages(conversation || []);
  }, [conversation]);

  useEffect(() => {
    const userId = chatPartner;

    // Fetch once immediately
    dispatch(fetchChatMessages({ adType, adId, userId }));

    const interval = setInterval(() => {
      dispatch(fetchChatMessages({ adType, adId, userId }));
    }, 1000); // 1000ms = 1second

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [dispatch, adId, chatPartner, adType]);

  const groupedMessages = (messages || []).reduce((acc, message) => {
    const dayLabel = formatDayLabel(message?.created_at);
    if (!acc[dayLabel]) acc[dayLabel] = [];
    acc[dayLabel].push(message);
    return acc;
  }, {});

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      receiver_id: chatPartner,
      message: message,
      ad_id: adId,
      ad_type: adType,
    };

    console.log(newMessage);

    try {
      dispatch(sendMessage(newMessage));
      setMessage("");
      scrollToBottom();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Paper
      elevation={10}
      sx={{
        borderRadius: "10px",
        borderColor: "#d1d5db",
        borderStyle: "solid",
        borderWidth: "1px",
        px: "15px",
        py: "10px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatScreenHeader adId={adId} adType={adType} />

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          height: "70vh",
          m: 2,
        }}
      >
        {/* Message Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            paddingRight: "4px", // for scrollbar room
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#9ca3af",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#6b7280",
            },
          }}
        >
          {messages.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                color: "#9ca3af",
                fontStyle: "italic",
                marginTop: "30px",
              }}
            >
              Start chatting...
            </Typography>
          ) : (
            Object.keys(groupedMessages).map((dayLabel, index) => (
              <Box key={index} sx={{ marginBottom: "20px" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#6b7280",
                    marginBottom: "10px",
                    textAlign: "center",
                  }}
                >
                  {dayLabel}
                </Typography>

                {groupedMessages[dayLabel].map((message, index) => {
                  const isLoggedInUser = message.sender_id === loggedInUser;
                  const sender = isLoggedInUser
                    ? conversation?.sender_id
                    : conversation?.receiver_id;

                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: isLoggedInUser ? "row-reverse" : "row",
                        alignItems: "start",
                        marginBottom: "10px",
                      }}
                    >
                      <Avatar
                        src={sender?.photoUrl || ""}
                        alt={sender?.name || ""}
                        sx={{
                          width: 40,
                          height: 40,
                          marginLeft: isLoggedInUser ? "10px" : "0",
                          marginRight: isLoggedInUser ? "0" : "10px",
                          mx: 2,
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isLoggedInUser
                            ? "flex-end"
                            : "flex-start",
                          maxWidth: "80%",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: isLoggedInUser
                              ? "#1D4ED8"
                              : "#f3f4f6",
                            color: isLoggedInUser ? "#fff" : "#000",
                            padding: "10px",
                            borderRadius: "8px",
                            wordWrap: "break-word",
                            fontSize: {
                              xs: "0.875rem",
                              sm: "0.875rem",
                              lg: "1.125rem",
                              xl: "1.125rem",
                            },
                          }}
                        >
                          {message?.message}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "#6b7280",
                            marginTop: "5px",
                            textAlign: isLoggedInUser ? "right" : "left",
                          }}
                        >
                          {formatTime(message?.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>
            ))
          )}
        </Box>

        {/* Message Input Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            borderTop: "1px solid #ddd",
            padding: "10px 0",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Type something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              flexGrow: 1,
              fontSize: "30px",
              borderRadius: "20px",
              padding: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                padding: "10px",
              },
              "& .MuiInputBase-input": {
                fontSize: "14px",
              },
            }}
          />
          <Button
            onClick={handleSendMessage}
            variant="contained"
            sx={{
              borderRadius: "12px",
              padding: "10px",
              minWidth: "0",
              height: "40px",
              width: "40px",
              boxShadow: "none",
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default ChatScreen;
