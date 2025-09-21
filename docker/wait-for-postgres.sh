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

PGHOST="${POSTGRES_HOST:-postgres}"
PGPORT="${POSTGRES_PORT:-5432}"

echo "Waiting for PostgreSQL at ${PGHOST}:${PGPORT}..."

ATTEMPTS=30
until (echo >"/dev/tcp/${PGHOST}/${PGPORT}") >/dev/null 2>&1; do
  ATTEMPTS=$((ATTEMPTS - 1))
  if [ "$ATTEMPTS" -le 0 ]; then
    echo "PostgreSQL did not become reachable" >&2
    exit 1
  fi
  sleep 2
done

echo "PostgreSQL is reachable"

