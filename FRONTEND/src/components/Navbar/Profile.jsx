import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/UserSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

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
          >
            <AccountCircle sx={{ fontSize: 48 }} />
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
                onClick={handleChat}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  fontWeight: "bold",
                }}
              >
                Chat
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
