import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connect } from "./utils/db.js";

// 🛣️ Routes
import attendanceRoutes from "./routes/attendanceRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import foodMenuRoutes from "./routes/foodMenuRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import principalRoutes from './routes/principalRoutes.js'
import teacherRoutes from "./routes/teacherRoutes.js";

config();
connect();

const PORT = process.env.PORT || 4000;
const app = express();

// ✅ Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

app.use(express.json());
// Middleware: log every request
app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.originalUrl}`);
  next();
});
// ✅ Routes
app.use("/api/auth/principal", principalRoutes);//done
app.use("/api/schools", schoolRoutes); //done
app.use("/api/classes", classRoutes);//done
app.use("/api/teachers", teacherRoutes);//done
app.use("/api/students", studentRoutes);//done
app.use("/api/foodmenu", foodMenuRoutes);//done
app.use("/api/attendance", attendanceRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Automated Attendance System API is running...");
});

// Start server
app.listen(PORT, () => console.log(`✅ Server is running on port: ${PORT}`));

