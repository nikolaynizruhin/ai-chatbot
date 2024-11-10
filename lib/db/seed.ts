import { config } from "dotenv";

import fixtures from './fixtures';
import { activities } from "./schemas/activities";
import { activitiesVenues } from "./schemas/activities-venues";
import { amenities } from "./schemas/amenities";
import { amenitiesVenues } from "./schemas/amenities-venues";
import { appointments } from "./schemas/appointments";
import { images } from "./schemas/images";
import { imagesVenues } from "./schemas/images-venues";
import { plans } from "./schemas/plans";
import { plansVenues } from "./schemas/plans-venues";
import { venues } from "./schemas/venues";
import { addEmbeddings } from "../ai/embedding";

import { db } from ".";
import { countries } from "./schemas/countries";
import { cities } from "./schemas/cities";
import { districts } from "./schemas/districts";

config({
  path: ".env.local",
});

async function seed() {
  await db.insert(countries).values(fixtures.countries);
  await db.insert(cities).values(fixtures.cities);
  await db.insert(districts).values(fixtures.districts);
  await db.insert(activities).values(fixtures.activities);
  await db.insert(amenities).values(fixtures.amenities);
  await db.insert(images).values(fixtures.images);
  await db.insert(plans).values(fixtures.plans);
  await db.insert(venues).values(await addEmbeddings(fixtures.venues));
  await db.insert(appointments).values(await addEmbeddings(fixtures.appointments));
  await db.insert(activitiesVenues).values(fixtures.activitiesVenues);
  await db.insert(amenitiesVenues).values(fixtures.amenitiesVenues);
  await db.insert(plansVenues).values(fixtures.plansVenues);
  await db.insert(imagesVenues).values(fixtures.imagesVenues);
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });