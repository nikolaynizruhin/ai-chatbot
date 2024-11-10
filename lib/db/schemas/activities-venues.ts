import { relations } from "drizzle-orm";
import { integer, pgTable, unique } from "drizzle-orm/pg-core";

import { activities } from "./activities";
import { venues } from "./venues";

export const activitiesVenues = pgTable(
  'activities_venues',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    activityId: integer().notNull().references(() => activities.id),
    venueId: integer().notNull().references(() => venues.id),
  }, 
  table => [unique().on(table.activityId, table.venueId)],
);

export const activitiesVenuesRelations = relations(activitiesVenues, ({ one }) => ({
  activity: one(activities, {
    fields: [activitiesVenues.activityId],
    references: [activities.id],
  }),
  venue: one(venues, {
    fields: [activitiesVenues.venueId],
    references: [venues.id],
  }),
}));
