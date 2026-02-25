#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

echo -e "Running database migrations...\n"

# This command will apply any pending migrations from the /drizzle folder.
pnpm db:migrate

echo -e "\n Migrations complete. Starting application...\n"
# This will execute the SvelteKit node server.
exec node build/index.js