import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const dbConnection = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("DB connection established");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};


export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "none" : "strict", // "none" required for cross-origin in production
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    path: "/", // Ensure cookie is sent for all paths
    domain: isProduction ? undefined : "localhost", // Allow cross-origin in production, restrict locally
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(
      "[JWT] Token created - sameSite:",
      isProduction ? "none" : "strict",
      ", secure:",
      isProduction
    );
  }
};
