import { relations } from "drizzle-orm";
import { index, integer, pgTable, serial, timestamp, varchar, vector } from "drizzle-orm/pg-core";

import { activities } from "./activities";
import { venues } from "./venues";

export const appointments = pgTable(
  'appointments',
  {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    image: varchar('image').notNull(),
    venueId: integer('venue_id').notNull().references(() => venues.id),
    activityId: integer('activity_id').notNull().references(() => activities.id),
    startAt: timestamp('start_at').notNull(),
    endAt: timestamp('end_at').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  table => ({
    embeddingIndex: index('embeddingAppointmentsIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  })
);

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  activity: one(activities, {
    fields: [appointments.activityId],
    references: [activities.id],
  }),
  venue: one(venues, {
    fields: [appointments.venueId],
    references: [venues.id],
  }),
}));

export type Appointment = typeof appointments.$inferSelect;
