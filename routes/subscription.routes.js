import { Router } from "express";
import { adminAuth, authorize } from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getSubscription,
  getSubscriptions,
  getUpcomingRenewals,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.get("/", adminAuth, getSubscriptions);

subscriptionRouter.get("/:id", adminAuth, getSubscription);

subscriptionRouter.get("/users/:id", authorize, getUserSubscriptions);

subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewals);

subscriptionRouter.post("/", authorize, createSubscription);

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
