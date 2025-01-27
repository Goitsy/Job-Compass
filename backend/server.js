import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import jobAppRoutes from "./routes/jobAppRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connect();
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5177",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobapp", jobAppRoutes);
app.use("/api", analyticsRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
