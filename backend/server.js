import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./src/config/db.js";

// load environment variables
dotenv.config();
// load BROKERS environment variables
dotenv.config({ path: ".env.broker" });

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connected successfully at:", res.rows[0].now);
  } catch (err) {
    console.error("Database connection failed on startup:", err.message);
  }
});