// Express
import { Router } from "express";

// Middlewares
import {
  validateToken,
  protectBaseSignup,
} from "../middlewares/auth.middleware.js";

// Controllers
import {
  baseSignup,
  signup,
  login,
  logout,
} from "../controllers/auth.controller.js";

// Creates Router
const authRouter = Router();

// Validates cookie and logs in
authRouter.get("/validate/authToken", validateToken);
// Post requst for Base Signup (only applicable if db's empty)
authRouter.post("/signup/root/base", protectBaseSignup, baseSignup);
// Post Request for Signup
authRouter.post("/signup", validateToken, signup);
// Post Request for login
authRouter.post("/login", login);
// Get Request for Logout
authRouter.get("/logout", logout);

// Exports Router
export default authRouter;
