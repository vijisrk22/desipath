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

function Profile({ user, viewPortClass = "md:flex hidden" }) {
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
    navigate("/");
  };

  const handleChat = () => {
    handleClose();
    navigate("/chat");
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  if (loading) {
    return <Loader />;
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
                Your Profile
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
