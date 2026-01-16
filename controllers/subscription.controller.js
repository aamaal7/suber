import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
      startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/remainder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 3,
    });
    res.status(201).json({ success: true, data: subscription, workflowRunId });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const upcoming = await Subscription.find({
      user: userId,
      status: "active",
      renewalDate: {
        $gt: new Date(),
        $lte: thirtyDaysFromNow,
      },
    })
      .sort({ renewalDate: 1 })
      .select(
        "name price currency frequency category renewalDate paymentMethod"
      )
      .lean();

    res.status(200).json({
      success: true,
      count: upcoming.length,
      data: upcoming,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const {
      name,
      price,
      currency,
      frequency,
      category,
      paymentMethod,
      status,
      startDate,
      renewalDate,
    } = req.body;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = price;
    if (currency !== undefined) updates.currency = currency;
    if (frequency !== undefined) updates.frequency = frequency;
    if (category !== undefined) updates.category = category;
    if (paymentMethod !== undefined) updates.paymentMethod = paymentMethod;
    if (status !== undefined) updates.status = status;
    if (startDate !== undefined) updates.startDate = startDate;
    if (renewalDate !== undefined) updates.renewalDate = renewalDate;

    const subscription = await Subscription.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};
