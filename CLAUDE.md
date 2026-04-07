# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

记账后端 API 服务 (Money Backend)，基于 Bun + Hono + PostgreSQL 的记账应用后端。

## Commands

```bash
# Development
bun run dev          # Development with watch mode (uses --bun flag)
bun run dev:hot      # Development with HMR (--hot flag)

# Build & Check
bun run build        # TypeScript compile (tsc)
bun run typecheck    # Type check only (tsc --noEmit)
bun run lint         # Runs typecheck as lint

# Test
bun run test         # Run all tests
bun test <file>      # Run specific test file

# Database
bun run db:init      # Initialize database tables
```

## Architecture

### Layered Structure

```
src/
├── index.ts                  # Entry point - mounts all routes, CORS, logging middleware
├── config/
│   ├── env.ts                # Environment variables (JWT, DB_URL)
│   └── database.ts           # pg Pool wrapper + raw SQL schema initialization
├── middleware/
│   └── auth.middleware.ts    # JWT auth middleware (AuthContext with user vars)
├── routes/*.routes.ts        # Route definitions (Hono routers)
├── controllers/*.controller.ts # Request handlers (parse params, call services)
├── services/*.service.ts     # Business logic (SQL queries via db.query)
├── types/*.ts                # TypeScript interfaces per module
└── utils/
    ├── token.ts              # JWT verify/sign helpers
    ├── password.ts           # bcrypt helpers
    ├── validation.ts         # Input validation
    ├── date.ts               # Date utilities
    └── logger.ts             # Logging utility
```

### Pattern: Routes → Controllers → Services → Direct SQL

- **Routes**: Define Hono routers, attach `authMiddleware` where needed, wire up controller handlers
- **Controllers**: Extract path/query/body params, call service methods, return `c.json()`
- **Services**: Contain all business logic, execute raw SQL queries via `db.query()` from `config/database.ts`
- **Types**: Each module has a corresponding types file (e.g. `types/budget.ts`)

### Database

- **No ORM** — uses raw PostgreSQL queries via `pg` connection pool
- Tables are created programmatically in `database.ts` via `CREATE TABLE IF NOT EXISTS`
- No Prisma or migration tooling; schema changes are made directly in `database.ts`
- All tables are multi-tenant via `user_id` foreign key with `ON DELETE CASCADE`

### Auth

- JWT-based with access tokens (short-lived, default 2h) and refresh tokens (30d, stored in DB)
- `authMiddleware` validates `Bearer` token and sets `user` variable (`userId`, `username`) on context
- Protected routes should apply the middleware at the router level

### API Modules (11 feature areas)

| Module | Route | Key Files |
|--------|-------|-----------|
| Auth | `/api/auth` | auth.routes/controller/service |
| Categories | `/api/categories` | category.* |
| Records | `/api/records` | record.* |
| Budgets | `/api/budgets` | budget.* |
| Savings | `/api/savings` | savings.* |
| Recurring | `/api/recurring` | recurring.* |
| Debts | `/api/debts` | debt.* |
| Accounts | `/api/accounts` | account.* |
| Reminders | `/api/reminders` | reminder.* |
| Templates | `/api/templates` | template.* |
| Sync | `/api/sync` | sync.* |

### Environment Variables

`JWT_SECRET`, `JWT_EXPIRES_IN` (default 2h), `REFRESH_TOKEN_EXPIRES_IN` (default 30d), `DATABASE_URL`. Server runs on port 9876.
