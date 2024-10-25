import { relations } from "drizzle-orm";
import { integer, pgTable, serial, unique } from "drizzle-orm/pg-core";

import { images } from "./images";
import { venues } from "./venues";

export const imagesVenues = pgTable(
  'images_venues',
  {
    id: serial('id').primaryKey(),
    imageId: integer('image_id').notNull().references(() => images.id),
    venueId: integer('venue_id').notNull().references(() => venues.id),
  },
  table => ({
    unq: unique().on(table.imageId, table.venueId),
  })
);

export const imagesVenuesRelations = relations(imagesVenues, ({ one }) => ({
  image: one(images, {
    fields: [imagesVenues.imageId],
    references: [images.id],
  }),
  venue: one(venues, {
    fields: [imagesVenues.venueId],
    references: [venues.id],
  }),
}));
