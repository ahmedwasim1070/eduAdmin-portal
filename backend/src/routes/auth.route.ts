// Express
import { Router } from "express";

// Controllers
import { signup } from "../controllers/auth.controller.js";

// Creates Router
const authRouter = Router();

// Post Request for Signup
authRouter.post("/signup", signup);
// Post Request for login
// router.post("/login", login);

// Exports Router
export default authRouter;
