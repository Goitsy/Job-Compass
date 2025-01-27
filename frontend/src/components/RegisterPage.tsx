import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  IconButton,
  Grid,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { ThemeContext } from "../state/ThemeContext";

const RegisterPage = () => {
  const { mode } = useContext(ThemeContext);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(

        "http://localhost:5005/api/auth/register",

        registerData
      );
      alert("Registration successful! Please sign in.");
      console.log("Register Success:", response.data);

      setRegisterData({ name: "", email: "", password: "" });
      navigate("/auth/signin");
    } catch (error) {
      console.error("Register Error:", error);
      alert("Registration failed. Please try again.");
    }
  };


  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5005/api/auth/login",
        signInData
      );
      console.log("Login response:", response.data);
      const { token, user } = response.data;
      const { name } = user;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);

      console.log("Sign In Success:", response.data);

      setSignInData({ email: "", password: "" });
      navigate("/home");
    } catch (error) {
      console.error("Sign In Error:", error);
      alert("Sign-in failed. Check your credentials and try again.");
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background:
          mode === "light"
            ? "linear-gradient(to bottom, #4c4f8c, #b87dd8)"
            : "linear-gradient(to bottom, #121212, #1f1f1f)",
        backgroundSize: "400% 400%",
        animation: "shinyEffect 3s ease infinite",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegisterSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={registerData.name}
            onChange={handleRegisterChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={registerData.password}
            onChange={handleRegisterChange}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                color="primary"
              />
            }
            label="Show Password"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Register
          </Button>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Box sx={{ width: "100%" }}>
                <IconButton color="error" sx={{ width: "100%" }}>
                  <GoogleIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ width: "100%" }}>
                <IconButton color="primary" sx={{ width: "100%" }}>
                  <FacebookIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </form>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button onClick={() => navigate("/auth/signin")}>Sign In</Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
