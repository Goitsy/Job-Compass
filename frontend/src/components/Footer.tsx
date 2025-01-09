import React from "react";
import { Box, Typography, Stack, Link } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "black", // Black background
        color: "white", // White text for contrast
        padding: "40px 20px", // Padding for spacing
        textAlign: "center", // Centered text
        width: "100%", // Ensure it takes up the full width
        position: "relative", // To avoid it being cut off
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={4}
        justifyContent="space-between"
        sx={{
          maxWidth: "1200px", // Maximum width for larger screens
          margin: "0 auto", // Centers the content within the footer
          mb: 4,
        }}
      >
        {/* Job Compass Section */}
        <Box sx={{ maxWidth: 300 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Job Compass
          </Typography>
          <Typography variant="body2">
            Your career navigation tool to help you find, track, and manage job
            applications.
          </Typography>
        </Box>

        {/* Features Section */}
        <Box sx={{ maxWidth: 300 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Features
          </Typography>
          <Typography variant="body2">Application Tracking</Typography>
          <Typography variant="body2">Job Search</Typography>
          <Typography variant="body2">Analytics</Typography>
        </Box>

        {/* Company Section */}
        <Box sx={{ maxWidth: 300 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Company
          </Typography>
          <Typography variant="body2">About Us</Typography>
          <Typography variant="body2">Careers</Typography>
          <Typography variant="body2">Privacy Policy</Typography>
        </Box>

        {/* Connect Section */}
        <Box sx={{ maxWidth: 300 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Connect
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Link href="https://www.facebook.com" color="inherit">
              <Facebook />
            </Link>
            <Link href="https://twitter.com" color="inherit">
              <Twitter />
            </Link>
            <Link href="https://www.instagram.com" color="inherit">
              <Instagram />
            </Link>
          </Box>
        </Box>
      </Stack>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2">
          © 2025 Job Compass, All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
