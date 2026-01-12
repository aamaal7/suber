import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => res.send({ message: "GET all users" }));

userRouter.get("/:id", (req, res) =>
  res.send({ message: "GET specific users" })
);

userRouter.post("/", (req, res) => res.send({ message: "CREATE new user" }));

userRouter.put("/:id", (req, res) =>
  res.send({ message: "UPDATES specific user details" })
);
userRouter.delete("/:id", (req, res) =>
  res.send({ message: "DELETES a user" })
);

export default userRouter;
