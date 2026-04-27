#!/bin/sh
set -e
cd /app/packages/db
npx prisma migrate deploy
cd /app/apps/api
exec node dist/main.js
