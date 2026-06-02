import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import ChatScreenHeader from "./ChatScreenHeader";
import { format, isToday, isYesterday } from "date-fns";
import SendIcon from "@mui/icons-material/Send";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { fetchChatMessages, sendMessage, markMessagesAsRead, clearSelectedChat } from "../../store/ChatSlice";
import { useDispatch, useSelector } from "react-redux";

function ChatScreen({ loggedInUser, chatPartner, adId, adType }) {
  const { conversation: messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [openDisclaimer, setOpenDisclaimer] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (e) {
      return "";
    }
  };

  const formatDayLabel = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      if (isToday(date)) return "Today";
      if (isYesterday(date)) return "Yesterday";
      return format(date, "MMMM d, yyyy");
    } catch (e) {
      return "";
    }
  };

  const queryParams = new URLSearchParams(window.location.search);
  const initialMessage = queryParams.get("initialMessage") || "";

  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    // If the URL changes (e.g. switching between different ads), update the message if it's empty
    if (initialMessage && !message) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    dispatch(clearSelectedChat());
    const userId = chatPartner;
    // Initial fetch
    dispatch(fetchChatMessages({ adType, adId, userId }));
    dispatch(markMessagesAsRead({ sender_id: userId, adId, adType }));

    const interval = setInterval(() => {
      dispatch(fetchChatMessages({ adType, adId, userId }));
      dispatch(markMessagesAsRead({ sender_id: userId, adId, adType }));
    }, 30000); // 30s polling as requested

    return () => clearInterval(interval);
  }, [dispatch, adId, chatPartner, adType]);

  const groupedMessages = (messages || [])
    .filter(msg => String(msg.ad_id) === String(adId) && msg.ad_type === adType && (String(msg.sender_id) === String(chatPartner) || String(msg.receiver_id) === String(chatPartner)))
    .reduce((acc, msg) => {
    const dayLabel = formatDayLabel(msg?.created_at) || "Recent";
    if (!acc[dayLabel]) acc[dayLabel] = [];
    acc[dayLabel].push(msg);
    return acc;
  }, {});

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      receiver_id: chatPartner,
      message: message,
      ad_id: adId,
      ad_type: adType,
      sender_id: loggedInUser,
      created_at: new Date().toISOString(),
      optimistic: true,
    };

    dispatch(sendMessage(newMessage));
    setMessage("");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        height: "calc(100vh - 180px)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        overflow: "hidden"
      }}
    >
      <ChatScreenHeader adId={adId} adType={adType} />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          backgroundColor: "#f9fafb",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d1d5db",
            borderRadius: "8px",
          },
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10, opacity: 0.5 }}>
             <Typography sx={{ color: "#9ca3af", fontStyle: "italic" }}>
              Start your conversation...
            </Typography>
          </Box>
        ) : (
          Object.keys(groupedMessages).map((dayLabel, dayIndex) => (
            <Box key={dayIndex}>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "#9ca3af",
                    backgroundColor: "#fff",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "12px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  {dayLabel}
                </Typography>
              </Box>

              {groupedMessages[dayLabel].map((msg, msgIndex) => {
                const isLoggedInUser = Number(msg.sender_id) === Number(loggedInUser);
                return (
                  <Box
                    key={msgIndex}
                    sx={{
                      display: "flex",
                      flexDirection: isLoggedInUser ? "row-reverse" : "row",
                      mb: 2,
                      px: 1
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "70%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isLoggedInUser ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: isLoggedInUser ? "#2563eb" : "#ffffff",
                          color: isLoggedInUser ? "#ffffff" : "#1f2937",
                          p: "12px 16px",
                          borderRadius: isLoggedInUser 
                            ? "18px 18px 4px 18px" 
                            : "18px 18px 18px 4px",
                          boxShadow: isLoggedInUser 
                            ? "0 4px 12px rgba(37, 99, 235, 0.2)" 
                            : "0 2px 8px rgba(0,0,0,0.05)",
                          fontSize: "0.95rem",
                          lineHeight: 1.5,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {msg?.message}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mx: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "#9ca3af",
                            fontWeight: "500"
                          }}
                        >
                          {formatTime(msg?.created_at)}
                        </Typography>
                        {isLoggedInUser && (
                          <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                            {msg.is_read ? (
                              <Typography sx={{ fontSize: '0.85rem', color: '#3b82f6', lineHeight: 1, fontWeight: 'bold' }} title="Read">✓✓</Typography>
                            ) : (
                              <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1 }} title="Sent">✓</Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Bar Section */}
      <Box sx={{ p: 2, backgroundColor: "#ffffff", borderTop: "1px solid #f3f4f6" }}>
        {/* Disclaimer Link */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
           <Link 
             component="button" 
             onClick={() => setOpenDisclaimer(true)}
             sx={{ 
               fontSize: "0.75rem", 
               color: "#6b7280", 
               textDecoration: "none",
               display: 'flex',
               alignItems: 'center',
               gap: 0.5,
               "&:hover": { color: "#2563eb", textDecoration: "underline" }
             }}
           >
             <InfoOutlinedIcon sx={{ fontSize: 14 }} />
             Chat Safety & Security Disclaimer
           </Link>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                backgroundColor: "#f9fafb",
                px: 2,
                "& fieldset": { border: 'none' },
                "&.Mui-focused fieldset": { border: 'none' },
              },
              "& .MuiInputBase-input": {
                fontSize: "0.95rem",
                py: 1.5
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{
              minWidth: 0,
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              "&:hover": {
                backgroundColor: "#1d4ed8",
                transform: "scale(1.05)"
              },
              "&.Mui-disabled": {
                backgroundColor: "#e5e7eb",
                color: "#9ca3af",
                boxShadow: "none"
              },
              transition: "all 0.2s ease"
            }}
          >
            <SendIcon sx={{ fontSize: 20 }} />
          </Button>
        </Box>
      </Box>

      {/* Disclaimer Dialog */}
      <Dialog 
        open={openDisclaimer} 
        onClose={() => setOpenDisclaimer(false)}
        PaperProps={{
          sx: { borderRadius: "24px", p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: "800", color: "#1e3a8a" }}>
          <ShieldOutlinedIcon color="primary" />
          Security & Privacy Disclaimer
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "700", color: "#111827", mb: 0.5 }}>
                1. Non-Encrypted Communication
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 1.6 }}>
                Please be aware that chat messages on Desipath are not end-to-end encrypted. System administrators may access message logs for safety, moderation, and technical support purposes.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "700", color: "#111827", mb: 0.5 }}>
                2. Protect Your Identity
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 1.6 }}>
                Avoid sharing highly sensitive personal information, such as your full home address (until a physical meeting is confirmed), Social Security Number (SSN), or copies of government-issued IDs.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "700", color: "#111827", mb: 0.5 }}>
                3. Financial Safety Warning
              </Typography>
              <Typography variant="body2" sx={{ color: "#dc2626", fontWeight: "600", lineHeight: 1.6 }}>
                NEVER share bank account details, credit/debit card numbers, CVVs, or wire transfer information. Desipath will never ask for your payment credentials through the chat interface.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "700", color: "#111827", mb: 0.5 }}>
                4. Meet and Verify with Caution
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 1.6 }}>
                Exercise extreme caution when communicating with strangers. For physical viewings or transactions, always meet in public, well-lit spaces and consider bringing a friend.
              </Typography>
            </Box>

            <Box sx={{ backgroundColor: "#eff6ff", p: 2, borderRadius: "16px", border: "1px solid #dbeafe" }}>
               <Typography variant="caption" sx={{ color: "#1e40af", fontWeight: "600", display: 'block' }}>
                 By using this chat, you agree to follow these safety guidelines. Report any suspicious activity or requests for inappropriate information to Desipath support immediately.
               </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenDisclaimer(false)} 
            variant="contained" 
            fullWidth
            sx={{ 
              borderRadius: "12px", 
              py: 1.5, 
              backgroundColor: "#1e3a8a",
              fontWeight: "700",
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(30, 58, 138, 0.3)"
            }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ChatScreen;
