// Moongoose
import mongoose from "mongoose";

// Connnects MongoDB database
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected : ", conn.connection.host);
    return;
  } catch (error) {
    console.error("MongoDB connection error ! : ", error);
    return;
  }
};
