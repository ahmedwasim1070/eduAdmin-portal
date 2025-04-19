import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started at : ${PORT}`);
  connectDB();
});
