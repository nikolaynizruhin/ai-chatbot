"server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { and, asc, desc, eq, inArray, lte, sql } from "drizzle-orm";

import { chats } from "./schemas/chats";
import { User, users } from "./schemas/users";

import { db } from ".";
import { activities } from "./schemas/activities";
import { amenities } from "./schemas/amenities";
import { plans } from "./schemas/plans";
import { venues } from "./schemas/venues";
import { activitiesVenues } from "./schemas/activities-venues";
import { amenitiesVenues } from "./schemas/amenities-venues";
import { plansVenues } from "./schemas/plans-venues";

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(users).where(eq(users.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await db.insert(users).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(chats).where(eq(chats.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chats)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chats.id, id));
    }

    return await db.insert(chats).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(chats).where(eq(chats.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chats)
      .where(eq(chats.userId, id))
      .orderBy(desc(chats.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chats).where(eq(chats.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function getVenues(activities: number[] = [], amenities: number[] = [], plans: number[] = [], position: string[] = []) {
  try {
    const location = sql`ST_SetSRID(ST_MakePoint(${position[0]}, ${position[1]}), 4326)`;
    const distance = sql`ROUND(ST_DistanceSphere(${venues.location}, ${location}))`;

    return await db.query.venues.findMany({
      extras: {
        distance: distance.as('distance'),
      },
      where: and(
        activities.length > 0 ? inArray(venues.id, db.select({ id: activitiesVenues.venueId }).from(activitiesVenues).where(inArray(activitiesVenues.activityId, activities))) : undefined,
        amenities.length > 0 ? inArray(venues.id, db.select({ id: amenitiesVenues.venueId }).from(amenitiesVenues).where(inArray(amenitiesVenues.amenityId, amenities))) : undefined,
        plans.length > 0 ? inArray(venues.id, db.select({ id: plansVenues.venueId }).from(plansVenues).where(inArray(plansVenues.planId, plans))) : undefined,
        sql`${distance} <= 6000`
      ),
      with: {
        activitiesVenues: {
          with: {
            activity: true
          }
        },
        amenitiesVenues: {
          with: {
            amenity: true
          }
        },
        plansVenues: {
          with: {
            plan: true
          }
        }
      }
    });
  } catch (error) {
    console.log(error)
    console.error("Failed to get venues from database");
    throw error;
  }
}

export async function getActivities() {
  try {
    return await db.select().from(activities);
  } catch (error) {
    console.error("Failed to get activities from database");
    throw error;
  }
}

export async function getAmenities() {
  try {
    return await db.select().from(amenities);
  } catch (error) {
    console.error("Failed to get amenities from database");
    throw error;
  }
}

export async function getPlans() {
  try {
    return await db.select().from(plans);
  } catch (error) {
    console.error("Failed to get plans from database");
    throw error;
  }
}
