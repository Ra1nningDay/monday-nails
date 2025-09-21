# Tasks: Dockerized Deployment with PostgreSQL

**Input**: Design documents from `D:/Projects/Octotech/monday-nails/specs/001-can-u-create/`
**Prerequisites**: spec.md (available); plan.md (missing); research.md (missing); data-model.md (missing); quickstart.md (missing); contracts/ (missing)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   - If not found: NOTE "No implementation plan found"
   - Extract available context from spec.md instead
2. Load optional design documents when present
   - data-model.md → entities → model tasks
   - contracts/ → contract tests & endpoint tasks
   - research.md → technical decisions
   - quickstart.md → integration scenarios
3. Generate tasks by category (Setup → Tests → Core → Integration → Polish)
4. Apply task rules
   - Different files → mark [P] for parallel execution
   - Same file → keep sequential without [P]
   - Tests before implementation (TDD)
5. Validate coverage
   - All acceptance scenarios have tasks
   - Outstanding clarifications resolved before build
6. Return success once tasks are ordered and dependencies recorded
```

## Phase 3.1: Setup
- [X] T001 Resolve spec ambiguities (PostgreSQL version target, Docker usage scope) in `specs/001-can-u-create/spec.md` and document decisions.
- [X] T002 Add `.dockerignore` at repository root covering build artefacts, `node_modules`, and Prisma output.
- [X] T003 Add `docker/.env.docker.example` (and ensure `.env.docker` is git-ignored) with placeholders for app and database secrets.

## Phase 3.2: Tests First (TDD)
- [X] T004 [P] Create `scripts/tests/docker_stack_smoke.sh` that builds the stack via `docker compose` and asserts HTTP 200 from `http://localhost:3000` (expect failure until Docker resources exist).
- [X] T005 [P] Create `scripts/tests/postgres_connection.sh` that waits for the DB container then runs `psql` to verify credentials (expect failure until Compose is defined).
- [X] T006 Add a `test:docker` script in `package.json` wiring the new smoke tests so they can be executed via `pnpm test:docker` (fails until scripts succeed).

## Phase 3.3: Core Implementation
- [X] T007 Create a multi-stage `Dockerfile` that installs dependencies with pnpm, builds the Next.js app, and serves it via `pnpm start`.
- [X] T008 Add `docker-compose.yml` defining `web` (Next.js) and `postgres` services, networks, volumes, and env var wiring (`DATABASE_URL`, `POSTGRES_*`).
- [X] T009 Add `docker/app-entrypoint.sh` to run Prisma migrations and launch the Next.js server inside the container.
- [X] T010 Add `docker/wait-for-postgres.sh` to block the app container until PostgreSQL is ready.
- [X] T011 Add `docker/prisma-setup.sh` that chains `pnpm prisma migrate deploy` and `pnpm prisma db seed` for container initialization.

## Phase 3.4: Integration
- [X] T012 Create `docker-compose.override.example.yml` demonstrating port overrides, volume remapping, and referencing `.env.docker` for local customization.
- [X] T013 Extend `package.json` with `docker:build`, `docker:up`, and `docker:down` scripts that wrap compose commands and call the entrypoint helpers.

## Phase 3.5: Polish
- [X] T014 [P] Update `README.md` with Docker usage instructions (build, run, stop, clean) and reference `.env.docker.example`.
- [X] T015 [P] Add `docs/docker-troubleshooting.md` covering port conflicts, missing env vars, and data volume recovery steps.
- [X] T016 [P] Add `docs/docker-workflow.md` onboarding guide describing how to run migrations, seeds, and smoke tests inside the containers.

## Dependencies
- T001 must complete before any Docker configuration tasks (T002-T016) to ensure confirmed requirements.
- T004-T006 must exist and fail before implementing Docker resources (T007-T011).
- T006 blocks T013 because both modify `package.json` (apply sequentially).
- T007 precedes T008 since the compose stack references the Dockerfile build stage.
- T008 precedes T009-T011; entrypoint and helper scripts rely on compose definitions.
- T009-T011 must finish before integration scripts (T012-T013) to guarantee referenced commands exist.
- Documentation tasks (T014-T016) run last after the stack is functional.

## Parallel Example
```
# After completing setup (T001-T003), launch test authoring in parallel:
Task: "T004 Create scripts/tests/docker_stack_smoke.sh"
Task: "T005 Create scripts/tests/postgres_connection.sh"
```

## Notes
- [P] denotes tasks that can run in parallel because they touch distinct files or resources.
- Keep smoke tests deterministic (clean up containers between runs).
- Prefer pnpm commands inside containers to align with repo tooling.
