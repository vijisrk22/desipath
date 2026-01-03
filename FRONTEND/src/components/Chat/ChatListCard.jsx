import { Avatar, Box, Card, CardHeader, Typography } from "@mui/material";
import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  parseISO,
} from "date-fns";

import { useNavigate } from "react-router-dom";

function ChatListCard({ chat, onClick }) {
  const lastMessageDate = parseISO(
    chat?.messages[chat?.messages.length - 1].created_at
  ); // Convert ISO string to Date object
  const navigate = useNavigate();

  console.log(chat);

  let displayDate;
  if (isToday(lastMessageDate)) {
    displayDate = "Today";
  } else if (isYesterday(lastMessageDate)) {
    displayDate = "Yesterday";
  } else if (differenceInDays(new Date(), lastMessageDate) < 7) {
    displayDate = format(lastMessageDate, "EEEE"); // Show day of the week (e.g., "Monday")
  } else {
    displayDate = format(lastMessageDate, "MM/dd/yyyy"); // Show date (e.g., "03/03/2025")
  }

  const handleClick = () => {
    const chatPartnerInfo = {
      chatPartnerId: chat.chatPartner.id,
      chatPartnerName: chat.chatPartner.name,
    };

    try {
      navigate(
        `/chat?adType=${chat.ad_type}&adId=${
          chat.ad_id
        }&chatPartnerInfo=${encodeURIComponent(
          JSON.stringify(chatPartnerInfo)
        )}`
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card
      sx={{
        my: "0.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        px: 2,
        borderRadius: "8px",
        boxShadow: "0px 0px 2px 0px rgba(8,87,208,0.25)",
        cursor: "pointer",
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
      }}
      onClick={handleClick}
    >
      <CardHeader
        avatar={
          <Avatar
            src={chat?.photoUrl || "/user.svg"}
            sx={{
              width: { xs: 30, sm: 40, md: 60 },
              height: { xs: 30, sm: 40, md: 60 },
              fontSize: { xs: 30, sm: 20, md: 30 },
            }}
          >
            {chat?.chatPartner.name
              ?.split(" ")
              .map((word) => word.charAt(0))
              .join("")}
          </Avatar>
        }
        title={
          <Typography
            sx={{
              color: "gray.800",
              fontSize: "1rem",
              fontWeight: "600",
            }}
            className="font-dmsans"
          >
            {chat.chatPartner.name} ({chat.ad_type}Ad: {chat.ad_id})
          </Typography>
        }
        subheader={
          <Typography
            sx={{
              color: "#6b7280",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
            className="font-dmsans"
          >
            {chat.messages[chat.messages.length - 1]?.message ||
              "No messages yet."}
          </Typography>
        }
      />

      <Box
        sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
      >
        <Typography
          sx={{
            color: "#6b7280",
            fontSize: "0.75rem",
            lineHeight: "1rem",
          }}
          className="font-dmsans"
        >
          {displayDate}
        </Typography>
        {isToday(lastMessageDate) && (
          <Typography
            sx={{
              color: "#6b7280",
              fontSize: "0.75rem",
              lineHeight: "1rem",
            }}
            className="font-dmsans"
          >
            {format(lastMessageDate, "hh:mm a")} {/* Show time if today */}
          </Typography>
        )}
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
