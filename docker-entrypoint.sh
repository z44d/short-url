#!/bin/sh
set -e
mkdir -p /app/data
printenv

exec bun run src/index.ts