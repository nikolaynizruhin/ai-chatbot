import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: ".env.local",
});

export default defineConfig({
  schema: "./lib/db/schemas",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
