import React from "react";
import { Box, Typography, Button } from "@mui/material";

const HeroSection = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "100px 20px",
        backgroundColor: "#6C63FF",
        color: "#fff",
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Welcome to Job Compass
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 4 }}>
        Your journey to tracking job applications starts here. 🚀
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#FF5722",
          color: "#fff",
          padding: "10px 20px",
          fontSize: "1rem",
          "&:hover": { backgroundColor: "#E64A19" },
        }}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default HeroSection;
