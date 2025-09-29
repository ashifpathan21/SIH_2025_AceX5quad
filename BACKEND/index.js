import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connect } from "./utils/db.js";

// Routes imports...
import attendanceRoutes from "./routes/attendanceRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import foodMenuRoutes from "./routes/foodMenuRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import principalRoutes from "./routes/principalRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

config();
connect();

const PORT = process.env.PORT || 4000;
const app = express();

// ✅ CORS Configuration
app.use(
  cors({
    origin: [
      "https://smartpravesh.onrender.com",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Allow-Origin",
    ],
    exposedHeaders: ["set-cookie"],
    maxAge: 86400, // 24 hours
  })
);

// Increase payload limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware: log every request
app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.originalUrl}`);
  console.log(`📨 Headers:`, req.headers);
  next();
});

// ✅ Routes
app.use("/api/auth/principal", principalRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/foodmenu", foodMenuRoutes);
app.use("/api/attendance", attendanceRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Automated Attendance System API is running...",
    cors: "enabled",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    cors: "enabled",
    timestamp: new Date().toISOString(),
  });
});

// Test CORS endpoint
app.get("/api/test-cors", (req, res) => {
  res.json({
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("🚨 Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port: ${PORT}`);
  console.log(`🌐 CORS enabled for:`);
  console.log(`   - https://smartpravesh.onrender.com`);
  console.log(`   - http://localhost:3000`);
  console.log(`   - http://localhost:5173`);
});
