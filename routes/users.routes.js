import { Router } from "express";

import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { authorize, adminAuth } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", adminAuth, getUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.put("/:id", authorize, updateUser);

userRouter.delete("/:id", authorize, deleteUser);

export default userRouter;
