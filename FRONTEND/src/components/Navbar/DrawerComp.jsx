import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import SignInUp from "./SignInUp";
import Profile from "./Profile";

function DrawerComp({ navPages, setValue }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  let currentPath = location.pathname.replace("/", "").toLowerCase();

  function handleClick(page) {
    setOpenDrawer(!openDrawer);

    let path = page.replace(" ", "").toLowerCase();
    navigate(`/${path}`);
  }
  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor="top"
      >
        <Box sx={{ display: "flex", mb: "-2rem", mt: "1rem", mr: "1rem" }}>
          <Button
            sx={{ ml: "auto", color: "gray" }}
            onClick={() => setOpenDrawer(false)}
          >
            X
          </Button>
        </Box>

        <List sx={{ mx: "auto" }}>
          {navPages.map((page, index) => {
            const path = page.replace(" ", "").toLowerCase();

            if (currentPath == "") {
              currentPath = "home";
            }
            const isActive = path === currentPath;
            return (
              <ListItemButton
                key={page}
                onClick={() => handleClick(page)}
                sx={{
                  fontSize: "1rem",
                  backgroundColor: isActive ? "#1976d2" : "transparent", // Blue if active
                  color: isActive ? "white" : "inherit",
                  padding: "0.5rem 2.5rem",
                  borderRadius: "2rem",
                }}
              >
                <ListItemText sx={{ textAlign: "center" }}>{page}</ListItemText>
              </ListItemButton>
            );
          })}
        </List>

        {user ? (
          <Profile user={user} viewPortClass="md:hidden" />
        ) : (
          <Box sx={{ my: "1rem", mx: "auto" }}>
            <SignInUp viewPortClass="flex md:hidden" />
          </Box>
        )}
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon sx={{ color: "#FFA41C" }} />
      </IconButton>
    </>
  );
}

export default DrawerComp;
