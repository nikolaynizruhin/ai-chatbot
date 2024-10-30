import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { plansVenues } from "./plans-venues";

export const plans = pgTable('plans', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
});

export const plansRelations = relations(plans, ({ many }) => ({
  plansVenues: many(plansVenues),
}));  

export type Plan = typeof plans.$inferSelect;
