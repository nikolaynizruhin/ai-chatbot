import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import { pgTable, timestamp, json, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("created_at").notNull(),
  messages: json("messages").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

export type Chat = Omit<InferSelectModel<typeof chats>, "messages"> & {
  messages: Array<Message>;
};
