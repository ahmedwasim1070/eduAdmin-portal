import { Response, Request } from "express";

import { Validator } from "../lib/validator.js";

import userModel, { IUser } from "../models/user.model.js";

import { protectRouteResponse } from "../middlewares/auth.middleware.js";

const validator = new Validator();

// Returns the array of all root users
export const quiryUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as protectRouteResponse).user;
  if (user.permissions.length === 0) {
    res.status(401).json({ message: "Unauthorized !" });
    return;
  }
  //
  try {
    const quiriedUsers = await userModel
      .find({
        role: { $in: user.permissions },
        createdBy: { $ne: "self-created" },
      })
      .select("-password");
    if (!quiriedUsers || quiriedUsers.length === 0) {
      res.status(404).json({ message: "No users exsists ! " });
      return;
    }

    res.status(200).json({ message: "Users fetched !", quiriedUsers });
    return;
  } catch (error) {
    console.error("Error in quiryUsers controller : ", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};

// Change Status of Users
export const changeStatus = async (req: Request, res: Response) => {
  const { actionOn, statusType } = req.body;

  // Checks actionOn
  if (!actionOn || typeof actionOn !== "string" || actionOn.length < 3) {
    res.status(400).json({ message: "Invalid Request !" });
    return;
  }

  // Checks for suspend type
  if (
    !statusType ||
    typeof statusType !== "string" ||
    !["active", "deleted", "suspended"].includes(statusType)
  ) {
    res.status(400).json({ message: "Invalid Request !" });
    return;
  }

  const isId = /^[a-fA-F0-9]{24}$/.test(actionOn);

  try {
    // Functions change according to the input
    if (isId) {
      const user = await userModel
        .findOne({ _id: actionOn, status: { $ne: statusType } })
        .select("-password");
      if (!user) {
        res.status(404).json({ message: "User not found ! " });
        return;
      }

      user.status = statusType as "active" | "deleted" | "suspended";
      await user.save();

      //
    } else {
      const collegeUsers = await userModel
        .find({
          collegeName: actionOn,
          status: { $ne: statusType },
        })
        .select("-password");

      if (!collegeUsers || collegeUsers.length === 0) {
        res.status(404).json({ message: "No college found !" });
        return;
      }

      // Changes the status of collegeUsers which is array
      collegeUsers.forEach(async (user) => {
        user.status = statusType as "active" | "deleted" | "suspended";
        await user.save();
      });

      //
    }

    // Change message according to the suspend type
    let message;
    switch (statusType) {
      case "active":
        message = isId ? "User restored !" : "College restored !";
        break;
      case "deleted":
        message = isId ? "User deleted !" : "College deleted !";
        break;
      case "suspended":
        message = isId ? "User suspended !" : "College suspended !";
        break;
    }

    res.status(200).json({ message });
    return;
  } catch (error) {
    console.error("Error in quiryRootUser controller : ", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};

// Chnages Name
export const changeName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { newFullName } = req.body;
  const valid = validator.validateFullName(newFullName);
  if (valid) {
    res.status(400).json({ message: valid });
    return;
  }

  const { _id } = (req as protectRouteResponse).user;
  try {
    const user = await userModel.findById(_id);
    if (!user) {
      res.status(404).json({ message: "User not found !" });
      return;
    }

    user.fullName = newFullName;
    await user.save();

    res.status(200).json({ message: "Name changed successfully !" });
    return;
  } catch (error) {
    console.error("Error in changeName controller", error);
    res.status(500).json({ message: "Internel server error ! " });
    return;
  }
};
