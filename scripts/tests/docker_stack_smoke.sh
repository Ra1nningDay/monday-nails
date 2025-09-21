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

STACK_NAME="monday_nails_test"

cleanup() {
  $COMPOSE_BIN -p "$STACK_NAME" down -v >/dev/null 2>&1 || true
}
trap cleanup EXIT

$COMPOSE_BIN -p "$STACK_NAME" up --build -d

ATTEMPTS=30
until curl -sSf http://localhost:3000 >/dev/null; do
  ATTEMPTS=$((ATTEMPTS - 1))
  if [ "$ATTEMPTS" -le 0 ]; then
    echo "Application did not become ready on http://localhost:3000" >&2
    exit 1
  fi
  sleep 2
done

curl -sSf http://localhost:3000 >/dev/null
echo "Docker stack responded successfully"

