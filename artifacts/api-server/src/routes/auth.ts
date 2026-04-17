import { Router } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, usersTable, refreshTokensTable } from "@workspace/db";
import { hashPassword, verifyPassword } from "../lib/hash.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateRefreshExpiry,
} from "../lib/jwt.js";
import { requireAuth } from "../middlewares/auth.js";
import { badRequest, unauthorized, conflict, serverError, notFound } from "../lib/errors.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().max(30).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function issueTokens(userId: string, email: string, name: string) {
  const accessToken = signAccessToken({ sub: userId, email, name });
  const refreshToken = signRefreshToken(userId);
  return { accessToken, refreshToken };
}

async function storeRefreshToken(
  userId: string,
  refreshToken: string,
  req: import("express").Request,
) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = generateRefreshExpiry();
  await db.insert(refreshTokensTable).values({
    userId,
    tokenHash,
    expiresAt,
    userAgent: req.headers["user-agent"]?.slice(0, 512) ?? null,
    ipAddress: (req.ip ?? req.socket?.remoteAddress ?? "").slice(0, 64),
  });
}

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }
  const { name, email, password, phone } = parsed.data;

  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      conflict(res, "An account with this email already exists");
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(usersTable)
      .values({ name: name.trim(), email: email.toLowerCase(), passwordHash, phone: phone ?? null })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        createdAt: usersTable.createdAt,
      });

    const { accessToken, refreshToken } = issueTokens(user.id, user.email, user.name);
    await storeRefreshToken(user.id, refreshToken, req);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch {
    serverError(res);
  }
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }
  const { email, password } = parsed.data;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (!user || !user.passwordHash) {
      unauthorized(res, "Invalid email or password");
      return;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      unauthorized(res, "Invalid email or password");
      return;
    }

    if (!user.isActive) {
      unauthorized(res, "Account is deactivated");
      return;
    }

    const { accessToken, refreshToken } = issueTokens(user.id, user.email, user.name);
    await storeRefreshToken(user.id, refreshToken, req);

    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, accessToken, refreshToken });
  } catch {
    serverError(res);
  }
});

router.post("/refresh", async (req, res) => {
  const token = req.body?.refreshToken ?? req.cookies?.refreshToken;
  if (!token) {
    unauthorized(res, "Refresh token required");
    return;
  }

  try {
    const payload = verifyRefreshToken(token);
    const tokenHash = hashToken(token);

    const [stored] = await db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, tokenHash))
      .limit(1);

    if (!stored || stored.revokedAt || new Date(stored.expiresAt) < new Date()) {
      unauthorized(res, "Refresh token is invalid or expired");
      return;
    }

    const [user] = await db
      .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, isActive: usersTable.isActive })
      .from(usersTable)
      .where(eq(usersTable.id, payload.sub))
      .limit(1);

    if (!user || !user.isActive) {
      unauthorized(res, "User not found or deactivated");
      return;
    }

    await db
      .update(refreshTokensTable)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokensTable.id, stored.id));

    const { accessToken, refreshToken: newRefreshToken } = issueTokens(user.id, user.email, user.name);
    await storeRefreshToken(user.id, newRefreshToken, req);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch {
    unauthorized(res, "Refresh token is invalid or expired");
  }
});

router.post("/logout", async (req, res) => {
  const token = req.body?.refreshToken ?? req.cookies?.refreshToken;
  if (token) {
    try {
      const tokenHash = hashToken(token);
      await db
        .update(refreshTokensTable)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokensTable.tokenHash, tokenHash));
    } catch {
      // ignore
    }
  }
  res.json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        avatarUrl: usersTable.avatarUrl,
        isVerified: usersTable.isVerified,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.sub))
      .limit(1);

    if (!user) {
      notFound(res, "User");
      return;
    }

    res.json({ user });
  } catch {
    serverError(res);
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  const schema = z.object({
    name: z.string().min(1).max(255).optional(),
    phone: z.string().max(30).optional(),
    avatarUrl: z.string().url().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }

  try {
    const updates: Partial<typeof usersTable.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (parsed.data.name) updates.name = parsed.data.name.trim();
    if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
    if (parsed.data.avatarUrl !== undefined) updates.avatarUrl = parsed.data.avatarUrl;

    const [user] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, req.user!.sub))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        avatarUrl: usersTable.avatarUrl,
        isVerified: usersTable.isVerified,
        updatedAt: usersTable.updatedAt,
      });

    res.json({ user });
  } catch {
    serverError(res);
  }
});

router.post("/change-password", requireAuth, async (req, res) => {
  const schema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    badRequest(res, parsed.error.errors[0]?.message ?? "Invalid input");
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.sub))
      .limit(1);

    if (!user?.passwordHash) {
      notFound(res, "User");
      return;
    }

    const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!valid) {
      unauthorized(res, "Current password is incorrect");
      return;
    }

    const newHash = await hashPassword(parsed.data.newPassword);
    await db
      .update(usersTable)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id));

    await db
      .update(refreshTokensTable)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokensTable.userId, user.id));

    res.json({ message: "Password changed successfully. Please log in again." });
  } catch {
    serverError(res);
  }
});

export default router;
