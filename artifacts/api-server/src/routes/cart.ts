import { Router } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db, cartsTable, cartItemsTable, menuItemsTable, restaurantsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth.js";
import { badRequest, notFound, serverError, conflict } from "../lib/errors.js";

const router = Router();

router.use(requireAuth);

async function getOrCreateCart(userId: string, restaurantId?: number) {
  const [existing] = await db
    .select()
    .from(cartsTable)
    .where(eq(cartsTable.userId, userId))
    .limit(1);

  if (existing) return existing;

  const [cart] = await db
    .insert(cartsTable)
    .values({ userId, restaurantId: restaurantId ?? null })
    .returning();

  return cart;
}

async function getCartWithItems(userId: string) {
  const [cart] = await db
    .select()
    .from(cartsTable)
    .where(eq(cartsTable.userId, userId))
    .limit(1);

  if (!cart) return null;

  const items = await db
    .select({
      id: cartItemsTable.id,
      cartId: cartItemsTable.cartId,
      quantity: cartItemsTable.quantity,
      unitPrice: cartItemsTable.unitPrice,
      menuItem: {
        id: menuItemsTable.id,
        name: menuItemsTable.name,
        description: menuItemsTable.description,
        price: menuItemsTable.price,
        imageUrl: menuItemsTable.imageUrl,
        isAvailable: menuItemsTable.isAvailable,
      },
    })
    .from(cartItemsTable)
    .innerJoin(menuItemsTable, eq(menuItemsTable.id, cartItemsTable.menuItemId))
    .where(eq(cartItemsTable.cartId, cart.id));

  const restaurant = cart.restaurantId
    ? await db
        .select({ id: restaurantsTable.id, name: restaurantsTable.name, imageUrl: restaurantsTable.imageUrl })
        .from(restaurantsTable)
        .where(eq(restaurantsTable.id, cart.restaurantId))
        .then((r) => r[0] ?? null)
    : null;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );

  return { ...cart, items, restaurant, subtotal };
}

router.get("/", async (req, res) => {
  try {
    const cart = await getCartWithItems(req.user!.sub);
    if (!cart) {
      res.json({ cart: null });
      return;
    }
    res.json({ cart });
  } catch {
    serverError(res);
  }
});

router.post("/items", async (req, res) => {
  const schema = z.object({
    menuItemId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(50).default(1),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }

  const { menuItemId, quantity } = parsed.data;

  try {
    const [menuItem] = await db
      .select()
      .from(menuItemsTable)
      .where(and(eq(menuItemsTable.id, menuItemId), eq(menuItemsTable.isAvailable, true)))
      .limit(1);

    if (!menuItem) {
      notFound(res, "Menu item");
      return;
    }

    const cart = await getOrCreateCart(req.user!.sub, menuItem.restaurantId);

    if (cart.restaurantId && cart.restaurantId !== menuItem.restaurantId) {
      conflict(res, "Cannot mix items from different restaurants. Please clear your cart first.");
      return;
    }

    if (!cart.restaurantId) {
      await db
        .update(cartsTable)
        .set({ restaurantId: menuItem.restaurantId, updatedAt: new Date() })
        .where(eq(cartsTable.id, cart.id));
    }

    const [existingItem] = await db
      .select()
      .from(cartItemsTable)
      .where(and(eq(cartItemsTable.cartId, cart.id), eq(cartItemsTable.menuItemId, menuItemId)))
      .limit(1);

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      await db
        .update(cartItemsTable)
        .set({ quantity: newQty, updatedAt: new Date() })
        .where(eq(cartItemsTable.id, existingItem.id));
    } else {
      await db.insert(cartItemsTable).values({
        cartId: cart.id,
        menuItemId,
        quantity,
        unitPrice: menuItem.price,
      });
    }

    const updatedCart = await getCartWithItems(req.user!.sub);
    res.status(201).json({ cart: updatedCart });
  } catch {
    serverError(res);
  }
});

router.patch("/items/:itemId", async (req, res) => {
  const schema = z.object({ quantity: z.number().int().min(0).max(50) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }

  try {
    const [cart] = await db
      .select()
      .from(cartsTable)
      .where(eq(cartsTable.userId, req.user!.sub))
      .limit(1);

    if (!cart) {
      notFound(res, "Cart");
      return;
    }

    const [item] = await db
      .select()
      .from(cartItemsTable)
      .where(and(eq(cartItemsTable.id, req.params.itemId), eq(cartItemsTable.cartId, cart.id)))
      .limit(1);

    if (!item) {
      notFound(res, "Cart item");
      return;
    }

    if (parsed.data.quantity === 0) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.id, item.id));
    } else {
      await db
        .update(cartItemsTable)
        .set({ quantity: parsed.data.quantity, updatedAt: new Date() })
        .where(eq(cartItemsTable.id, item.id));
    }

    await db.update(cartsTable).set({ updatedAt: new Date() }).where(eq(cartsTable.id, cart.id));

    const updatedCart = await getCartWithItems(req.user!.sub);
    res.json({ cart: updatedCart });
  } catch {
    serverError(res);
  }
});

router.delete("/items/:itemId", async (req, res) => {
  try {
    const [cart] = await db
      .select()
      .from(cartsTable)
      .where(eq(cartsTable.userId, req.user!.sub))
      .limit(1);

    if (!cart) {
      notFound(res, "Cart");
      return;
    }

    await db
      .delete(cartItemsTable)
      .where(and(eq(cartItemsTable.id, req.params.itemId), eq(cartItemsTable.cartId, cart.id)));

    const remaining = await db
      .select({ id: cartItemsTable.id })
      .from(cartItemsTable)
      .where(eq(cartItemsTable.cartId, cart.id));

    if (remaining.length === 0) {
      await db
        .update(cartsTable)
        .set({ restaurantId: null, updatedAt: new Date() })
        .where(eq(cartsTable.id, cart.id));
    }

    const updatedCart = await getCartWithItems(req.user!.sub);
    res.json({ cart: updatedCart });
  } catch {
    serverError(res);
  }
});

router.delete("/", async (req, res) => {
  try {
    const [cart] = await db
      .select()
      .from(cartsTable)
      .where(eq(cartsTable.userId, req.user!.sub))
      .limit(1);

    if (cart) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
      await db
        .update(cartsTable)
        .set({ restaurantId: null, updatedAt: new Date() })
        .where(eq(cartsTable.id, cart.id));
    }

    res.json({ message: "Cart cleared" });
  } catch {
    serverError(res);
  }
});

export default router;
