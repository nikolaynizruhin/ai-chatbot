import { relations } from "drizzle-orm";
import { integer, pgTable, serial, unique } from "drizzle-orm/pg-core";

import { plans } from "./plans";
import { venues } from "./venues";

export const plansVenues = pgTable(
  'plans_venues',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    planId: integer().notNull().references(() => plans.id),
    venueId: integer().notNull().references(() => venues.id),
  }, 
  table => ({
    unq: unique().on(table.planId, table.venueId),
  })
);

export const plansVenuesRelations = relations(plansVenues, ({ one }) => ({
  plan: one(plans, {
    fields: [plansVenues.planId],
    references: [plans.id],
  }),
  venue: one(venues, {
    fields: [plansVenues.venueId],
    references: [venues.id],
  }),
}));