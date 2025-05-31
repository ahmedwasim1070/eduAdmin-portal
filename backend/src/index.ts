// Express
import express from "express";

// DotEnv
import "dotenv/config";
// MongoDB connector function
import { connectDB } from "./lib/db.js";

// Routes
import authRouter from "./routes/auth.route.js";

// Creates Express app
const app = express();

// Custom routes
app.use("/api/auth", authRouter);

// PORT
const PORT = process.env.PORT;

// Starts server
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
  connectDB();
});
