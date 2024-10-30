import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { amenitiesVenues } from "./amenities-venues";

export const amenities = pgTable('amenities', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
});

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  amenitiesVenues: many(amenitiesVenues),
}));

export type Amenity = typeof amenities.$inferSelect;
