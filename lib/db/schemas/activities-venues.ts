import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, serial, unique } from "drizzle-orm/pg-core";

import { activities } from "./activities";
import { venues } from "./venues";

export const activitiesVenues = pgTable(
  'activities_venues',
  {
    id: serial('id').primaryKey(),
    activityId: integer('activity_id').notNull().references(() => activities.id),
    venueId: integer('venue_id').notNull().references(() => venues.id),
  }, 
  table => ({
    unq: unique().on(table.activityId, table.venueId),
  })
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
