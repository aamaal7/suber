import { Router } from "express";

import { getUser, getUsers } from "../controllers/user.controller.js";
import { authorize, adminAuth } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", adminAuth, getUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) => res.send({ message: "CREATE new user" }));

userRouter.put("/:id", (req, res) =>
  res.send({ message: "UPDATES Specific User Details" })
);
userRouter.delete("/:id", (req, res) =>
  res.send({ message: "DELETES a User" })
);

export default userRouter;
