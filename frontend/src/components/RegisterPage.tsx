import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9889/api/auth/register",
        registerData
      );
      alert("Registration successful! Please sign in.");
      console.log("Register Success:", response.data);

      setRegisterData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Register Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9889/api/auth/login",
        signInData
      );
      console.log("Login response:", response.data);
      const { token, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);

      console.log("Sign In Success:", response.data);

      // Clear the sign-in form
      setSignInData({ email: "", password: "" });
      navigate("/home"); //HERE(WE ARE USING useNavigate() to help us access protected home route)
    } catch (error) {
      console.error("Sign In Error:", error);
      alert("Sign-in failed. Check your credentials and try again.");
    }
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          mt: 4,
          ml: 20,
        }}
      >
        <Paper elevation={3} sx={{ p: 3, flex: "1 1 300px" }}>
          <Typography variant="h5" gutterBottom>
            Sign In
          </Typography>
          <form onSubmit={handleSignInSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={signInData.email}
              onChange={handleSignInChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={signInData.password}
              onChange={handleSignInChange}
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
              Sign In
            </Button>
          </form>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, flex: "1 1 300px" }}>
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
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default RegisterPage;
