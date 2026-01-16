import cron from "node-cron";
import Subscription from "../models/subscription.model.js";

const calculateNextRenewal = (currentRenewal, frequency) => {
  const next = new Date(currentRenewal);
  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
};

export const startAutoRenew = () => {
  cron.schedule("0 4 * * *", async () => {
    try {
      const now = new Date();

      const dueSubs = await Subscription.find({
        status: "active",
        renewalDate: { $lte: now },
      });

      let renewed = 0;

      for (const sub of dueSubs) {
        const newRenewalDate = calculateNextRenewal(
          sub.renewalDate,
          sub.frequency
        );

        await Subscription.updateOne(
          { _id: sub._id },
          {
            renewalDate: newRenewalDate,
          }
        );

        console.log(
          `Auto-renewed "${sub.name}" for user ${
            sub.user
          } — next: ${newRenewalDate.toISOString()}`
        );
        renewed++;
      }

      if (renewed > 0) {
        console.log(`🔥 Renewed ${renewed} subscriptions today`);
      }
    } catch (err) {
      console.error("Auto-renew cron crashed", err);
    }
  });

  console.log("Auto-renew cron is live");
};
