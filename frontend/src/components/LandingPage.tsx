import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  useTheme,
} from "@mui/material";
import office from "../assets/office.jpeg";
import { CheckCircle, BarChart, Notifications } from "@mui/icons-material";

const LandingPage = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          marginBottom: "10%",
          height: { xs: "40vh", md: "90vh" },
          backgroundImage: `url(${office})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            textAlign: "center",
            padding: "20px",
            borderRadius: "8px",
            width: { xs: "90%", sm: "70%", md: "50%" },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
              fontWeight: "bold",
            }}
          >
            Welcome to Job Compass
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            Your ultimate job tracking and management tool.
          </Typography>
        </Box>
      </Box>

      <Container>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mt: 3,
              color: theme.palette.mode === "light" ? "black" : "white",
            }}
          >
            WHY CHOOSE JOBCOMPASS?
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            mt: 4,
          }}
        >
          <Card
            sx={{
              width: { xs: "100%", sm: "45%", md: "30%" },
              minWidth: 250,
              position: "relative",
              padding: "20px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 8,
                  borderRadius: "50%",
                  padding: "5px",
                }}
              >
                <CheckCircle sx={{ fontSize: 20, color: "#7C3AED" }} />
              </Box>
              <Typography variant="h5">Track Applications</Typography>
              <Typography variant="body2">
                Easily track the status of your job applications, from
                submission to interview, ensuring you never miss a step.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: { xs: "100%", sm: "45%", md: "30%" },
              minWidth: 250,
              position: "relative",
              padding: "20px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  position: "absolute",
                  top: 15,
                  left: 8,
                  borderRadius: "50%",
                  padding: "5px",
                }}
              >
                <BarChart sx={{ fontSize: 20, color: "#7C3AED" }} />
              </Box>
              <Typography variant="h5">Analytics</Typography>
              <Typography variant="body2">
                Gain insights into your job search performance, track your
                progress, and optimize your application strategy for success.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: { xs: "100%", sm: "45%", md: "30%" },
              minWidth: 250,
              position: "relative",
              padding: "20px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  position: "absolute",
                  top: 15,
                  left: 8,
                  padding: "5px",
                }}
              >
                <Notifications sx={{ fontSize: 20, color: "#7C3AED" }} />
              </Box>
              <Typography variant="h5">Smart Reminders</Typography>
              <Typography variant="body2">
                Receive timely notifications for your job application deadlines,
                interviews, and follow-up reminders to stay ahead.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Box
        sx={{
          backgroundColor: "#7C3AED",
          color: "white",
          padding: "20px 0",
          display: "flex",
          justifyContent: "center",
          gap: 4,
          width: "100%",
          marginTop: "2rem",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            10,000
          </Typography>
          <Typography variant="body2">Users</Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            85,000
          </Typography>
          <Typography variant="body2">Applications Tracked</Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            85%
          </Typography>
          <Typography variant="body2">Success Rate</Typography>
        </Box>
      </Box>
    </>
  );
};

export default LandingPage;
