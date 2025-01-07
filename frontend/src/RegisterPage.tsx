import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const RegisterPage = () => {
  return (
    <Box sx={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      <form>
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: "1rem" }}
        >
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default RegisterPage;

