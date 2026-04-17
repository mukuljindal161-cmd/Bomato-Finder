import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const cuisinesTable = pgTable("cuisines", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

export const restaurantsTable = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 1024 }),
  bannerUrl: varchar("banner_url", { length: 1024 }),
  rating: numeric("rating", { precision: 3, scale: 1 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  priceLevel: integer("price_level").notNull().default(2),
  deliveryTimeMin: integer("delivery_time_min").notNull().default(20),
  deliveryTimeMax: integer("delivery_time_max").notNull().default(40),
  deliveryFee: numeric("delivery_fee", { precision: 8, scale: 2 }).notNull().default("0"),
  minOrder: numeric("min_order", { precision: 8, scale: 2 }).notNull().default("0"),
  isOpen: boolean("is_open").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  address: varchar("address", { length: 500 }),
  phone: varchar("phone", { length: 30 }),
  ownerId: uuid("owner_id").references(() => usersTable.id, { onDelete: "set null" }),
  distance: varchar("distance", { length: 20 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const restaurantCuisinesTable = pgTable(
  "restaurant_cuisines",
  {
    restaurantId: integer("restaurant_id").notNull().references(() => restaurantsTable.id, { onDelete: "cascade" }),
    cuisineId: integer("cuisine_id").notNull().references(() => cuisinesTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.restaurantId, t.cuisineId] })]
);

export const insertRestaurantSchema = createInsertSchema(restaurantsTable).omit({
  id: true, createdAt: true, updatedAt: true,
});

export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurantsTable.$inferSelect;
export type Cuisine = typeof cuisinesTable.$inferSelect;
