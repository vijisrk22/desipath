import { Avatar, Box, Button } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import VideocamIcon from "@mui/icons-material/Videocam";

import { useSearchParams } from "react-router-dom";

function ChatScreenHeader({ adId, adType }) {
  const [searchParams] = useSearchParams();
  const chatPartnerInfo = JSON.parse(
    decodeURIComponent(searchParams.get("chatPartnerInfo"))
  );
  // Ensure chatPartner is available before attempting to render its information
  const avatarSrc = ""; // Default to an empty string if no photoUrl

  console.log("Chat Partner Info:", chatPartnerInfo);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid #E4E4E7",
      }}
    >
      <Box
        sx={{
          gap: "24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          src={avatarSrc}
          sx={{
            width: { xs: 40, sm: 60, md: 70, lg: 80, xl: 90 },
            height: { xs: 40, sm: 60, md: 70, lg: 80, xl: 90 },
          }}
        />
        <Box>
          <div className="text-gray-800 text-xl md:text-2xl font-semibold font-dmsans">
            {chatPartnerInfo?.chatPartnerName || "Unknown User"}
          </div>
          <div className="text-gray-500 text-xs md:text-sm font-normal font-dmsans">
            {adType.charAt(0).toUpperCase() + adType.slice(1)} Advertisement ID:{" "}
            {adId || "Unknown Ad ID"}
          </div>
          <div className="text-gray-500 text-xs md:text-sm font-normal font-dmsans">
            {chatPartnerInfo?.chatPartnerLocation || "Unknown Location"}
          </div>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <Button color="gray">
          <LocalPhoneIcon
            sx={{
              width: { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 },
              height: { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 },
              color: "#1D4ED8",
            }}
          />
        </Button>

        <Button color="gray">
          <VideocamIcon
            sx={{
              width: { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 },
              height: { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 },
              color: "#1D4ED8",
            }}
          />
        </Button>
      </Box>
    </Box>
  );
}

export default ChatScreenHeader;
