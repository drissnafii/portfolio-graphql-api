#!/bin/bash

# Script to create/update admin user in MongoDB
# Usage: ./create-admin.sh [password]
# If no password is provided, it will read from .env file

# Load .env file if it exists
if [ -f .env ]; then
  # Export variables from .env file
  export $(grep -v '^#' .env | grep -v '^$' | xargs)
fi

# Set password from argument, environment variable, or .env file
PASSWORD="${1:-${ADMIN_PASSWORD}}"
EMAIL="${ADMIN_EMAIL:-admin@codefolio.com}"
USERNAME="${ADMIN_USERNAME:-admin}"

if [ -z "$PASSWORD" ]; then
  echo "❌ Error: Password is required!"
  echo ""
  echo "Usage:"
  echo "  ./create-admin.sh <password>"
  echo "  or"
  echo "  Set ADMIN_PASSWORD in .env file"
  echo "  or"
  echo "  ADMIN_PASSWORD='your_password' ./create-admin.sh"
  exit 1
fi

echo "🔧 Creating/updating admin user..."
echo "📧 Email: $EMAIL"
echo "👤 Username: $USERNAME"
echo ""

docker exec -it codefolio_api sh -c "
  DOCKER_ENV=true \
  MONGO_URI='mongodb://drissnafii:TheDendo2005@db:27017/codefolio?authSource=admin' \
  ADMIN_EMAIL='$EMAIL' \
  ADMIN_USERNAME='$USERNAME' \
  ADMIN_PASSWORD='$PASSWORD' \
  npx tsx create-admin.ts
"
