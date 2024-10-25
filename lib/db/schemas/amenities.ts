import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { amenitiesVenues } from "./amenities-venues";

export const amenities = pgTable('amenities', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),
});

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  amenitiesVenues: many(amenitiesVenues),
}));

export type Amenity = typeof amenities.$inferSelect;
