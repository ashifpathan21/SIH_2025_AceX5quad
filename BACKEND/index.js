import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connect } from "./utils/db.js";

// Routes imports
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


app.use(
  cors({
    origin: true, // sab origin allow
    credentials: true, // cookies/auth headers allow
  })
);

app.use(express.json());



// Request logging middleware
app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.originalUrl}`);
  console.log(`📱 Origin: ${req.headers.origin || "No origin (APK/Local)"}`);
  console.log(`📨 User-Agent: ${req.headers["user-agent"] || "Unknown"}`);
  next();
});

// ✅ API Routes
app.use("/api/auth/principal", principalRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/foodmenu", foodMenuRoutes);
app.use("/api/attendance", attendanceRoutes);

// ✅ APK-Specific Endpoints (if needed)
app.get("/api/apk/status", (req, res) => {
  res.json({
    status: "active",
    server: "SmartPravesh Backend",
    compatible: true,
    timestamp: new Date().toISOString(),
    message: "APK connectivity confirmed",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "SmartPravesh API",
    timestamp: new Date().toISOString(),
    cors: "enabled",
    apk_support: true,
    database: "connected",
  });
});

// Test endpoint for CORS and APK
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working!",
    origin: req.headers.origin || "No origin (APK/Postman)",
    userAgent: req.headers["user-agent"] || "Unknown client",
    timestamp: new Date().toISOString(),
  });
});

// Public API info endpoint
app.get("/api/info", (req, res) => {
  res.json({
    name: "SmartPravesh API",
    version: "1.0.0",
    description: "Automated Attendance System Backend",
    supports: ["Web", "Android APK", "React Native"],
    endpoints: {
      auth: "/api/auth/principal",
      schools: "/api/schools",
      students: "/api/students",
      teachers: "/api/teachers",
      classes: "/api/classes",
      attendance: "/api/attendance",
      foodMenu: "/api/foodmenu",
    },
   
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
    available_endpoints: [
      "/api/auth/principal",
      "/api/schools",
      "/api/students",
      "/api/teachers",
      "/api/classes",
      "/api/attendance",
      "/api/foodmenu",
      "/health",
      "/api/test",
      "/api/info",
    ],
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("🚨 Global Error Handler:", error);

  // CORS error handling
  if (error.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: "Cross-origin request blocked",
      details: error.message,
    });
  }

  res.status(error.status || 500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : error.message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
});

// Start server with 0.0.0.0 binding for Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port: ${PORT}`);
  console.log(
    `🔗 Health check: https://smartpraveshbackend.onrender.com/health`
  );
  console.log(
    `🔗 Test endpoint: https://smartpraveshbackend.onrender.com/api/test`
  );
});
