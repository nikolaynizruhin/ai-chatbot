import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

import { db } from "../db";
import { appointments } from "../db/schemas/appointments";
import { venues } from "../db/schemas/venues";

const model = openai.embedding('text-embedding-3-small');

interface HasEmbedding {
  embedding: string
}

export async function addEmbeddings(list: HasEmbedding[]): Promise<any[]> {
  const embeddingList = list.map((item: HasEmbedding) => item.embedding)

  const embeddings = await generateEmbeddings(embeddingList);

  return list.map((item: any, index: number) => ({ ...item, embedding: embeddings[index]}))
}

export const generateEmbeddings = async (
  values: string[],
): Promise<Array<number[]>> => {
  const { embeddings } = await embedMany({ model, values });

  return embeddings;
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const { embedding } = await embed({ model, value });

  return embedding;
};

export const findRelevantVenues = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);

  const similarity = sql<number>`1 - (${cosineDistance(venues.embedding, userQueryEmbedded)})`;

  const similarVenues = await db
    .select({ name: venues.name, similarity })
    .from(venues)
    .where(gt(similarity, 0.3))
    .orderBy(table => desc(table.similarity))
    .limit(6);

  return similarVenues;
};

export const findRelevantAppointments = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);

  const similarity = sql<number>`1 - (${cosineDistance(appointments.embedding, userQueryEmbedded)})`;

  const similarAppointments = await db
    .select({ name: appointments.name, similarity })
    .from(appointments)
    .where(gt(similarity, 0.3))
    .orderBy(table => desc(table.similarity))
    .limit(6);

  return similarAppointments;
};
