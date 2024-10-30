import { InferSelectModel } from "drizzle-orm";
import { pgTable, varchar, timestamp, json, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  email: varchar({ length: 64 }).notNull(),
  password: varchar({ length: 64 }),
});

export type User = InferSelectModel<typeof users>;