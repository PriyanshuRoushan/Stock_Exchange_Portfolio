import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./config/db.js";

// routes
import authRoutes from "./routes/auth.routes.js";
import brokerRoutes from "./routes/broker.route.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

// test
import testRoute from "./routes/test.routes.js";

const app = express();

// CORS configuration with credentials support
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(cookieParser());

// Health & connection status endpoint
app.get("/api/health", async (req, res) => {
  try {
    const dbResult = await pool.query("SELECT NOW()");
    res.status(200).json({
      status: "ok",
      database: "connected",
      serverTime: new Date().toISOString(),
      dbTime: dbResult.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: error.message
    });
  }
});

// testRoute
app.use("/api/test", testRoute);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/brokers", brokerRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;