import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkIcon from "@mui/icons-material/Work";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type AnalyticsData = {
  total: number;
  applied: number;
  interview: number;
  inReview: number;
  rejected: number;
  monthly: Record<
    string,
    { applied: number; interview: number; inReview: number; rejected: number }
  >;
  yearly: Record<
    string,
    { applied: number; interview: number; inReview: number; rejected: number }
  >;
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:2000/api/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setAnalytics(response.data))
      .catch((error) => console.error("Error fetching analytics:", error));
  }, []);

  if (!analytics) return <Typography>Loading...</Typography>;

  const cards = [
    { title: "Total Applications", value: analytics.total, icon: <WorkIcon /> },
    {
      title: "Applied Applications",
      value: analytics.applied,
      icon: <HowToRegIcon />,
    },
    {
      title: "Interview Applications",
      value: analytics.interview,
      icon: <TrendingUpIcon sx={{ color: "green" }} />,
    },
    {
      title: "In Review Applications",
      value: analytics.inReview,
      icon: <HourglassEmptyIcon />,
    },
    {
      title: "Rejected Applications",
      value: analytics.rejected,
      icon: <CancelIcon sx={{ color: "red" }} />,
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          p: 2,
          mt: 4,
          mb: 6,
        }}
        gutterBottom
      >
        Analytics Overview
      </Typography>

      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Box>
                {card.icon}
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="h4">{card.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 15, mb: 20 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => setView(newView || "monthly")}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="yearly">Yearly</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ width: "100%", maxWidth: "75%", margin: "0 auto" }}>
          <Bar
            data={{
              labels:
                view === "monthly"
                  ? Object.keys(analytics.monthly)
                  : Object.keys(analytics.yearly),
              datasets: [
                {
                  label: "Applied",
                  data:
                    view === "monthly"
                      ? Object.values(analytics.monthly).map((m) => m.applied)
                      : Object.values(analytics.yearly).map((y) => y.applied),
                  backgroundColor: "#248ae7",
                },
                {
                  label: "Interview",
                  data:
                    view === "monthly"
                      ? Object.values(analytics.monthly).map((m) => m.interview)
                      : Object.values(analytics.yearly).map((y) => y.interview),
                  backgroundColor: "#58BA51",
                },
                {
                  label: "In Review",
                  data:
                    view === "monthly"
                      ? Object.values(analytics.monthly).map((m) => m.inReview)
                      : Object.values(analytics.yearly).map((y) => y.inReview),
                  backgroundColor: "#6d46d2",
                },
                {
                  label: "Rejected",
                  data:
                    view === "monthly"
                      ? Object.values(analytics.monthly).map((m) => m.rejected)
                      : Object.values(analytics.yearly).map((y) => y.rejected),
                  backgroundColor: "red",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
