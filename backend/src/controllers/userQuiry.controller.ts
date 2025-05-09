import { Response, Request } from "express";

import userModel from "../models/user.model.js";

import { protectRouteResponse } from "../middlewares/auth.middleware.js";

// Returns the array of all the root users
export const quiryRootUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as protectRouteResponse).user;
  try {
    const rootUsers = await userModel
      .find({
        role: user.role,
        _id: { $ne: user._id },
        createdBy: { $ne: "self-created" },
      })
      .select("-password");

    if (!rootUsers || rootUsers.length === 0) {
      res.status(404).json({ message: "No root user exsists !" });
      return;
    }

    res.status(200).json({ message: "Listed all the root Users !", rootUsers });
    return;
  } catch (error) {
    console.error("Error in quiryRootUser controller : ", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};
