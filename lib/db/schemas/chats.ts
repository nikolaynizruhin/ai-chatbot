import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import { pgTable, timestamp, json, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const chats = pgTable("chats", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  createdAt: timestamp().notNull(),
  messages: json().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
});

export type Chat = Omit<InferSelectModel<typeof chats>, "messages"> & {
  messages: Array<Message>;
};
