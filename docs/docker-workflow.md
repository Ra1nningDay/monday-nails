# Docker Workflow Guide

## Prerequisites
- Docker Engine 24+ and Docker Compose v2.
- pnpm 9+ (optional for local commands outside containers).

## Initial Setup
1. Copy `docker/.env.docker.example` to `docker/.env.docker` and update secrets.
2. Run `pnpm docker:build` to build the application image.
3. Start the stack with `pnpm docker:up` (runs Prisma migrations and seeds automatically).

## Day-to-Day Commands
- `pnpm docker:up` – build and start the stack in the foreground.
- `pnpm docker:down` – stop containers and remove volumes.
- `pnpm test:docker` – run smoke tests (`docker_stack_smoke.sh` and `postgres_connection.sh`).

## Database Operations
- Apply schema changes with `pnpm docker:up` (entrypoint executes `docker/prisma-setup.sh`).
- Run ad-hoc Prisma commands inside the app container: `docker compose exec web pnpm prisma studio`.
- Snapshot the DB: `docker compose exec postgres pg_dump ${POSTGRES_DB} > backup.sql`.

## Logs & Debugging
- `docker compose logs web --follow` to inspect Next.js output.
- `docker compose logs postgres --follow` for database issues.
- See `docs/docker-troubleshooting.md` for common failure modes.

## Cleanup
- Remove dangling images: `docker image prune`.
- Reset database volume: `pnpm docker:down && docker volume rm monday-nails_postgres_data`.

## CI/CD Notes
- The Dockerfile builds a production-grade image; reuse it for staging/production.
- Compose files are intended for local/staging orchestration—deployments should consume the same image with environment-specific configuration.
