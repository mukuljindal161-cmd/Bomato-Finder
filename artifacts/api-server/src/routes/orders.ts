import { Router } from "express";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import {
  db,
  ordersTable,
  orderItemsTable,
  cartsTable,
  cartItemsTable,
  menuItemsTable,
  restaurantsTable,
  addressesTable,
} from "@workspace/db";
import { requireAuth } from "../middlewares/auth.js";
import { badRequest, notFound, serverError } from "../lib/errors.js";
import { generateOrderNumber } from "../lib/order-number.js";

const router = Router();

router.use(requireAuth);

const createOrderSchema = z.object({
  paymentMethod: z.enum(["upi", "card", "cod"]),
  addressId: z.string().uuid().optional(),
  deliveryAddress: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(5),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().default(""),
    state: z.string().default(""),
    zip: z.string().default(""),
    country: z.string().default("US"),
  }).optional(),
  notes: z.string().max(500).optional(),
});

router.post("/", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }

  const { paymentMethod, addressId, deliveryAddress, notes } = parsed.data;

  try {
    const [cart] = await db
      .select()
      .from(cartsTable)
      .where(eq(cartsTable.userId, req.user!.sub))
      .limit(1);

    if (!cart || !cart.restaurantId) {
      badRequest(res, "Cart is empty");
      return;
    }

    const cartItems = await db
      .select({
        id: cartItemsTable.id,
        quantity: cartItemsTable.quantity,
        unitPrice: cartItemsTable.unitPrice,
        menuItem: {
          id: menuItemsTable.id,
          name: menuItemsTable.name,
          price: menuItemsTable.price,
        },
      })
      .from(cartItemsTable)
      .innerJoin(menuItemsTable, eq(menuItemsTable.id, cartItemsTable.menuItemId))
      .where(eq(cartItemsTable.cartId, cart.id));

    if (cartItems.length === 0) {
      badRequest(res, "Cart is empty");
      return;
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0,
    );

    const [restaurant] = await db
      .select({ deliveryFee: restaurantsTable.deliveryFee })
      .from(restaurantsTable)
      .where(eq(restaurantsTable.id, cart.restaurantId))
      .limit(1);

    const deliveryFee = restaurant ? Number(restaurant.deliveryFee) : 0;
    const total = subtotal + deliveryFee;

    let resolvedAddress: Record<string, unknown> | null = null;
    if (addressId) {
      const [addr] = await db
        .select()
        .from(addressesTable)
        .where(and(eq(addressesTable.id, addressId), eq(addressesTable.userId, req.user!.sub)))
        .limit(1);
      if (addr) {
        resolvedAddress = {
          fullName: addr.fullName,
          phone: addr.phone,
          line1: addr.line1,
          line2: addr.line2,
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
          country: addr.country,
        };
      }
    } else if (deliveryAddress) {
      resolvedAddress = deliveryAddress;
    }

    let orderNumber = generateOrderNumber();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await db
        .select({ id: ordersTable.id })
        .from(ordersTable)
        .where(eq(ordersTable.orderNumber, orderNumber))
        .limit(1);
      if (existing.length === 0) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    const [order] = await db
      .insert(ordersTable)
      .values({
        orderNumber,
        userId: req.user!.sub,
        restaurantId: cart.restaurantId,
        addressId: addressId ?? null,
        deliveryAddress: resolvedAddress,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        total: total.toFixed(2),
        notes: notes ?? null,
        estimatedDeliveryMinutes: 35,
      })
      .returning();

    await db.insert(orderItemsTable).values(
      cartItems.map((item) => ({
        orderId: order.id,
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: (Number(item.unitPrice) * item.quantity).toFixed(2),
      })),
    );

    await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
    await db
      .update(cartsTable)
      .set({ restaurantId: null, updatedAt: new Date() })
      .where(eq(cartsTable.id, cart.id));

    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, order.id));

    res.status(201).json({ order: { ...order, items } });
  } catch (e) {
    serverError(res);
  }
});

router.get("/", async (req, res) => {
  try {
    const { limit = "20", offset = "0" } = req.query;

    const orders = await db
      .select({
        order: ordersTable,
        restaurantName: restaurantsTable.name,
        restaurantImage: restaurantsTable.imageUrl,
      })
      .from(ordersTable)
      .leftJoin(restaurantsTable, eq(restaurantsTable.id, ordersTable.restaurantId))
      .where(eq(ordersTable.userId, req.user!.sub))
      .orderBy(sql`${ordersTable.createdAt} DESC`)
      .limit(Number(limit))
      .offset(Number(offset));

    const result = await Promise.all(
      orders.map(async (row) => {
        const items = await db
          .select()
          .from(orderItemsTable)
          .where(eq(orderItemsTable.orderId, row.order.id));
        return {
          ...row.order,
          restaurantName: row.restaurantName,
          restaurantImage: row.restaurantImage,
          items,
        };
      }),
    );

    res.json({ orders: result });
  } catch {
    serverError(res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [row] = await db
      .select({
        order: ordersTable,
        restaurantName: restaurantsTable.name,
        restaurantImage: restaurantsTable.imageUrl,
      })
      .from(ordersTable)
      .leftJoin(restaurantsTable, eq(restaurantsTable.id, ordersTable.restaurantId))
      .where(and(eq(ordersTable.id, req.params.id), eq(ordersTable.userId, req.user!.sub)))
      .limit(1);

    if (!row) {
      notFound(res, "Order");
      return;
    }

    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, row.order.id));

    res.json({
      order: {
        ...row.order,
        restaurantName: row.restaurantName,
        restaurantImage: row.restaurantImage,
        items,
      },
    });
  } catch {
    serverError(res);
  }
});

export default router;
