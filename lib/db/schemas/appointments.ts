import { relations } from "drizzle-orm";
import { index, integer, pgTable, serial, timestamp, varchar, vector } from "drizzle-orm/pg-core";

import { activities } from "./activities";
import { venues } from "./venues";

export const appointments = pgTable(
  'appointments',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    image: varchar().notNull(),
    venueId: integer().notNull().references(() => venues.id),
    activityId: integer().notNull().references(() => activities.id),
    startAt: timestamp().notNull(),
    endAt: timestamp().notNull(),
    embedding: vector({ dimensions: 1536 }),
  },
  table => ({
    embeddingIndex: index().using('hnsw', table.embedding.op('vector_cosine_ops')),
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
