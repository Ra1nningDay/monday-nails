Usage

This repository includes `docker-compose.postgres.yml` — a minimal Docker Compose file to run only PostgreSQL for hosting / development.

Quick start

1. Ensure `docker/.env.docker` contains at least `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`.

2. Start Postgres:

```bash
docker compose -f docker-compose.postgres.yml up -d
```

3. Stop:

```bash
docker compose -f docker-compose.postgres.yml down
```

Security notes

- Do not commit production credentials in `docker/.env.docker`.
- Limit access to port `5432` via firewall or by removing `ports` mapping and using a Docker network.
- Configure backups (e.g., `pg_dump`) for production data.
