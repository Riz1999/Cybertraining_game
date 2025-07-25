#!/bin/bash

echo "Starting build process for Render deployment..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install

# Build the React app
echo "Building React application..."
npm run build

# Go back to root
cd ..

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install

echo "Build process completed successfully!"