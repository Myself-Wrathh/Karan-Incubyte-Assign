import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { makeConnection } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import sweetsRoutes from "./routes/sweet.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_PATH,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Sweet Shop API is running",
    timestamp: new Date().toISOString(),
  });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await makeConnection();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Testing ke liye kr skte h :)
export default app;
