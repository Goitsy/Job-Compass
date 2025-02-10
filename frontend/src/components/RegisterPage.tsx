import { useState, useContext } from "react";
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
import { signInWithGoogle } from "../firebaseConfig";
import {
  getAuth,
  FacebookAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
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
      const response = await axios.post("/api/auth/register", registerData);
      alert("Registration successful! Please sign in.");
      console.log("Register Success:", response.data);

      setRegisterData({ name: "", email: "", password: "" });
      navigate("/auth/signin");
    } catch (error) {
      console.error("Register Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleGoogleRegister = async () => {
    const user = await signInWithGoogle();
    if (user && user.displayName && user.email) {
      try {
        const response = await axios.post("/api/auth/google-register", {
          name: user.displayName,
          email: user.email,
        });
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.displayName);

        navigate("/auth/signin");
      } catch (error) {
        console.error("Google Register Backend Error:", error);
      }
    } else {
      console.error("Google login failed: Missing user details.");
    }
  };
  const handleFacebookRegister = async () => {
    try {
      const userCredential: UserCredential = await signInWithPopup(
        getAuth(),
        new FacebookAuthProvider()
      );
      const user = userCredential.user;

      if (user && user.displayName && user.email) {
        const response = await axios.post("/api/auth/facebook-register", {
          name: user.displayName,
          email: user.email,
        });
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.displayName);

        navigate("/auth/signin");
      }
    } catch (error) {
      console.error("Facebook Register Error:", error);
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
            <Grid item xs={12}>
              <Box sx={{ width: "100%" }}>
                <IconButton
                  color="error"
                  sx={{ width: "100%" }}
                  onClick={handleGoogleRegister}
                >
                  <GoogleIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ width: "100%" }}>
                <IconButton
                  color="primary"
                  sx={{ width: "100%" }}
                  onClick={handleFacebookRegister}
                >
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
