import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { imagesVenues } from "./images-venues";

export const images = pgTable('images', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: varchar('url').notNull().unique(),
});

export const imagesRelations = relations(images, ({ many }) => ({
  imagesVenues: many(imagesVenues),
}));

export type Image = typeof images.$inferSelect;
