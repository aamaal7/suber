import { Router } from "express";
import { adminAuth, authorize } from "../middleware/auth.middleware.js";
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getSubscriptions,
  getUpcomingRenewals,
  getUserSubscriptions,
  updateSubscription,
} from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.get("/", adminAuth, getSubscriptions);

subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewals);

subscriptionRouter.get("/users/:id", authorize, getUserSubscriptions);

subscriptionRouter.get("/:id", adminAuth, getSubscription);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

export default subscriptionRouter;
