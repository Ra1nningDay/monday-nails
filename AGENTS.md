# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router (pages, layouts, API routes under `app/api`).
- `src/components`, `src/hooks`, `src/lib`, `src/utils`, `src/types`: UI, state, Prisma client, helpers, and TypeScript types.
- `prisma/schema.prisma`: PostgreSQL models; migrations in `prisma/migrations`.
- `public/`: static assets (fonts, svgs, images).
- Root config: `next.config.ts`, `tsconfig.json` (alias `@/*` → `src/*`), `eslint.config.mjs`, `middleware.ts`.

## Build, Test, and Development Commands
- `pnpm dev`: Run Next.js in dev mode with Turbopack.
- `pnpm build`: Production build.
- `pnpm start`: Start the compiled app.
- `pnpm lint`: Lint code using Next + TypeScript rules.
- Database (Prisma): `pnpm prisma migrate dev`, `pnpm prisma generate`, `pnpm prisma studio`.

## Coding Style & Naming Conventions
- TypeScript, strict mode on; prefer explicit types at boundaries.
- Components: PascalCase (`Button.tsx`); hooks: `useName.ts`; utilities: camelCase.
- App routes and folders: kebab-case; colocate route UI in `src/app/**/page.tsx`.
- Imports: use `@/` alias for `src` (e.g., `import { db } from '@/lib/prisma'`).
- ESLint: Next core-web-vitals + TypeScript; fix warnings before merge. Indentation: 2 spaces.

## Testing Guidelines
- No test runner is configured yet. Recommended:
  - Unit: Vitest + React Testing Library.
  - E2E: Playwright for critical flows.
- Place tests next to code or under `src/**/__tests__`.
- Naming: `*.test.ts` / `*.test.tsx`.
- Add a script in `package.json` when introducing tests (e.g., `"test": "vitest"`).

## Commit & Pull Request Guidelines
- Commits: concise, imperative. Prefer Conventional Commits (`feat:`, `fix:`, `chore:`).
- PRs: clear description, linked issue, steps to verify. Include screenshots for UI changes and note schema changes/migrations.
- Keep diffs focused; update docs when changing public APIs or routes.

## Security & Configuration
- Environment: set `DATABASE_URL` in `.env` (PostgreSQL). Do not commit `.env`.
- After changing `schema.prisma`, run `pnpm prisma migrate dev && pnpm prisma generate`.
- Review middleware and API routes for auth where applicable (e.g., `src/app/api/**`).
