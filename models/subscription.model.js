import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: 0,
    },
    currency: {
      type: String,
      enum: ["USD", "AED", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "sports",
        "entertainment",
        "music",
        "gaming",
        "movies",
        "technology",
        "food",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past or today",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cancelledAt: Date,
  },
  { timestamps: true }
);

const calculateNextRenewal = (fromDate, frequency) => {
  const next = new Date(fromDate);

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
    default:
      throw new Error("Invalid frequency");
  }
  return next;
};

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const baseDate = this.isNew
      ? this.startDate
      : this.renewalDate || this.startDate;
    this.renewalDate = calculateNextRenewal(baseDate, this.frequency);
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
