import { Router } from "express";

import { rootSignup } from "../controllers/auth.controller.js";

const router = Router();

// Root signup
router.post("/signup/root", rootSignup);

export default router;
