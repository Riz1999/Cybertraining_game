#!/bin/bash

# Oracle Cloud deployment script
echo "Setting up Cybercrime Training Platform on Oracle Cloud..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Redis
sudo apt install redis-server -y
sudo systemctl enable redis-server

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Clone and setup application
git clone <your-repo-url> /opt/cybercrime-training-platform
cd /opt/cybercrime-training-platform

# Install dependencies
npm run install:all

# Build client
npm run build

# Setup environment
cp server/.env.example server/.env
echo "Please edit /opt/cybercrime-training-platform/server/.env with your settings"

# Setup PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
sudo tee /etc/nginx/sites-available/cybercrime-training > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/cybercrime-training /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Open firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow ssh

echo "Deployment complete! Access your app at http://your-server-ip"