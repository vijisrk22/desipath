import { Avatar, Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMemo } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";

function ChatScreenHeader({ adId, adType }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const chatPartnerInfo = useMemo(() => {
    const raw = searchParams.get("chatPartnerInfo");
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch (err) {
      console.error("Error parsing chatPartnerInfo in Header:", err);
      return null;
    }
  }, [searchParams]);

  // Ensure chatPartner is available before attempting to render its information
  const avatarSrc = ""; // Default to an empty string if no photoUrl

  const handleBack = () => {
    navigate('/inbox');
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f3f4f6",
        zIndex: 10
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
        <IconButton 
          onClick={handleBack}
          sx={{ display: { xs: 'flex', lg: 'none' }, color: "#4b5563", p: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Avatar
          src={avatarSrc}
          sx={{
            width: 48,
            height: 48,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "2px solid #fff",
            backgroundColor: "#eff6ff",
            color: "#2563eb",
            fontWeight: "bold"
          }}
        >
          {chatPartnerInfo?.chatPartnerName?.charAt(0)}
        </Avatar>
        <Box>
          <Typography
            sx={{
              color: "#111827",
              fontSize: "1.05rem",
              fontWeight: "700",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {chatPartnerInfo?.chatPartnerName || "User"}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                px: 1, 
                py: 0.25, 
                borderRadius: "4px", 
                backgroundColor: "#dcfce7", 
                fontSize: "0.6rem", 
                color: "#166534",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}
            >
              {adType}
            </Box>
            <Typography
              sx={{
                color: "#9ca3af",
                fontSize: "0.75rem",
                fontWeight: "500",
              }}
            >
              ID: {adId}
            </Typography>
          </Box>
        </Box>
      </Box>


    </Box>
  );
}

export default ChatScreenHeader;
