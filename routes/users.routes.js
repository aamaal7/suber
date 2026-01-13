import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => res.send({ message: "GET All Users" }));

userRouter.get("/:id", (req, res) =>
  res.send({ message: "GET Specific User" })
);

userRouter.post("/", (req, res) => res.send({ message: "CREATE new user" }));

userRouter.put("/:id", (req, res) =>
  res.send({ message: "UPDATES Specific User Details" })
);
userRouter.delete("/:id", (req, res) =>
  res.send({ message: "DELETES a User" })
);

export default userRouter;
