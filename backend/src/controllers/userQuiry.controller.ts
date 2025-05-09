import { Response, Request } from "express";

import userModel from "../models/user.model.js";

import { protectRouteResponse } from "../middlewares/auth.middleware.js";

// Returns the array of all the root users
export const quiryAllTypeUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { requestType } = req.body;
  if (!requestType && !["root", "college"].includes(requestType)) {
    res.status(400).json({ message: "Invalid Quiry" });
    return;
  }

  const user = (req as protectRouteResponse).user;
  try {
    // If its a root quiry request
    if (requestType === "root") {
      const rootUsers = await userModel
        .find({
          role: requestType,
          _id: { $ne: user._id },
          createdBy: { $ne: "self-created" },
        })
        .select("-password");

      if (!rootUsers || rootUsers.length === 0) {
        res.status(404).json({ message: "No root user exsists !" });
        return;
      }

      res.status(200).json({ message: "User fetched !", user: rootUsers });
    } else if (requestType === "college") {
      // If it is a college quiry request
      const colleges = await userModel.find({
        collegeName: { $nin: ["null", ""] },
        role: { $ne: "root" },
      });

      if (!colleges || colleges.length === 0) {
        res.status(404).json({ message: "No Colleges exsists !" });
        return;
      }

      res.status(200).json({ message: "User fetched !", user: colleges });
    }

    return;
  } catch (error) {
    console.error("Error in quiryRootUser controller : ", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};
