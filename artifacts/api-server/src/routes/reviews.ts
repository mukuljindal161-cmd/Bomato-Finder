import { Router } from "express";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { db, reviewsTable, restaurantsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth.js";
import { badRequest, serverError, conflict } from "../lib/errors.js";

const router = Router();

const insertReviewSchema = z.object({
  restaurantId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  orderId: z.string().uuid().optional(),
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = insertReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }

  try {
    const existing = await db
      .select({ id: reviewsTable.id })
      .from(reviewsTable)
      .where(
        and(
          eq(reviewsTable.userId, req.user!.sub),
          eq(reviewsTable.restaurantId, parsed.data.restaurantId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      conflict(res, "You have already reviewed this restaurant");
      return;
    }

    const [review] = await db
      .insert(reviewsTable)
      .values({
        userId: req.user!.sub,
        restaurantId: parsed.data.restaurantId,
        orderId: parsed.data.orderId ?? null,
        rating: parsed.data.rating,
        comment: parsed.data.comment ?? null,
      })
      .returning();

    const stats = await db
      .select({
        avg: sql<string>`AVG(${reviewsTable.rating})`,
        count: sql<string>`COUNT(*)`,
      })
      .from(reviewsTable)
      .where(eq(reviewsTable.restaurantId, parsed.data.restaurantId));

    if (stats[0]) {
      await db
        .update(restaurantsTable)
        .set({
          rating: Number(stats[0].avg).toFixed(1),
          reviewCount: Number(stats[0].count),
          updatedAt: new Date(),
        })
        .where(eq(restaurantsTable.id, parsed.data.restaurantId));
    }

    const [user] = await db
      .select({ name: usersTable.name, avatarUrl: usersTable.avatarUrl })
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.sub))
      .limit(1);

    res.status(201).json({ review: { ...review, user } });
  } catch {
    serverError(res);
  }
});

export default router;
