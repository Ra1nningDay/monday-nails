#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker command not available" >&2
  exit 1
fi

COMPOSE_BIN="docker compose"
if ! $COMPOSE_BIN version >/dev/null 2>&1; then
  echo "docker compose command not available" >&2
  exit 1
fi

ENV_FILE="${ROOT_DIR}/docker/.env.docker"
if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE="${ROOT_DIR}/docker/.env.docker.example"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Environment file not found at $ENV_FILE" >&2
  exit 1
fi

set -o allexport
# shellcheck source=/dev/null
source "$ENV_FILE"
set +o allexport

STACK_NAME="monday_nails_test"

cleanup() {
  $COMPOSE_BIN -p "$STACK_NAME" down -v >/dev/null 2>&1 || true
}
trap cleanup EXIT

$COMPOSE_BIN -p "$STACK_NAME" up -d postgres

ATTEMPTS=30
until $COMPOSE_BIN -p "$STACK_NAME" exec -T postgres pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" >/dev/null 2>&1; do
  ATTEMPTS=$((ATTEMPTS - 1))
  if [ "$ATTEMPTS" -le 0 ]; then
    echo "PostgreSQL did not become ready" >&2
    exit 1
  fi
  sleep 2
done

$COMPOSE_BIN -p "$STACK_NAME" exec -T postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c "SELECT 1;" >/dev/null
echo "PostgreSQL connection verified"


