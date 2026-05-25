import dotenv from "dotenv";
import app from "./src/app.js";

// load environment variables
dotenv.config();
// load BROKERS environment variables
dotenv.config({path: ".env.broker"})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});