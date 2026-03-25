// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
}

export const ENV = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  IS_PROD: process.env.NODE_ENV === "production",
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY:    required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),
};