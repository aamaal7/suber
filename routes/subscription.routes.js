import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({ message: "GET Subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
  res.send({ message: "GET Subscription details" });
});

subscriptionRouter.get("/users/:id", (req, res) => {
  res.send({ message: "GET All User Subscriptions" });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ message: "GET Upcoming Renewals" });
});

subscriptionRouter.post("/", (req, res) => {
  res.send({ message: "CREATE Subscription" });
});

subscriptionRouter.put("/:id", (req, res) => {
  res.send({ message: "UPDATE Subscription" });
});

subscriptionRouter.delete("/:id", (req, res) => {
  res.send({ message: "DELETE Subscription" });
});

subscriptionRouter.delete("/:id/cancel", (req, res) => {
  res.send({ message: "Cancel Subscription" });
});

export default subscriptionRouter;
