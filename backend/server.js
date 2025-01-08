import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "./config/db.js";
import authRoutes from "./routes/auth.js";

// App Config
dotenv.config();
connect();
const app = express();
const PORT = process.env.PORT || 6000;

// middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.use("/api/auth", authRoutes);
// app.get("/", (req, res) => {
//   res.send("API Woriking");
// });

// server point
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AND CONNECTED WITH DB: ${PORT}`);
});
