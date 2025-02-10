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

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
const SignInPage = () => {
  const { mode } = useContext(ThemeContext);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const response = await axios.post("/api/auth/login", signInData);



      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user?.name || "User");

        console.log("Sign In Success:", response.data);
        navigate("/home"); // 🔥 Уверих се, че навигацията е правилна
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Sign In Error:", error);
      alert("Sign-in failed. Please check your email and password.");
    }
  };


  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    if (user && user.displayName && user.email) {
      try {

        const response = await axios.post("/api/auth/google-login", {
          name: user.displayName,
          email: user.email,
        });

        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.displayName || "User");

        navigate("/home");
      } else {
        throw new Error("Google login failed: Missing user details.");
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
    }
  };

+
  const handleFacebookLogin = async () => {
    const user = await signInWithFacebook();
    if (user && user.displayName && user.email) {
      try {

        const response = await axios.post("/api/auth/facebook-login", {
          name: user.displayName,
          email: user.email,
        });


        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.displayName || "User");

        navigate("/home");
      }
    } catch (error) {
      console.error("Facebook Sign In Error:", error);
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
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          borderRadius: "12px",
          backgroundColor: mode === "light" ? "#fff" : "#222",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: mode === "light" ? "#4c4f8c" : "#ffffff" }}
        >
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

          {/* WOW Sign In Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              background: "linear-gradient(135deg, #9B51E0, #7C3AED)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "8px",
              "&:hover": { transform: "scale(1.05)" },
              "&:active": { transform: "scale(0.95)" },
            }}
          >
            SIGN IN
          </Button>

          {/* Google & Facebook Buttons */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <IconButton
                onClick={handleGoogleSignIn}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  "&:hover": { transform: "scale(1.05)" },
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                <GoogleIcon sx={{ color: "#ff0000" }} />
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <IconButton
                onClick={handleFacebookSignIn}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  "&:hover": { transform: "scale(1.05)" },
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                <FacebookIcon sx={{ color: "#1877F2" }} />
              </IconButton>
            </Grid>
          </Grid>

          <Typography sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Button
              onClick={() => navigate("/auth/register")}
              sx={{
                color: "#7C3AED",
                fontWeight: "bold",
                "&:hover": { transform: "scale(1.05)" },
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              REGISTER
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default SignInPage;
