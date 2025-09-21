# Docker Troubleshooting

## Port Conflicts
- If port 3000 or 5432 is busy, create `docker-compose.override.yml` to remap host ports (see `docker-compose.override.example.yml`).
- Verify conflicting processes with `netstat -ano | findstr 3000` or `Get-NetTCPConnection -LocalPort 5432`.

## Missing Environment Variables
- Ensure `docker/.env.docker` exists; copy from `.env.docker.example` and adjust secrets.
- The stack exits immediately when `DATABASE_URL` is absent. Rerun `pnpm docker:up` after fixing the file.

## Persistent Volume Reset
- To reset database state, run `pnpm docker:down` to remove the `postgres_data` volume, then `pnpm docker:up` to recreate it.
- Backup data before removal with `docker compose exec postgres pg_dump ${POSTGRES_DB}`.

## Slow Start or Healthcheck Failures
- Check container logs with `docker compose logs web` and `docker compose logs postgres`.
- Confirm migrations succeed; rerun `docker/prisma-setup.sh` inside the `web` container if needed.

## Prisma Migration Errors
- Ensure `pnpm prisma migrate deploy` completes; broken migrations will block start-up.
- Use `pnpm prisma migrate resolve --applied` cautiously to re-align state if a migration partially runs.
