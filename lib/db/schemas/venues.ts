import { relations } from "drizzle-orm";
import { geometry, index, integer, pgTable, point, varchar, vector } from "drizzle-orm/pg-core";

import { activitiesVenues } from "./activities-venues";
import { amenitiesVenues } from "./amenities-venues";
import { plansVenues } from "./plans-venues";

export const venues = pgTable(
  'venues',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    description: varchar().notNull(),
    image: varchar().notNull(),
    website: varchar().notNull(),
    address: varchar().notNull(),
    location: geometry({ type: 'point', mode: 'tuple', srid: 4326 }).notNull(),
    embedding: vector({ dimensions: 1536 }),
  },
  table => [
    index().using('hnsw', table.embedding.op('vector_cosine_ops')),
    index().using('gist', table.location),
  ],
);

export const venuesRelations = relations(venues, ({ many }) => ({
  activitiesVenues: many(activitiesVenues),
  amenitiesVenues: many(amenitiesVenues),
  plansVenues: many(plansVenues),
}));

export type Venue = typeof venues.$inferSelect;
