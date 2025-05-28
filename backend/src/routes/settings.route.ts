import { Router } from "express";

import { protectRoute, validateRoot } from "../middlewares/auth.middleware.js";

import {
  quiryUsers,
  changeStatus,
  changeName,
  deleteUser,
} from "../controllers/useroptions.controller.js";

const router = Router();

// Quieries
// Root Quiries roots
router.get("/quiryAll", protectRoute, quiryUsers);
// Change Status
router.post("/change/status", protectRoute, changeStatus);
// Change Name
router.post("/change/name", protectRoute, changeName);
// Deletes Permanenetly
router.post("/delete/users", protectRoute, deleteUser);

export default router;
