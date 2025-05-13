#!/bin/bash

# Update package lists and install Docker & Docker Compose
sudo apt update && sudo apt install -y docker.io docker-compose

# Add current user to the docker group
sudo usermod -aG docker $USER

# Notify user to log out and log back in for group changes to apply
echo "You may need to log out and log back in (or reboot) for Docker group changes to take effect."

# Start Docker Compose services
docker-compose up -d
