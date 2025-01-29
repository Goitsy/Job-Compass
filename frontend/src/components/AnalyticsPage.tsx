import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type AnalyticsData = {
  total: number;
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

  useEffect(() => {
    axios
      .get("http://localhost:2000/api/analytics")
      .then((response) => {
        setAnalytics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching analytics:", error);
      });
  }, []);

  if (!analytics) return <Typography>Loading...</Typography>;

  const sortedMonths = Object.keys(analytics.monthly).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const monthlyLabels = sortedMonths.map((month) =>
    new Date(month).toLocaleString("default", {
      month: "short",
      year: "numeric",
    })
  );

  const sortedYears = Object.keys(analytics.yearly).sort();
  const yearlyLabels = sortedYears;

  const monthlyApplicationStatuses = {
    applied: sortedMonths.map((month) => analytics.monthly[month].applied),
    interview: sortedMonths.map((month) => analytics.monthly[month].interview),
    inReview: sortedMonths.map((month) => analytics.monthly[month].inReview),
    rejected: sortedMonths.map((month) => analytics.monthly[month].rejected),
  };

  const yearlyApplicationStatuses = {
    applied: sortedYears.map((year) => analytics.yearly[year].applied),
    interview: sortedYears.map((year) => analytics.yearly[year].interview),
    inReview: sortedYears.map((year) => analytics.yearly[year].inReview),
    rejected: sortedYears.map((year) => analytics.yearly[year].rejected),
  };

  const percentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const lastMonthKey = sortedMonths.slice(-2, -1)[0];
  const currentMonthKey = sortedMonths.slice(-1)[0];
  const lastMonthValue = analytics.monthly[lastMonthKey] || {
    applied: 0,
    interview: 0,
    inReview: 0,
    rejected: 0,
  };
  const currentMonthValue = analytics.monthly[currentMonthKey] || {
    applied: 0,
    interview: 0,
    inReview: 0,
    rejected: 0,
  };

  const cards = [
    {
      title: "Total Applications",
      value: analytics.total,
      lastMonth:
        lastMonthValue.applied +
        lastMonthValue.interview +
        lastMonthValue.inReview +
        lastMonthValue.rejected,
    },
    {
      title: "Applied Applications",
      value: currentMonthValue.applied,
      lastMonth: lastMonthValue.applied,
    },
    {
      title: "Interview Applications",
      value: currentMonthValue.interview,
      lastMonth: lastMonthValue.interview,
    },
    {
      title: "In Review Applications",
      value: currentMonthValue.inReview,
      lastMonth: lastMonthValue.inReview,
    },
    {
      title: "Rejected Applications",
      value: currentMonthValue.rejected,
      lastMonth: lastMonthValue.rejected,
    },
  ];

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ p: 4, mt: 15 }} gutterBottom>
          Analytics Overview
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "flex-start", mb: 4 }}
        >
          {cards.map((card, index) => {
            const change = percentageChange(
              card.value,
              card.lastMonth
            ).toString();
            const isPositive = parseFloat(change) >= 0;

            return (
              <Grid item xs={8} sm={6} md={4} key={index}>
                <Paper sx={{ p: 3, position: "relative", overflow: "hidden" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      color: isPositive ? "green" : "red",
                    }}
                  >
                    {isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  </Box>

                  <Typography variant="h6">{card.title}</Typography>
                  <Typography variant="h4">{card.value}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: isPositive ? "green" : "red" }}
                  >
                    {isPositive ? "+" : ""}
                    {change}% since last month
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              {view === "monthly" ? "Monthly" : "Yearly"} Applications Chart
            </Typography>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, newView) => setView(newView)}
              aria-label="view"
            >
              <ToggleButton value="monthly" aria-label="monthly">
                Monthly
              </ToggleButton>
              <ToggleButton value="yearly" aria-label="yearly">
                Yearly
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Bar
            data={{
              labels: view === "monthly" ? monthlyLabels : yearlyLabels,
              datasets: [
                {
                  label: "Applied Applications",
                  data:
                    view === "monthly"
                      ? monthlyApplicationStatuses.applied
                      : yearlyApplicationStatuses.applied,
                  backgroundColor: "#248ae7", // Blue for "Applied"
                  borderColor: "darkblue",
                  borderWidth: 2,
                  borderRadius: 5,
                  barThickness: 50,
                },
                {
                  label: "Interview Applications",
                  data:
                    view === "monthly"
                      ? monthlyApplicationStatuses.interview
                      : yearlyApplicationStatuses.interview,
                  backgroundColor: "#58BA51",
                  borderColor: "darkgreen",
                  borderWidth: 2,
                  borderRadius: 5,
                  barThickness: 50,
                },
                {
                  label: "In Review Applications",
                  data:
                    view === "monthly"
                      ? monthlyApplicationStatuses.inReview
                      : yearlyApplicationStatuses.inReview,
                  backgroundColor: "#6d46d2",
                  borderWidth: 2,
                  borderRadius: 5,
                  barThickness: 50,
                },
                {
                  label: "Rejected Applications",
                  data:
                    view === "monthly"
                      ? monthlyApplicationStatuses.rejected
                      : yearlyApplicationStatuses.rejected,
                  backgroundColor: "red",
                  borderColor: "darkred",
                  borderWidth: 2,
                  borderRadius: 5,
                  barThickness: 50,
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
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) =>
                      `${tooltipItem.raw} applications in ${tooltipItem.label}`,
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: view === "monthly" ? "Months" : "Years",
                    color: "#333",
                    font: { size: 14, weight: "bold" },
                  },
                  grid: {
                    display: false,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Number of Applications",
                    color: "#333",
                    font: { size: 14, weight: "bold" },
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default AnalyticsPage;
