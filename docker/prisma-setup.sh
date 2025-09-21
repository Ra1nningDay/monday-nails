#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE="./docker/.env.docker"
if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE="./docker/.env.docker.example"
fi

if [ -f "$ENV_FILE" ]; then
  set -o allexport
  # shellcheck source=/dev/null
  source "$ENV_FILE"
  set +o allexport
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required for Prisma migrations" >&2
  exit 1
fi

pnpm db:migrate
pnpm db:seed || true


