#!/bin/sh

# Make sure our backend app does not start before db ready
echo "Waiting for database...."

while ! nc -z db 3306; do
  sleep 0.1 # short pause between checks
done
echo "Database started"

# Apply db migrations
npx prisma db push

echo "Generating Prisma Client"
# Generate prisma client
npx prisma generate

# Generate example data for testing
npx prisma db seed

# Start the app
exec "$@"