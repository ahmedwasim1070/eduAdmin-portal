import { Response, Request } from "express";

import userModel, { IUser } from "../models/user.model.js";

import { protectRouteResponse } from "../middlewares/auth.middleware.js";

// Returns the array of all root users
export const quiryAllTypeUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { requestType } = req.body;
  if (!requestType && !["root", "college", "deleted"].includes(requestType)) {
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
          status: { $nin: ["deleted", "suspended"] },
        })
        .select("-password");

      if (!rootUsers || rootUsers.length === 0) {
        res.status(404).json({ message: "No root user exsists !" });
        return;
      }

      res.status(200).json({ message: "User fetched !", user: rootUsers });
    } else if (requestType === "college") {
      // If it is a college quiry request
      const colleges = await userModel
        .find({
          role: { $ne: "root" },
          status: { $nin: ["deleted", "suspended"] },
        })
        .select("-password");

      if (!colleges || colleges.length === 0) {
        res.status(404).json({ message: "No Colleges exsists !" });
        return;
      }

      // Structures the Data according to the College name
      const groupedByCollege: { [key: string]: IUser[] }[] = [];

      colleges.forEach((user) => {
        const collegeKey = user.collegeName as string;

        const existing = groupedByCollege.find((entry) =>
          Object.hasOwn(entry, collegeKey)
        );

        if (existing) {
          existing[collegeKey].push(user);
        } else {
          groupedByCollege.push({
            [collegeKey]: [user],
          });
        }
      });

      res.status(200).json({ message: "User fetched !", groupedByCollege });
    } else if (["deleted", "suspended"].includes(requestType)) {
      // Fetches deleted user
      const nonActiveUsers = await userModel
        .find({ status: requestType })
        .select("-password");
      if (!nonActiveUsers || nonActiveUsers.length === 0) {
        res
          .status(404)
          .json({ message: `No ${requestType} user at the moment !` });
        return;
      }

      const groupedByCollege: { [key: string]: IUser[] }[] = [];
      let users: IUser[] = [];

      nonActiveUsers.forEach((user) => {
        if (user.collegeName && user.role !== "root") {
          const collegeKey = user.collegeName as string;

          const existing = groupedByCollege.find((entry) =>
            Object.hasOwn(entry, collegeKey)
          );

          if (existing) {
            existing[collegeKey].push(user);
          } else {
            groupedByCollege.push({
              [collegeKey]: [user],
            });
          }
        } else {
          users.push(user);
        }
      });

      res.status(200).json({
        message: "User Fetched!",
        user: users,
        groupedByCollege,
      });
    } else {
      res.status(400).json({ message: "Invalid Request !" });
    }

    return;
  } catch (error) {
    console.error("Error in quiryRootUser controller : ", error);
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
