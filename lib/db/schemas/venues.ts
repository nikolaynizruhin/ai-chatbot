import { relations } from "drizzle-orm";
import { geometry, index, integer, pgTable, varchar, vector } from "drizzle-orm/pg-core";

import { activitiesVenues } from "./activities-venues";
import { amenitiesVenues } from "./amenities-venues";
import { plansVenues } from "./plans-venues";
import { districts } from "./districts";

export const venues = pgTable(
  'venues',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    description: varchar().notNull(),
    image: varchar().notNull(),
    website: varchar().notNull(),
    address: varchar().notNull(),
    zip: varchar().notNull(),
    districtId: integer().notNull().references(() => districts.id),
    location: geometry({ type: 'point', mode: 'tuple', srid: 4326 }).notNull(),
    embedding: vector({ dimensions: 1536 }),
  },
  table => [
    index().using('hnsw', table.embedding.op('vector_cosine_ops')),
    index().using('gist', table.location),
  ],
);

export const venuesRelations = relations(venues, ({ many, one }) => ({
  activitiesVenues: many(activitiesVenues),
  amenitiesVenues: many(amenitiesVenues),
  plansVenues: many(plansVenues),
  district: one(districts, {
    fields: [venues.districtId],
    references: [districts.id],
  }),
}));

export type Venue = typeof venues.$inferSelect;
