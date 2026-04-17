import { Router } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db, favoritesTable, restaurantsTable, cuisinesTable, restaurantCuisinesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth.js";
import { badRequest, serverError } from "../lib/errors.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const rows = await db
      .select({
        restaurant: restaurantsTable,
        cuisineName: cuisinesTable.name,
        favoritedAt: favoritesTable.createdAt,
      })
      .from(favoritesTable)
      .innerJoin(restaurantsTable, eq(restaurantsTable.id, favoritesTable.restaurantId))
      .leftJoin(restaurantCuisinesTable, eq(restaurantCuisinesTable.restaurantId, restaurantsTable.id))
      .leftJoin(cuisinesTable, eq(cuisinesTable.id, restaurantCuisinesTable.cuisineId))
      .where(eq(favoritesTable.userId, req.user!.sub));

    const map = new Map<number, { restaurant: typeof restaurantsTable.$inferSelect; cuisines: string[]; favoritedAt: Date }>();
    for (const row of rows) {
      if (!map.has(row.restaurant.id)) {
        map.set(row.restaurant.id, { restaurant: row.restaurant, cuisines: [], favoritedAt: row.favoritedAt });
      }
      if (row.cuisineName) map.get(row.restaurant.id)!.cuisines.push(row.cuisineName);
    }

    const favorites = Array.from(map.values()).map(({ restaurant, cuisines, favoritedAt }) => ({
      ...restaurant,
      cuisines,
      favoritedAt,
    }));

    res.json({ favorites });
  } catch {
    serverError(res);
  }
});

router.post("/:restaurantId", async (req, res) => {
  const restaurantId = Number(req.params.restaurantId);
  if (isNaN(restaurantId)) {
    badRequest(res, "Invalid restaurant ID");
    return;
  }

  try {
    await db
      .insert(favoritesTable)
      .values({ userId: req.user!.sub, restaurantId })
      .onConflictDoNothing();

    res.status(201).json({ message: "Added to favorites" });
  } catch {
    serverError(res);
  }
});

router.delete("/:restaurantId", async (req, res) => {
  const restaurantId = Number(req.params.restaurantId);
  if (isNaN(restaurantId)) {
    badRequest(res, "Invalid restaurant ID");
    return;
  }

  try {
    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, req.user!.sub),
          eq(favoritesTable.restaurantId, restaurantId),
        ),
      );

    res.json({ message: "Removed from favorites" });
  } catch {
    serverError(res);
  }
});

export default router;
