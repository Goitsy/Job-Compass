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
  IconButton,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Footer from "./Footer";

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
    <>
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          background:
            "linear-gradient(to right, #7c3aed, #ffff, #ffff, #7c3aed)",
          backgroundSize: "400% 400%",
          animation: "shinyEffect 3s ease infinite",
          height: "100vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Cursive', sans-serif",
            fontWeight: "bold",
            color: "#fff",
            mt: 10,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Register Now to start tracking your job applications!
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{ p: 3, flex: "1 1 300px", boxShadow: 5, mt: 10 }}
          >
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
          </Paper>

          <Paper
            elevation={3}
            sx={{ p: 3, flex: "1 1 300px", boxShadow: 5, mt: 18 }}
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
          </Paper>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default RegisterPage;
