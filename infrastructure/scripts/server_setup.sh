#!/bin/bash
set -e

REPO="/var/www/influxwise-apps"
PEM_APPS="$REPO/apps"

# Load DB URLs from pad's .env.local (same for all apps)
export DATABASE_URL=$(grep '^DATABASE_URL=' "$PEM_APPS/pad/.env.local" | sed 's/DATABASE_URL="\(.*\)"/\1/')
export DIRECT_URL=$(grep '^DIRECT_URL=' "$PEM_APPS/pad/.env.local" | sed 's/DIRECT_URL="\(.*\)"/\1/')

echo "==> DATABASE_URL loaded: ${DATABASE_URL:0:60}..."

# Run Prisma db push (creates all tables)
cd "$REPO/packages/db"
npx prisma db push --accept-data-loss
echo "==> Database schema pushed"

# Approve build scripts for Prisma
cd "$REPO"
echo '{"onlyBuiltDependencies":["@prisma/client","@prisma/engines","prisma","sharp"]}' > /tmp/pnpm_patch.json

# Build all apps
echo "==> Building all apps (this takes 3-5 minutes)..."
cd "$REPO"
pnpm build 2>&1 | tail -20
echo "==> Build complete"

# Configure Nginx
echo "==> Configuring Nginx..."
DOMAINS=("pad.influxwise.com" "flow.influxwise.com" "spark.influxwise.com" "revive.influxwise.com" "shield.influxwise.com" "admin.influxwise.com")
for domain in "${DOMAINS[@]}"; do
  sudo cp "$REPO/infrastructure/nginx/${domain}.conf" "/etc/nginx/sites-available/${domain}"
  sudo ln -sf "/etc/nginx/sites-available/${domain}" "/etc/nginx/sites-enabled/${domain}"
done
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
echo "==> Nginx configured"

# Open firewall ports
echo "==> Opening ports 80 and 443..."
sudo ufw allow 'Nginx Full' 2>/dev/null || true
sudo ufw allow 22 2>/dev/null || true

# Start with PM2
echo "==> Starting apps with PM2..."
cd "$REPO"
pm2 delete all 2>/dev/null || true
pm2 start infrastructure/scripts/pm2.config.js
pm2 save

# Set PM2 to auto-start on reboot
pm2 startup | grep "sudo" | bash || true
pm2 save

echo ""
echo "================================================"
echo " DEPLOYMENT COMPLETE"
echo " Apps running:"
echo "   pad.influxwise.com    -> :3001"
echo "   flow.influxwise.com   -> :3002"
echo "   spark.influxwise.com  -> :3003"
echo "   revive.influxwise.com -> :3004"
echo "   shield.influxwise.com -> :3005"
echo "   admin.influxwise.com  -> :3006"
echo "================================================"
pm2 list
