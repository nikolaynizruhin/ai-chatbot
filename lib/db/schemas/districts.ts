import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { cities } from "./cities";

export const districts = pgTable('districts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  cityId: integer().notNull().references(() => cities.id),
});

export const districtsRelations = relations(districts, ({ one }) => ({
  city: one(cities, {
    fields: [districts.cityId],
    references: [cities.id],
  }),
}));

export type District = typeof districts.$inferSelect;
