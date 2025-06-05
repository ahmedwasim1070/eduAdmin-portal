// Express
import express from "express";

// DotEnv
import "dotenv/config";
// Cookie-parser
import cookieParser from "cookie-parser";
// Cors
import cors from "cors";
// MongoDB connector function
import { connectDB } from "./lib/db.js";

// Routes
import authRouter from "./routes/auth.route.js";

// Creates Express app
const app = express();

// Default's
// JSON parser
app.use(express.json());
// Parse cookies
app.use(cookieParser());
// Cors
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Custom routes
app.use("/api/auth", authRouter);

// PORT
const PORT = process.env.PORT;

// Starts server
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
  connectDB();
});
