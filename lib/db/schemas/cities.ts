import { relations } from "drizzle-orm";
import { geometry, index, integer, pgTable, varchar } from "drizzle-orm/pg-core";

import { countries } from "./countries";
import { districts } from "./districts";

export const cities = pgTable(
  'cities',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull().unique(),
    location: geometry({ type: 'point', mode: 'tuple', srid: 4326 }).notNull(),
    countryId: integer().notNull().references(() => countries.id),
  },
  table => [
    index().using('gist', table.location),
  ],
);

export const citiesRelations = relations(cities, ({ many, one }) => ({
  districts: many(districts),
  country: one(countries, {
    fields: [cities.countryId],
    references: [countries.id],
  }),
}));

export type City = typeof cities.$inferSelect;
