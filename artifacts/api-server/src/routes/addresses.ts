import { Router } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db, addressesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth.js";
import { badRequest, notFound, serverError } from "../lib/errors.js";

const router = Router();

router.use(requireAuth);

const addressSchema = z.object({
  label: z.string().min(1).max(50).default("Home"),
  fullName: z.string().min(1).max(255),
  phone: z.string().min(5).max(30),
  line1: z.string().min(1).max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  zip: z.string().min(1).max(20),
  country: z.string().max(100).default("US"),
  isDefault: z.boolean().default(false),
});

router.get("/", async (req, res) => {
  try {
    const addresses = await db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.userId, req.user!.sub))
      .orderBy(addressesTable.isDefault, addressesTable.createdAt);

    res.json({ addresses });
  } catch {
    serverError(res);
  }
});

router.post("/", async (req, res) => {
  const parsed = addressSchema.safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }

  try {
    if (parsed.data.isDefault) {
      await db
        .update(addressesTable)
        .set({ isDefault: false })
        .where(eq(addressesTable.userId, req.user!.sub));
    }

    const [address] = await db
      .insert(addressesTable)
      .values({ ...parsed.data, userId: req.user!.sub })
      .returning();

    res.status(201).json({ address });
  } catch {
    serverError(res);
  }
});

router.patch("/:id", async (req, res) => {
  const parsed = addressSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(addressesTable)
      .where(and(eq(addressesTable.id, req.params.id), eq(addressesTable.userId, req.user!.sub)))
      .limit(1);

    if (!existing) {
      notFound(res, "Address");
      return;
    }

    if (parsed.data.isDefault) {
      await db
        .update(addressesTable)
        .set({ isDefault: false })
        .where(eq(addressesTable.userId, req.user!.sub));
    }

    const [address] = await db
      .update(addressesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(addressesTable.id, req.params.id))
      .returning();

    res.json({ address });
  } catch {
    serverError(res);
  }
});

router.patch("/:id/default", async (req, res) => {
  try {
    const [existing] = await db
      .select()
      .from(addressesTable)
      .where(and(eq(addressesTable.id, req.params.id), eq(addressesTable.userId, req.user!.sub)))
      .limit(1);

    if (!existing) {
      notFound(res, "Address");
      return;
    }

    await db
      .update(addressesTable)
      .set({ isDefault: false })
      .where(eq(addressesTable.userId, req.user!.sub));

    const [address] = await db
      .update(addressesTable)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(addressesTable.id, req.params.id))
      .returning();

    res.json({ address });
  } catch {
    serverError(res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db
      .delete(addressesTable)
      .where(and(eq(addressesTable.id, req.params.id), eq(addressesTable.userId, req.user!.sub)))
      .returning({ id: addressesTable.id });

    if (deleted.length === 0) {
      notFound(res, "Address");
      return;
    }

    res.json({ message: "Address deleted" });
  } catch {
    serverError(res);
  }
});

export default router;
