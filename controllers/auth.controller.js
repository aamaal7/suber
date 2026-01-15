import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const decoded = jwt.decode(token);

  return {
    token,
    expiresAt: new Date(decoded.exp * 1000),
  };
};

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const decoded = jwt.decode(token);

    newUser[0].token = token;
    newUser[0].tokenExpiresAt = new Date(decoded.exp * 1000);

    await newUser[0].save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUser[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw Object.assign(new Error("Invalid password"), { statusCode: 401 });
    }

    let token = user.token;

    if (
      !user.token ||
      !user.tokenExpiresAt ||
      user.tokenExpiresAt < new Date()
    ) {
      const generated = generateToken(user._id);

      user.token = generated.token;
      user.tokenExpiresAt = generated.expiresAt;
      await user.save();

      token = generated.token;
    }

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User signed out successfully",
  });
};
