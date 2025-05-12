import { Router } from "express";

import { protectRoute, validateRoot } from "../middlewares/auth.middleware.js";

import {
  changeStatus,
  quiryAllTypeUsers,
} from "../controllers/rootPrivileges.controller.js";
import { changeName } from "../controllers/userSettings.controller.js";

const router = Router();

// Quieries
// Root Quiries roots
router.post("/quiryAll", protectRoute, validateRoot, quiryAllTypeUsers);
// Change Status
router.post("/change/status", protectRoute, validateRoot, changeStatus);

// Change Name
router.post("/change/name", protectRoute, changeName);

export default router;
