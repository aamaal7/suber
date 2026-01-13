import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

userRouter.post("/", (req, res) => res.send({ message: "CREATE new user" }));

userRouter.put("/:id", (req, res) =>
  res.send({ message: "UPDATES Specific User Details" })
);
userRouter.delete("/:id", (req, res) =>
  res.send({ message: "DELETES a User" })
);

export default userRouter;
