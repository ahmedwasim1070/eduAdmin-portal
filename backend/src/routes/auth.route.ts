// Express
import { Router } from "express";

// Middlewares
import {
  validateToken,
  protectBaseSignup,
} from "../middlewares/auth.middleware.js";

// Controllers
import {
  checkAuth,
  baseSignup,
  signup,
  login,
  logout,
  requestOtp,
  verifyOtp,
  changePassword,
} from "../controllers/auth.controller.js";

// Creates Router
const authRouter = Router();

// Validates cookie and logs in
authRouter.get("/validate/token", validateToken, checkAuth);
// Post requst for Base Signup (only applicable if db's empty)
authRouter.post("/signup/root/base", protectBaseSignup, baseSignup);
// Post Request for Signup
authRouter.post("/signup", validateToken, signup);
// Post Request for login
authRouter.post("/login", login);
// Get Request for Logout
authRouter.get("/logout", logout);
// Post Request for generating otp and send otp to user email
authRouter.post("/request/otp", requestOtp);
// Post Request for verifying otp
authRouter.post("/verify/otp", verifyOtp);
// Post Request for changing password
authRouter.post("/change/password", validateToken, changePassword);

// Exports Router
export default authRouter;
