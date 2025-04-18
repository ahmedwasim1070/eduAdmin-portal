import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  password: string;
  role: "root" | "principle" | "admin" | "student";
  collegeName: string;
  permissions: string[];
  documentStatus: "approved" | "rejected" | "pending";
  status: "active" | "deleted" | "suspended";
  loginAttempt: number;
  lastLogin?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;

  // Functions
  comparePassword(userPassword: string): Promise<boolean>;
  canCreateUser(targetRole: string): boolean;
  incrementLoginAttempt(): void;
  resetLoginAttempt(): void;
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
      enum: ["root", "principle", "admin", "student"],
    },
    collegeName: {
      type: String,
      required: function (this: IUser) {
        return this.role !== "root";
      },
      trim: true,
    },
    documentStatus: {
      type: String,
      required: function (this: IUser) {
        return this.role === "student";
      },
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
    permissions: {
      type: [String],
      default: function (this: IUser) {
        const permission = {
          root: ["root", "principle", "admin", "student"],
          principle: ["principle", "admin", "student"],
          admin: ["admin", "student"],
          student: [],
        };
        return permission[this.role] || [];
      },
    },
    status: {
      type: String,
      enum: ["active", "deleted", "suspended"],
      default: "active",
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

userSchema.methods.comparePassword = function (
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

userSchema.methods.canCreateUser = function (
  this: IUser,
  targetRole: string
): boolean {
  const creationRules: Record<IUser["role"], string[]> = {
    root: ["principle", "admin", "studnet"],
    principle: ["principle", "admin", "student"],
    admin: ["admin", "student"],
    student: [],
  };

  return creationRules[this.role]?.includes(targetRole) || false;
};

userSchema.methods.incrementLoginAttempt = function (): void {
  this.loginAttempt += 1;
  return;
};

userSchema.methods.resetLoginAttempt = function (): void {
  this.loginAttempt = 0;
  return;
};

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.error("Error while hashing the password ", error);
    next(error as Error);
  }
});

const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default userModel;
