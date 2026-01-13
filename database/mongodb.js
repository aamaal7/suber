import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error("Define DB_URI in environment file");
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Database connected in ${NODE_ENV} mode`);
  } catch (error) {
    console.error(
      "Error occurred connecting to database, here is the details: ",
      error
    );
  }
};

export default connectToDatabase;
