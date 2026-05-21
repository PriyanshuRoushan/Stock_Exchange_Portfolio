import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";


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

app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;