#!/bin/bash

# Script to create/update admin user in MongoDB
# Usage: ./create-admin.sh [password]

# Set default password from argument or environment variable
PASSWORD="${1:-${ADMIN_PASSWORD}}"

if [ -z "$PASSWORD" ]; then
  echo "❌ Error: Password is required!"
  echo ""
  echo "Usage:"
  echo "  ./create-admin.sh <password>"
  echo "  or"
  echo "  ADMIN_PASSWORD='your_password' ./create-admin.sh"
  exit 1
fi

echo "🔧 Creating/updating admin user..."

docker exec -it codefolio_api sh -c "
  DOCKER_ENV=true \
  MONGO_URI='mongodb://drissnafii:TheDendo2005@db:27017/codefolio?authSource=admin' \
  ADMIN_EMAIL=admin@codefolio.com \
  ADMIN_USERNAME=admin \
  ADMIN_PASSWORD='$PASSWORD' \
  npx tsx create-admin.ts
"
