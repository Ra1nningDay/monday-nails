#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

./docker/wait-for-postgres.sh

./docker/prisma-setup.sh

exec pnpm start

