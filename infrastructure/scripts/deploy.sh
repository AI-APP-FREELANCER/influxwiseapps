#!/bin/bash
# ============================================================
# Influxwise Apps — EC2 Deploy Script (Ubuntu 22.04, us-west-2)
# Run once on a fresh EC2 instance — IP: 18.237.13.186
# ============================================================
set -euo pipefail

REPO_DIR="/var/www/influxwise-apps"
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
APPS=("pad" "flow" "spark" "revive" "shield" "admin")
DOMAINS=("pad.influxwise.com" "flow.influxwise.com" "spark.influxwise.com" "revive.influxwise.com" "shield.influxwise.com" "admin.influxwise.com")

echo "==> Updating system packages"
sudo apt-get update -y && sudo apt-get upgrade -y

echo "==> Installing Node.js 20 LTS"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "==> Installing pnpm"
sudo npm install -g pnpm@10

echo "==> Installing PM2"
sudo npm install -g pm2

echo "==> Installing Nginx"
sudo apt-get install -y nginx

echo "==> Cloning / pulling repository"
if [ -d "$REPO_DIR" ]; then
  cd "$REPO_DIR" && git pull
else
  sudo mkdir -p /var/www
  sudo git clone https://github.com/AI-APP-FREELANCER/influxwiseapps.git "$REPO_DIR"
  sudo chown -R ubuntu:ubuntu "$REPO_DIR"
fi

echo "==> Installing dependencies"
cd "$REPO_DIR"
pnpm install --frozen-lockfile

echo "==> Running Prisma migrations"
cd "$REPO_DIR/packages/db"
pnpm db:generate
pnpm db:migrate

echo "==> Building all apps"
cd "$REPO_DIR"
pnpm build

echo "==> Copying Nginx configs"
for domain in "${DOMAINS[@]}"; do
  sudo cp "$REPO_DIR/infrastructure/nginx/${domain}.conf" "$NGINX_CONF_DIR/${domain}"
  sudo ln -sf "$NGINX_CONF_DIR/${domain}" "$NGINX_ENABLED_DIR/${domain}"
done
sudo rm -f "$NGINX_ENABLED_DIR/default"
sudo nginx -t && sudo systemctl reload nginx

echo "==> Starting apps with PM2"
cd "$REPO_DIR"
pm2 start infrastructure/scripts/pm2.config.js
pm2 save
pm2 startup | tail -1 | sudo bash

echo ""
echo "======================================================"
echo " Deployment complete!"
echo " Apps running on ports 3001-3006"
echo " Nginx routing:"
for i in "${!DOMAINS[@]}"; do
  echo "   https://${DOMAINS[$i]} → :$((3001 + i))"
done
echo ""
echo " NEXT STEPS:"
echo " 1. Set up .env files in each apps/ directory"
echo " 2. Add Cloudflare A records pointing to $(curl -s ifconfig.me)"
echo " 3. Verify Cloudflare SSL mode = Full (strict)"
echo " 4. Register Stripe webhooks for each app"
echo "======================================================"
