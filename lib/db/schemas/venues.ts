import { relations } from "drizzle-orm";
import { index, pgTable, point, serial, varchar, vector } from "drizzle-orm/pg-core";

import { activitiesVenues } from "./activities-venues";
import { amenitiesVenues } from "./amenities-venues";
import { plansVenues } from "./plans-venues";

export const venues = pgTable(
  'venues',
  {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    description: varchar('description').notNull(),
    image: varchar('image').notNull(),
    website: varchar('website').notNull(),
    address: varchar('address').notNull(),
    location: point('location'),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  table => ({
    embeddingIndex: index('embeddingVenuesIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  })
);

export const venuesRelations = relations(venues, ({ many }) => ({
  activitiesVenues: many(activitiesVenues),
  amenitiesVenues: many(amenitiesVenues),
  plansVenues: many(plansVenues),
}));

export type Venue = typeof venues.$inferSelect;
