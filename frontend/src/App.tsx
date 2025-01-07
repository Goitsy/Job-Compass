import React from "react";
import { Box, Button, Typography } from "@mui/material";

const App = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Job Compass!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Track your job applications with ease. 🚀
      </Typography>
      <Button variant="contained" color="primary" href="/register">
        Get Started
      </Button>
    </Box>
  );
};

export default App;
