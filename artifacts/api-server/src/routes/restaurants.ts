import { Router } from "express";
import { eq, ilike, and, or, sql } from "drizzle-orm";
import {
  db,
  restaurantsTable,
  cuisinesTable,
  restaurantCuisinesTable,
  menuItemsTable,
  menuCategoriesTable,
  reviewsTable,
  usersTable,
} from "@workspace/db";
import { optionalAuth } from "../middlewares/auth.js";
import { notFound, serverError } from "../lib/errors.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  try {
    const { search, cuisine, priceLevel, isOpen, limit = "20", offset = "0" } = req.query;

    const rows = await db
      .select({
        restaurant: restaurantsTable,
        cuisineName: cuisinesTable.name,
      })
      .from(restaurantsTable)
      .leftJoin(restaurantCuisinesTable, eq(restaurantCuisinesTable.restaurantId, restaurantsTable.id))
      .leftJoin(cuisinesTable, eq(cuisinesTable.id, restaurantCuisinesTable.cuisineId))
      .where(
        and(
          eq(restaurantsTable.isActive, true),
          search ? ilike(restaurantsTable.name, `%${search}%`) : undefined,
          priceLevel ? eq(restaurantsTable.priceLevel, Number(priceLevel)) : undefined,
          isOpen === "true" ? eq(restaurantsTable.isOpen, true) : undefined,
          cuisine
            ? sql`${restaurantsTable.id} IN (
                SELECT rc.restaurant_id FROM restaurant_cuisines rc
                JOIN cuisines c ON c.id = rc.cuisine_id
                WHERE LOWER(c.name) = LOWER(${cuisine})
              )`
            : undefined,
        ),
      )
      .limit(Number(limit))
      .offset(Number(offset));

    const restaurantMap = new Map<number, { restaurant: typeof restaurantsTable.$inferSelect; cuisines: string[] }>();
    for (const row of rows) {
      if (!restaurantMap.has(row.restaurant.id)) {
        restaurantMap.set(row.restaurant.id, { restaurant: row.restaurant, cuisines: [] });
      }
      if (row.cuisineName) {
        restaurantMap.get(row.restaurant.id)!.cuisines.push(row.cuisineName);
      }
    }

    const restaurants = Array.from(restaurantMap.values()).map(({ restaurant, cuisines }) => ({
      ...restaurant,
      cuisines,
    }));

    res.json({ restaurants, total: restaurants.length });
  } catch (e) {
    serverError(res);
  }
});

router.get("/cuisines", async (_req, res) => {
  try {
    const cuisines = await db
      .select()
      .from(cuisinesTable)
      .orderBy(cuisinesTable.name);
    res.json({ cuisines });
  } catch {
    serverError(res);
  }
});

router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      notFound(res, "Restaurant");
      return;
    }

    const rows = await db
      .select({
        restaurant: restaurantsTable,
        cuisineName: cuisinesTable.name,
      })
      .from(restaurantsTable)
      .leftJoin(restaurantCuisinesTable, eq(restaurantCuisinesTable.restaurantId, restaurantsTable.id))
      .leftJoin(cuisinesTable, eq(cuisinesTable.id, restaurantCuisinesTable.cuisineId))
      .where(and(eq(restaurantsTable.id, id), eq(restaurantsTable.isActive, true)));

    if (rows.length === 0) {
      notFound(res, "Restaurant");
      return;
    }

    const restaurant = {
      ...rows[0].restaurant,
      cuisines: rows.map((r) => r.cuisineName).filter(Boolean) as string[],
    };

    res.json({ restaurant });
  } catch {
    serverError(res);
  }
});

router.get("/:id/menu", async (req, res) => {
  try {
    const restaurantId = Number(req.params.id);
    if (isNaN(restaurantId)) {
      notFound(res, "Restaurant");
      return;
    }

    const [restaurant] = await db
      .select({ id: restaurantsTable.id })
      .from(restaurantsTable)
      .where(eq(restaurantsTable.id, restaurantId))
      .limit(1);

    if (!restaurant) {
      notFound(res, "Restaurant");
      return;
    }

    const categories = await db
      .select()
      .from(menuCategoriesTable)
      .where(eq(menuCategoriesTable.restaurantId, restaurantId))
      .orderBy(menuCategoriesTable.displayOrder);

    const items = await db
      .select()
      .from(menuItemsTable)
      .where(and(eq(menuItemsTable.restaurantId, restaurantId), eq(menuItemsTable.isAvailable, true)))
      .orderBy(menuItemsTable.displayOrder);

    const categoriesWithItems = categories.map((cat) => ({
      ...cat,
      items: items.filter((item) => item.categoryId === cat.id),
    }));

    const uncategorized = items.filter((item) => !item.categoryId);

    res.json({ categories: categoriesWithItems, uncategorized });
  } catch {
    serverError(res);
  }
});

router.get("/:id/reviews", async (req, res) => {
  try {
    const restaurantId = Number(req.params.id);
    const { limit = "20", offset = "0" } = req.query;

    const reviews = await db
      .select({
        id: reviewsTable.id,
        rating: reviewsTable.rating,
        comment: reviewsTable.comment,
        createdAt: reviewsTable.createdAt,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          avatarUrl: usersTable.avatarUrl,
        },
      })
      .from(reviewsTable)
      .innerJoin(usersTable, eq(usersTable.id, reviewsTable.userId))
      .where(eq(reviewsTable.restaurantId, restaurantId))
      .orderBy(sql`${reviewsTable.createdAt} DESC`)
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({ reviews });
  } catch {
    serverError(res);
  }
});

export default router;
