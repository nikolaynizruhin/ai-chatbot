import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";

import * as activities from "./schemas/activities";
import * as activitiesVenues from "./schemas/activities-venues";
import * as amenities from "./schemas/amenities";
import * as amenitiesVenues from "./schemas/amenities-venues";
import * as appointments from "./schemas/appointments";
import * as chats from "./schemas/chats";
import * as images from "./schemas/images";
import * as imagesVenues from "./schemas/images-venues";
import * as plans from "./schemas/plans";
import * as plansVenues from "./schemas/plans-venues";
import * as users from "./schemas/users";
import * as venues from "./schemas/venues";

config({
  path: ".env.local",
});

export const db = drizzle(
  {
    connection: process.env.POSTGRES_URL!,
    schema: {
      ...users,
      ...chats,
      ...activitiesVenues,
      ...activities,
      ...amenitiesVenues,
      ...amenities,
      ...appointments,
      ...imagesVenues,
      ...images,
      ...plansVenues,
      ...plans,
      ...venues,
    },
    casing: "snake_case",
  }
);
