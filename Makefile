# Makefile for ATI WebPortal API

.PHONY: help build up down restart logs logs-app logs-db clean rebuild ps exec-app exec-db

# Default target
help:
	@echo "Available commands:"
	@echo "  make build        - Build Docker images"
	@echo "  make up           - Start containers"
	@echo "  make down         - Stop and remove containers"
	@echo "  make restart      - Restart all containers"
	@echo "  make logs         - View logs from all containers"
	@echo "  make logs-app     - View logs from app container"
	@echo "  make logs-db      - View logs from database container"
	@echo "  make ps           - List running containers"
	@echo "  make clean        - Remove containers, volumes, and images"
	@echo "  make rebuild      - Clean rebuild (down + build + up)"
	@echo "  make exec-app     - Open shell in app container"
	@echo "  make exec-db      - Open SQL Server shell"

# Build Docker images
build:
	docker-compose build

# Start containers in detached mode
up:
	docker-compose up -d

# Start containers and follow logs
run:
	docker-compose up

# Stop and remove containers
down:
	docker-compose down

# Restart containers
restart: down up

# View logs from all containers
logs:
	docker-compose logs -f

# View logs from app container only
logs-app:
	docker-compose logs -f app

# View logs from database container only
logs-db:
	docker-compose logs -f db

# List running containers
ps:
	docker-compose ps

# Remove everything (containers, volumes, images)
clean:
	docker-compose down -v --rmi all

# Clean rebuild
rebuild: down build up

# Open shell in app container
exec-app:
	docker-compose exec app sh

# Open SQL Server command line
exec-db:
	docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd
