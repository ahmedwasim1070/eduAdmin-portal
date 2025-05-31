// Mongoose
import mongoose, { Model, Schema, Document } from "mongoose";

// Bcrypt
import bcrypt from "bcrypt";

// For Type script
export interface IUser extends Document {
  // Data
  _id: string;
  fullName: string;
  email: string;
  userStatus: "active" | "suspended" | "deleted";
  emailStatus: "verified" | "not-verified";
  contactNumber: string;
  password: string;
  otp?: string;
  role: "root" | "principal" | "admin" | "student";
  permissions: string[];
  collegeName?: string;
  userLocation?: string;
  //   Data Info
  loginAttempt?: number;
  otpCreatedAt?: number;
  lastLogin?: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;

  //   Functions
  isValidPassword(userPassword: string): Promise<boolean>;
  isValidOTP(userOTP: string): Promise<boolean>;
  isAuthorized(userRole: string);
  incrementLoginAttempt(): void;
  resetLoginAttempt(): void;
}

// Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    // Full Name (string)
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    // Email (string)
    email: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },

    //   userStatus ("active" | "suspended"|"deleted")
    userStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    //   Email Status (verified | not-verified)
    emailStatus: {
      type: String,
      enum: ["verified", "not-verified"],
      default: "not-verified",
    },

    //   Contact Number (string)
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [/^\+?(\d{10,14})$/, "Please fill a valid phone number"],
    },

    //   Password (string hashed)
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },

    //   OTP (string hashed)
    otp: {
      type: String,
      trim: true,
      required: false,
    },

    //   Role (root | principal | admin | student)
    role: {
      type: String,
      enum: ["root", "principal", "admin", "student"],
      default: "student",
    },

    //   Permissions array
    permissions: {
      type: [String],
      default: function (this: IUser) {
        const permission = {
          root: ["root", "principal", "admin", "student"],
          principal: ["principal", "admin", "student"],
          admin: ["admin", "student"],
          student: [],
        };
        return permission[this.role];
      },
    },

    //   College name (stirng)
    collegeName: {
      type: String,
      trim: true,
      required: function (this: IUser) {
        return this.role !== "root";
      },
    },

    //   User location (string)
    userLocation: {
      type: String,
      trim: true,
      required: function (this: IUser) {
        return this.role !== "root";
      },
    },

    //   Login attempt (number)
    loginAttempt: {
      type: Number,
      required: false,
    },

    //   OTP created at (number)
    otpCreatedAt: {
      type: Number,
      required: false,
    },

    //   Last login (js-data number)
    lastLogin: {
      type: Number,
      required: false,
    },

    // Created By (strig)
    createdBy: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Externel functions
// Compare password
UserSchema.methods.isValidPassword = function (
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

// Comapre OTP
UserSchema.methods.isValidOTP = async function (
  this: IUser,
  userOTP: string
): Promise<boolean> {
  if (this.otp && !(Date.now() - this.otpCreatedAt > 5 * 60 * 1000)) {
    return bcrypt.compare(userOTP, this.otp);
  }

  return false;
};

// Checks authorization
UserSchema.methods.isAuthorized = function (
  this: IUser,
  userRole: string
): boolean {
  const creationRules: Record<IUser["role"], string[]> = {
    root: ["root", "principal", "admin", "studnet"],
    principal: ["principal", "admin", "student"],
    admin: ["admin", "student"],
    student: [],
  };

  return creationRules[this.role]?.includes(userRole) || false;
};

// Increment login by 1
UserSchema.methods.incrementLoginAttempt = function (): void {
  this.loginAttempt += 1;
  return;
};

// Resets attempts to 0
UserSchema.methods.resetLoginAttempt = function (): void {
  this.loginAttempt = 0;
  return;
};

// Middleawre encryptes (password/otp)
UserSchema.pre<IUser>("save", async function (this: IUser, next) {
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

const userModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default userModel;
