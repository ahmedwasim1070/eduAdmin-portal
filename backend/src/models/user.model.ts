import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// Typecast document
export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  emailStatus: "verified" | "not-verified";
  contactNumber: string;
  password: string;
  otp?: string;
  otpCreatedAt: number;
  role: "root" | "principal" | "admin" | "student";
  collegeName?: string;
  permissions: string[];
  documentStatus: "approved" | "rejected" | "pending";
  status: "active" | "deleted" | "suspended";
  loginAttempt: number;
  lastLogin?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Functions
  comparePassword(userPassword: string): Promise<boolean>;
  compareOTP(userOTP: string): Promise<boolean>;
  isParent(targetRole: string): boolean;
  incrementLoginAttempt(): void;
  resetLoginAttempt(): void;
}

// Schema
const userSchema: Schema<IUser> = new Schema(
  {
    // Full name
    fullName: {
      type: String,
      required: [true, "Full Name is requried"],
      trim: true,
    },
    // Email
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
    // Email status
    emailStatus: {
      type: String,
      enum: ["verified", "not-verified"],
      default: "not-verified",
    },
    // Contact Number
    contactNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      match: [/^\+?(\d{10,14})$/, "Please fill a valid phone number"],
    },
    // Password
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // OTP
    otp: {
      type: String,
      required: false,
    },
    // OTP created at
    otpCreatedAt: {
      type: Number,
      required: false,
    },
    // Role
    role: {
      type: String,
      required: true,
      enum: ["root", "principal", "admin", "student"],
    },
    // College name required only if it is not root
    collegeName: {
      type: String,
      required: function (this: IUser) {
        return this.role !== "root";
      },
      trim: true,
    },
    // Document status for student only
    documentStatus: {
      type: String,
      required: function (this: IUser) {
        return this.role === "student";
      },
      enum: ["approved", "rejected", "pending"],
      default: function (this: IUser) {
        return this.role === "student" ? "pending" : undefined;
      },
    },
    // Permissions
    permissions: {
      type: [String],
      default: function (this: IUser) {
        const permission = {
          root: ["root", "principal", "admin", "student"],
          principal: ["principal", "admin", "student"],
          admin: ["admin", "student"],
          student: [],
        };
        return permission[this.role] || [];
      },
    },
    // Status
    status: {
      type: String,
      enum: ["active", "deleted", "suspended"],
      default: "active",
    },
    // Login attempts
    loginAttempt: {
      type: Number,
      default: 0,
      max: 5,
    },
    // Last Login
    lastLogin: {
      type: Number,
      required: false,
    },
    // Created by
    createdBy: {
      type: String,
      default: "self-created",
    },
  },
  { timestamps: true }
);

// Compares password
userSchema.methods.comparePassword = function (
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

// Compares OTP
userSchema.methods.compareOTP = async function (
  this: IUser,
  userOTP: string
): Promise<boolean> {
  if (this.otp && !(Date.now() - this.otpCreatedAt > 5 * 60 * 1000)) {
    return bcrypt.compare(userOTP, this.otp);
  }

  return false;
};

// Check permission
userSchema.methods.isParent = function (
  this: IUser,
  targetRole: string
): boolean {
  const creationRules: Record<IUser["role"], string[]> = {
    root: ["root", "principal", "admin", "studnet"],
    principal: ["principal", "admin", "student"],
    admin: ["admin", "student"],
    student: [],
  };

  return creationRules[this.role]?.includes(targetRole) || false;
};

// Chnages password
userSchema.methods.updatePassword = function (
  this: IUser,
  newPassword: string
): void {
  this.password === newPassword;
  return;
};

// Increment login by 1
userSchema.methods.incrementLoginAttempt = function (): void {
  this.loginAttempt += 1;
  return;
};

// Decrement login by 1
userSchema.methods.resetLoginAttempt = function (): void {
  this.loginAttempt = 0;
  return;
};

// Middleawre
userSchema.pre<IUser>("save", async function (this: IUser, next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    if (this.otp && this.isModified("otp")) {
      this.otp = await bcrypt.hash(this.otp, 10);
    }

    next();
  } catch (error) {
    console.error("Error while hashing password/otp:", error);
    next(error as Error);
  }
});

const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default userModel;
