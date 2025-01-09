import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Switch,
  Drawer,
  IconButton,
} from "@mui/material";
import { WbSunny, Brightness4, Menu, Close } from "@mui/icons-material"; // Icons for light/dark mode and hamburger menu
import { ThemeContext } from "../state/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom"; // To navigate between pages

const Navbar = () => {
  const { mode, toggleMode } = useContext(ThemeContext); // Access theme context
  const navigate = useNavigate(); // Navigation handler
  const location = useLocation(); // Get the current location (route)

  // State for mobile menu
  const [openMenu, setOpenMenu] = useState(false);

  // Check if the user is logged in by looking for a token in localStorage
  const isLoggedIn = !!localStorage.getItem("token");

  // Navigate to different pages
  const goToHome = () => navigate("/home");
  const goToAnalytics = () => navigate("/analytics");
  const goToSettings = () => navigate("/settings");

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    navigate("/"); // Redirect to the landing page
  };

  // Open/close the mobile menu
  const toggleMenu = () => setOpenMenu(!openMenu);

  // Don't show menu items on landing or auth page
  const hideMenu = location.pathname === "/" || location.pathname === "/auth";

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#7C3AED",
        color: "white",
        padding: "10px 20px",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo and App Name */}
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", cursor: "pointer" }}
        onClick={goToHome}
      >
        Job Compass
      </Typography>

      {/* Mobile Hamburger Menu */}
      <IconButton
        sx={{ display: { xs: "block", sm: "none" } }}
        onClick={toggleMenu}
      >
        <Menu sx={{ color: "white" }} />
      </IconButton>

      {/* Drawer for mobile menu */}
      <Drawer anchor="right" open={openMenu} onClose={toggleMenu}>
        <Box sx={{ width: 250, p: 2 }}>
          <IconButton onClick={toggleMenu}>
            <Close sx={{ color: "black" }} />
          </IconButton>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {isLoggedIn ? (
              <>
                <Button onClick={goToHome}>Home</Button>
                <Button onClick={goToAnalytics}>Analytics</Button>
                <Button onClick={goToSettings}>Settings</Button>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                Sign In / Register
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Desktop Menu */}
      <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
        {/* If on the Landing or Auth page, only show Sign In/Register */}
        {hideMenu ? (
          <Button sx={{ color: "white" }} onClick={() => navigate("/auth")}>
            Sign In / Register
          </Button>
        ) : (
          <>
            {isLoggedIn ? (
              <>
                <Button sx={{ color: "white" }} onClick={goToHome}>
                  Home
                </Button>
                <Button sx={{ color: "white" }} onClick={goToAnalytics}>
                  Analytics
                </Button>
                <Button sx={{ color: "white" }} onClick={goToSettings}>
                  Settings
                </Button>
                <Button sx={{ color: "white" }} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button sx={{ color: "white" }} onClick={() => navigate("/auth")}>
                Sign In / Register
              </Button>
            )}
          </>
        )}
        {/* Light/Dark Mode Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {mode === "light" && <WbSunny sx={{ color: "white" }} />}
          {mode === "dark" && <Brightness4 sx={{ color: "white" }} />}
          <Switch
            checked={mode === "dark"}
            onChange={toggleMode}
            inputProps={{ "aria-label": "light/dark mode toggle" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
