import { Avatar, Box, Typography } from "@mui/material";
import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  parseISO,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ChatListCard({ chat }) {
  const lastMessageDate = chat?.created_at ? parseISO(chat.created_at) : new Date();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  let displayDate;
  if (isToday(lastMessageDate)) {
    displayDate = format(lastMessageDate, "h:mm a");
  } else if (isYesterday(lastMessageDate)) {
    displayDate = "Yesterday";
  } else if (differenceInDays(new Date(), lastMessageDate) < 7) {
    displayDate = format(lastMessageDate, "MMM d");
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

  const senderFirstName = chat?.chatPartner?.name ? chat.chatPartner.name.split(' ')[0] : 'User';
  
  const unreadCount = Number(chat?.unread_count) || 0;
  const isUnread = unreadCount > 0;
  const isLastMessageFromMe = Number(chat?.sender_id) === Number(user?.id);

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: isUnread ? "#eef3f8" : "#ffffff", 
        p: 2,
        cursor: "pointer",
        borderBottom: "1px solid #dce6f1",
        "&:hover": {
          backgroundColor: isUnread ? "#e0eaf5" : "#f3f4f6",
        },
      }}
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
          fontSize: "1.2rem",
        }}
      >
        {chat?.chatPartner?.name?.charAt(0) || "U"}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Top Row: Name and Time */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
          <Typography
            sx={{
              color: "rgba(0,0,0,0.9)",
              fontSize: "1rem",
              fontWeight: isUnread ? "600" : "500",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {chat?.chatPartner?.name || "Unknown User"}
          </Typography>
          <Typography
            sx={{
              color: isUnread ? "#2563eb" : "rgba(0,0,0,0.6)",
              fontSize: "0.85rem",
              fontWeight: isUnread ? "600" : "400",
              ml: 1,
              whiteSpace: "nowrap"
            }}
          >
            {displayDate}
          </Typography>
        </Box>
        
        {/* Bottom Row: Message snippet and Badge */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <Typography
            sx={{
              color: isUnread ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.6)",
              fontSize: "0.9rem",
              fontWeight: isUnread ? "600" : "400",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.4,
              flex: 1,
              pr: 2
            }}
          >
            {isLastMessageFromMe ? "You" : senderFirstName}: {chat.message}
          </Typography>
          
          {isUnread && (
            <Box 
              sx={{ 
                width: 18, 
                height: 18, 
                borderRadius: "50%", 
                backgroundColor: "#2563eb", 
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: "bold",
                flexShrink: 0
              }}
            >
              {unreadCount}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ChatListCard;
