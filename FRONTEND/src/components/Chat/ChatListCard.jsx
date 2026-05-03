import { Avatar, Box, Card, CardHeader, Typography } from "@mui/material";
import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  parseISO,
} from "date-fns";

import { useNavigate } from "react-router-dom";

function ChatListCard({ chat }) {
  const lastMessageDate = chat?.created_at ? parseISO(chat.created_at) : new Error();
  const navigate = useNavigate();

  let displayDate;
  if (isToday(lastMessageDate)) {
    displayDate = format(lastMessageDate, "hh:mm a");
  } else if (isYesterday(lastMessageDate)) {
    displayDate = "Yesterday";
  } else if (differenceInDays(new Date(), lastMessageDate) < 7) {
    displayDate = format(lastMessageDate, "EEEE");
  } else {
    displayDate = format(lastMessageDate, "MMM d");
  }

  const handleClick = () => {
    const chatPartnerInfo = {
      chatPartnerId: chat.chatPartner.id,
      chatPartnerName: chat.chatPartner.name,
    };

    navigate(
      `/inbox?adType=${chat.ad_type}&adId=${chat.ad_id}&chatPartnerInfo=${encodeURIComponent(
        JSON.stringify(chatPartnerInfo)
      )}`
    );
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1,
        display: "flex",
        alignItems: "center",
        backgroundColor: "transparent",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        p: 1.5,
        "&:hover": { 
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transform: "translateY(-1px)"
        },
      }}
      onClick={handleClick}
    >
      <Avatar
        src={chat?.photoUrl}
        sx={{
          width: 54,
          height: 54,
          mr: 2,
          backgroundColor: "#eff6ff",
          color: "#2563eb",
          fontWeight: "600",
          fontSize: "1.1rem",
          border: "2px solid #fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >
        {chat?.chatPartner?.name?.charAt(0) || "U"}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
          <Typography
            sx={{
              color: "#111827",
              fontSize: "0.95rem",
              fontWeight: "600",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {chat?.chatPartner?.name || "Unknown User"}
          </Typography>
          <Typography
            sx={{
              color: "#9ca3af",
              fontSize: "0.75rem",
              fontWeight: "500",
              ml: 1
            }}
          >
            {displayDate}
          </Typography>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
           <Typography
            sx={{
              color: "#6b7280",
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1
            }}
          >
            {chat.message}
          </Typography>
          <Box 
            sx={{ 
              px: 1, 
              py: 0.25, 
              borderRadius: "4px", 
              backgroundColor: "#f3f4f6", 
              fontSize: "0.65rem", 
              color: "#6b7280",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.025em"
            }}
          >
            {chat.ad_type}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default ChatListCard;

// sx={{
//     display: "flex",
//     flexGrow: 1,
//     gap: "26px",
//     alignItems: "center",
//   }}
