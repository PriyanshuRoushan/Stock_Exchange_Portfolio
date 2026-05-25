import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// routes
import authRoutes from "./routes/auth.routes.js";
import brokerRoutes from "./routes/broker.route.js";



// test
import testRoute from "./routes/test.routes.js";

const app = express();


// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());


//testRoute
app.use("/api/test", testRoute);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/brokers", brokerRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;