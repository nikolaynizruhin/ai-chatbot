import { relations } from "drizzle-orm";
import { integer, pgTable, serial, unique } from "drizzle-orm/pg-core";

import { amenities } from "./amenities";
import { venues } from "./venues";

export const amenitiesVenues = pgTable(
  'amenities_venues',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    amenityId: integer().notNull().references(() => amenities.id),
    venueId: integer().notNull().references(() => venues.id),
  }, 
  table => ({
    unq: unique().on(table.amenityId, table.venueId),
  })
);

export const amenitiesVenuesRelations = relations(amenitiesVenues, ({ one }) => ({
  amenity: one(amenities, {
    fields: [amenitiesVenues.amenityId],
    references: [amenities.id],
  }),
  venue: one(venues, {
    fields: [amenitiesVenues.venueId],
    references: [venues.id],
  }),
}));
