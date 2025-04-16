import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB connected : ", con.connection.host);
  } catch (error) {
    console.error("MongoDB connection error :", error);
  }
};
