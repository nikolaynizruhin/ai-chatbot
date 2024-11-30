import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

import { cities } from "./cities";

export const countries = pgTable('countries', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
});

export const countriesRelations = relations(countries, ({ many }) => ({
  cities: many(cities),
}));

export type Country = typeof countries.$inferSelect;
