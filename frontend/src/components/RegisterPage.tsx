import { Box, Typography, TextField, Button, Grid } from "@mui/material";

const RegisterPage = () => {
  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: "#6C63FF", // Основно лилаво за фона
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "800px",
          backgroundColor: "#ffffff", // Бяло за фона на формите
          borderRadius: "12px",
          display: "flex",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Лека сянка
        }}
      >
        {/* Лява страна */}
        <Box
          sx={{
            flex: 1,
            padding: 4,
            backgroundColor: "#6C63FF", // Лилаво за лявата секция
            color: "#ffffff", // Бял текст
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" gutterBottom>
            Track your job search journey
          </Typography>
          <form>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              fullWidth
              sx={{
                marginTop: "1rem",
                backgroundColor: "#FF5722", // Оранжев бутон
                color: "#ffffff",
              }}
            >
              Sign In
            </Button>
          </form>
        </Box>

        {/* Дясна страна */}
        <Box
          sx={{
            flex: 1,
            padding: 4,
            backgroundColor: "#ffffff", // Бяло за дясната част
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            New to Job Compass?
          </Typography>
          <Typography variant="body1" gutterBottom>
            Create an account and start your journey
          </Typography>
          <form>
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              fullWidth
              sx={{
                marginTop: "1rem",
                backgroundColor: "#6C63FF", // Лилав бутон
                color: "#ffffff",
              }}
            >
              Create Account
            </Button>
          </form>
        </Box>
      </Box>
    </Grid>
  );
};

export default RegisterPage;
