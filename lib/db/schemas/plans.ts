import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { plansVenues } from "./plans-venues";

export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),
});

export const plansRelations = relations(plans, ({ many }) => ({
  plansVenues: many(plansVenues),
}));  

export type Plan = typeof plans.$inferSelect;
