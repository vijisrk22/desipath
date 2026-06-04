import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar
} from "@mui/material";
import { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/UserSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { getFullImageUrl } from "../../utils/imageHelper";

function Profile({ user, viewPortClass = "md:flex hidden", isStatic = false, onMenuClick = null }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleClose();
    if (onMenuClick) onMenuClick();
    navigate("/");
  };

  const handleChat = () => {
    handleClose();
    if (onMenuClick) onMenuClick();
    navigate("/chat");
  };

  const handleProfile = () => {
    handleClose();
    if (onMenuClick) onMenuClick();
    navigate("/profile");
  };

  const handleMyAdsClick = () => {
    handleClose();
    if (onMenuClick) onMenuClick();
    navigate("/postad");
  };

  if (loading) {
    return <Loader />;
  }

  if (isStatic) {
    return (
      <div className={`${viewPortClass} flex flex-col items-center w-full pb-8 px-6`}>
        {/* Avatar centered */}
        <div className="flex items-center justify-center mb-4">
          {(user?.profile_photo || user?.photoUrl) ? (
            <Avatar
              src={getFullImageUrl(user.profile_photo || user.photoUrl)}
              alt={user?.name || "User Avatar"}
              sx={{ width: 64, height: 64, border: "2px solid #e5e7eb" }}
            />
          ) : (
            <AccountCircle sx={{ fontSize: 64, color: "#9ca3af" }} />
          )}
        </div>

        {/* Static Menu Container */}
        <Box
          sx={{
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            width: "100%",
            maxWidth: "280px",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Your Profile */}
          <MenuItem
            onClick={handleProfile}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              fontWeight: "bold",
              fontSize: "1.1rem",
              py: 1.5,
              color: "#1f2937",
              textAlign: "center",
              borderRadius: "12px",
              '&:hover': {
                backgroundColor: '#f3f4f6'
              }
            }}
          >
            My Profile
          </MenuItem>

          {/* My Ads */}
          <MenuItem
            onClick={handleMyAdsClick}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              mt: 1.5,
              py: 1.5,
              px: 2,
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(255, 164, 28, 0.05)'
              }
            }}
          >
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937' }}>
              My Ads
            </Typography>
            <Box 
              sx={{ 
                mt: 1,
                color: '#1a2e05', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                fontSize: '0.8rem', 
                background: '#bef264', 
                px: 3, 
                py: 1, 
                borderRadius: '8px', 
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(190, 242, 100, 0.4)',
                border: '1px solid #a3e635'
              }}
            >
              POST AD FREE
            </Box>
          </MenuItem>

          {/* Logout */}
          <MenuItem
            onClick={handleLogout}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 2,
              fontWeight: "bold",
              fontSize: "1.1rem",
              py: 1.5,
              color: "red",
              textAlign: "center",
              borderRadius: "12px",
              '&:hover': {
                backgroundColor: '#fef2f2'
              }
            }}
          >
            Logout
          </MenuItem>
        </Box>
      </div>
    );
  }

  return (
    <div className={`${viewPortClass}`}>
      {user && (
        <div className="flex items-center justify-center gap-2">
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="gray"
            sx={{ p: 0.5 }}
          >
            {(user?.profile_photo || user?.photoUrl) ? (
              <Avatar
                src={getFullImageUrl(user.profile_photo || user.photoUrl)}
                alt={user?.name || "User Avatar"}
                sx={{ width: 48, height: 48, border: "2px solid #e5e7eb" }}
              />
            ) : (
              <AccountCircle sx={{ fontSize: 48 }} />
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <Box sx={{ px: 3, py: 2, minWidth: 200 }}>
              <MenuItem
                onClick={handleProfile}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  fontWeight: "bold",
                }}
              >
                My Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/postad");
                }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 2,
                  py: 1,
                  px: 2,
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 164, 28, 0.05)'
                  }
                }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>My Ads</Typography>
                <Box 
                  sx={{ 
                    mt: 0.5,
                    color: '#1a2e05', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    fontSize: '0.7rem', 
                    background: '#bef264', 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: '6px', 
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(190, 242, 100, 0.4)',
                    border: '1px solid #a3e635'
                  }}
                >
                  Post Ad FREE
                </Box>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Logout
              </MenuItem>
            </Box>
          </Menu>
        </div>
      )}
    </div>
  );
}

export default Profile;
