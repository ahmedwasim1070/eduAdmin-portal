import { Response, Request } from "express";

import { Validator } from "../lib/validator.js";

import { protectRouteResponse } from "../middlewares/auth.middleware.js";
import userModel from "../models/user.model.js";

const validator = new Validator();

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
