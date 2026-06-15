#!/bin/sh
# backend/migrate.sh
# Usage: ./backend/migrate.sh "add projects table"
set -e
docker compose exec backend alembic revision --autogenerate -m "$1"
docker compose exec backend alembic upgrade head