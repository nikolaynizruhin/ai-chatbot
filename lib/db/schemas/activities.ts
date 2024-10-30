import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { activitiesVenues } from "./activities-venues";

export const activities = pgTable('activities', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
});

export const activitiesRelations = relations(activities, ({ many }) => ({
  activitiesVenues: many(activitiesVenues),
}));

export type Activity = typeof activities.$inferSelect;
