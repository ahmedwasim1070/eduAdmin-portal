import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  contactNumber: string;
  password: string;
  role: "root" | "sudo" | "user" | "guest";
  permissions: string[];
  status: "approved" | "pending" | "rejected" | "deleted";
  loginAttempt: number;
  lastLogin?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is requried"],
      trim: true,
    },
    email: {
      unique: [true, "Email already exsist`s "],
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    contactNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      match: [/^\+?(\d{10,14})$/, "Please fill a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password should be alteast 8 characters"],
    },
    role: {
      type: String,
      required: true,
      enum: ["root", "sudo", "user", "guest"],
      default: "guest",
    },
    permissions: {
      type: [String],
      default: function (this: IUser) {
        const permission = {
          root: ["root", "sudo", "user", "guest"],
          sudo: ["sudo", "user", "guest"],
          user: ["user", "guest"],
          guest: [],
        };
        return permission[this.role] || [];
      },
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected", "deleted"],
      default: "pending",
    },
    loginAttempt: {
      type: Number,
      default: 0,
      max: 5,
    },
    lastLogin: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId || "self-created",
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default userModel;
