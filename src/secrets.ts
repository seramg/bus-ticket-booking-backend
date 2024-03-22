import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export const PORT = process.env.PORT;
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN!;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN!;
