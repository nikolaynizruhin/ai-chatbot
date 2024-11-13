CREATE EXTENSION IF NOT EXISTS postgis;
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activities_venues" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "activities_venues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"activity_id" integer NOT NULL,
	"venue_id" integer NOT NULL,
	CONSTRAINT "activities_venues_activityId_venueId_unique" UNIQUE("activity_id","venue_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "activities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	CONSTRAINT "activities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "amenities_venues" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "amenities_venues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"amenity_id" integer NOT NULL,
	"venue_id" integer NOT NULL,
	CONSTRAINT "amenities_venues_amenityId_venueId_unique" UNIQUE("amenity_id","venue_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "amenities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "amenities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	CONSTRAINT "amenities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "appointments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"image" varchar NOT NULL,
	"venue_id" integer NOT NULL,
	"activity_id" integer NOT NULL,
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"messages" json NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"location" geometry(point) NOT NULL,
	"country_id" integer NOT NULL,
	CONSTRAINT "cities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "countries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	CONSTRAINT "countries_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "districts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "districts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"city_id" integer NOT NULL,
	CONSTRAINT "districts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images_venues" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "images_venues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"image_id" integer NOT NULL,
	"venue_id" integer NOT NULL,
	CONSTRAINT "images_venues_imageId_venueId_unique" UNIQUE("image_id","venue_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" varchar NOT NULL,
	CONSTRAINT "images_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plans_venues" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plans_venues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"plan_id" integer NOT NULL,
	"venue_id" integer NOT NULL,
	CONSTRAINT "plans_venues_planId_venueId_unique" UNIQUE("plan_id","venue_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	CONSTRAINT "plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "venues" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "venues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"image" varchar NOT NULL,
	"website" varchar NOT NULL,
	"address" varchar NOT NULL,
	"zip" varchar NOT NULL,
	"district_id" integer NOT NULL,
	"location" geometry(point) NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities_venues" ADD CONSTRAINT "activities_venues_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities_venues" ADD CONSTRAINT "activities_venues_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "amenities_venues" ADD CONSTRAINT "amenities_venues_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "amenities_venues" ADD CONSTRAINT "amenities_venues_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "districts" ADD CONSTRAINT "districts_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_venues" ADD CONSTRAINT "images_venues_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_venues" ADD CONSTRAINT "images_venues_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plans_venues" ADD CONSTRAINT "plans_venues_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plans_venues" ADD CONSTRAINT "plans_venues_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venues" ADD CONSTRAINT "venues_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointments_embedding_index" ON "appointments" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cities_location_index" ON "cities" USING gist ("location");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "venues_embedding_index" ON "venues" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "venues_location_index" ON "venues" USING gist ("location");