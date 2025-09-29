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
import principalRoutes from "./routes/principalRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

config();
connect();

const PORT = process.env.PORT || 4000;
const app = express();

// ✅ CORS setup (open for all with credentials)
app.use(
  cors({
    origin: (origin, callback) => {
      // अगर request बिना origin के आए (जैसे Postman) तो भी allow कर दो
      callback(null, origin || true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Handle preflight requests (OPTIONS)
app.options("/*", cors());

app.use(express.json());

// Middleware: log every request
app.use((req, res, next) => {
  console.log(
    `👉 [${req.method}] ===>  https://smartpraveshbackend.onrender.com${req.originalUrl}`
  );
  next();
});

// ✅ Routes
app.use("/api/auth/principal", principalRoutes); //done
app.use("/api/schools", schoolRoutes); //done
app.use("/api/classes", classRoutes); //done
app.use("/api/teachers", teacherRoutes); //done
app.use("/api/students", studentRoutes); //done
app.use("/api/foodmenu", foodMenuRoutes); //done
app.use("/api/attendance", attendanceRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Automated Attendance System API is running...");
});

// Start server
app.listen(PORT, () => console.log(`✅ Server is running on port: ${PORT}`));
