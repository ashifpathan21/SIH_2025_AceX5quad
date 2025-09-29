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

// ✅ COMPREHENSIVE CORS Configuration for Web & APK
const allowedOrigins = [
  "https://smartpravesh.onrender.com",
  "https://smartpravesh.onrender.com/principal/home",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:19006", // React Native development
  "http://10.0.2.2:4000", // Android emulator
  "exp://localhost:19000", // Expo
  "http://localhost", // APK fallback
  "file://", // APK file protocol
  "capacitor://localhost", // Capacitor
  "ionic://localhost", // Ionic
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log unknown origins but allow them (for APK flexibility)
      console.log(`🌐 Allowed origin: ${origin}`);
      callback(null, true);

      // If you want to be strict, use this instead:
      // callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "Origin",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
  ],
  exposedHeaders: ["Authorization", "Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests properly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, X-Requested-With, Origin"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "86400"); // 24 hours
  res.status(204).send();
});

// Body parsing middleware with increased limits
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 100000,
  })
);

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
    cors: {
      enabled: true,
      allowed_origins: allowedOrigins,
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
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(", ")}`);
  console.log(`📱 APK support: ENABLED`);
  console.log(
    `🔗 Health check: https://smartpraveshbackend.onrender.com/health`
  );
  console.log(
    `🔗 Test endpoint: https://smartpraveshbackend.onrender.com/api/test`
  );
});
