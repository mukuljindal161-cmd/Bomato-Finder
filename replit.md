# Bomato

## Overview

Bomato is a production-ready restaurant listing and food ordering web app (Zomato-inspired). It is built as a pnpm workspace monorepo with a React + Vite frontend and an Express + Drizzle ORM + PostgreSQL backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Wouter (routing)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod
- **Auth**: JWT (access + refresh tokens), bcryptjs for password hashing
- **Build**: esbuild (CJS bundle for API), Vite (frontend)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port from $PORT, proxied at /api)
│   └── web/                # React + Vite frontend (port from $PORT, served at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Features

- **Auth**: register, login, refresh tokens, logout, profile update, change password
- **Restaurants**: browse/filter by cuisine/price/open status, detail page, menu
- **Cart**: add/update/remove items (per-restaurant, requires auth)
- **Orders**: create from cart, list orders, view order detail (requires auth)
- **Reviews**: list + create for restaurants (requires auth)
- **Favorites**: add/remove/list (requires auth)
- **Addresses**: CRUD + set default (requires auth)
- **Seed data**: 12 restaurants with full menus seeded on first startup

## API Server (`artifacts/api-server`)

- Entry: `src/index.ts`
- App setup: `src/app.ts` — mounts CORS, JSON parsing, cookie-parser, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers
  - `/api/auth` — register, login, refresh, logout, me, change-password
  - `/api/restaurants` — list (with filters), detail, menu, reviews, cuisines
  - `/api/cart` — cart CRUD (auth required)
  - `/api/addresses` — address CRUD (auth required)
  - `/api/orders` — create from cart, list, detail (auth required)
  - `/api/reviews` — list + create (auth required for create)
  - `/api/favorites` — list, add, remove (auth required)
- Lib: `src/lib/jwt.ts` (access/refresh token helpers), `src/lib/hash.ts` (bcrypt), `src/lib/errors.ts`
- Middleware: `src/middlewares/auth.ts` (requireAuth/optionalAuth)
- Seed: `src/lib/seed.ts` — runs on startup, skips if restaurants already exist

## Frontend (`artifacts/web`)

- Entry: `src/App.tsx` — sets up QueryClientProvider, TooltipProvider, AuthProvider, Wouter Router
- Auth context: `src/contexts/AuthContext.tsx` — manages user state, login/register/logout functions
- API helper: `src/lib/api.ts` — fetch wrapper with auto-token refresh on 401
- Pages:
  - `/` — Home (restaurant list from API with search/filter)
  - `/restaurant/:id` — Restaurant detail + menu (from API)
  - `/order-summary` — Order review page
  - `/payment` — Payment + delivery details; creates real order via API if logged in
  - `/order-confirmation` — Shows real order number from API
  - `/login` — Login page
  - `/register` — Register page
  - `/orders` — Order history (requires auth)
  - `/account` — Profile + password management (requires auth)
- Components: `Header.tsx` (user dropdown with logout), `SearchBar.tsx`, `RestaurantCard.tsx`

## Key Design Decisions

- Access token stored in memory; refresh token in localStorage (`bomato_refresh_token`)
- API proxy: Replit's shared proxy at port 80 routes `/api/...` to the API server and `/` to the web app
- Menu API response format: `{ categories: [{ name, items: [] }], uncategorized: [] }` (flattened in frontend)
- Order creation goes through cart: frontend syncs items to backend cart, then POSTs to `/api/orders`
- Restaurant seed guard: checks if any restaurants exist before seeding (idempotent)
- Order number format: `BOM-XXXXXXXX`

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provided by Replit)
- `JWT_SECRET` — Secret for signing access tokens
- `JWT_REFRESH_SECRET` — Secret for signing refresh tokens
- `JWT_ACCESS_EXPIRES_IN` — Access token expiry (default: `15m`)
- `JWT_REFRESH_EXPIRES_IN` — Refresh token expiry (default: `7d`)
- `PORT` — Port for each service (auto-assigned per artifact)
- `BASE_PATH` — Base URL path for the web app (auto-assigned per artifact)

## Database Schema

Tables: `users`, `refresh_tokens`, `password_reset_tokens`, `addresses`, `restaurants`, `cuisines`, `restaurant_cuisines`, `menu_categories`, `menu_items`, `carts`, `cart_items`, `orders`, `order_items`, `reviews`, `favorites`

## Development

```bash
# Start API server
pnpm --filter @workspace/api-server run dev

# Start web app
pnpm --filter @workspace/web run dev

# Push DB schema changes
pnpm --filter @workspace/db run push
```
