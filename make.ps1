# PowerShell script for ATI WebPortal API Docker management

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "Available commands:" -ForegroundColor Cyan
    Write-Host "  .\make.ps1 build        - Build Docker images"
    Write-Host "  .\make.ps1 up           - Start containers in background"
    Write-Host "  .\make.ps1 run          - Start containers and follow logs"
    Write-Host "  .\make.ps1 down         - Stop and remove containers"
    Write-Host "  .\make.ps1 restart      - Restart all containers"
    Write-Host "  .\make.ps1 logs         - View logs from all containers"
    Write-Host "  .\make.ps1 logs-app     - View logs from app container"
    Write-Host "  .\make.ps1 logs-db      - View logs from database container"
    Write-Host "  .\make.ps1 ps           - List running containers"
    Write-Host "  .\make.ps1 clean        - Remove containers, volumes, and images"
    Write-Host "  .\make.ps1 rebuild      - Clean rebuild (down + build + up)"
    Write-Host "  .\make.ps1 exec-app     - Open shell in app container"
    Write-Host "  .\make.ps1 exec-db      - Open SQL Server shell"
}

switch ($Command) {
    "build" {
        Write-Host "Building Docker images..." -ForegroundColor Green
        docker-compose build
    }
    "up" {
        Write-Host "Starting containers..." -ForegroundColor Green
        docker-compose up -d
    }
    "run" {
        Write-Host "Starting containers with logs..." -ForegroundColor Green
        docker-compose up
    }
    "down" {
        Write-Host "Stopping containers..." -ForegroundColor Yellow
        docker-compose down
    }
    "restart" {
        Write-Host "Restarting containers..." -ForegroundColor Yellow
        docker-compose down
        docker-compose up -d
    }
    "logs" {
        Write-Host "Viewing all logs..." -ForegroundColor Cyan
        docker-compose logs -f
    }
    "logs-app" {
        Write-Host "Viewing app logs..." -ForegroundColor Cyan
        docker-compose logs -f app
    }
    "logs-db" {
        Write-Host "Viewing database logs..." -ForegroundColor Cyan
        docker-compose logs -f db
    }
    "ps" {
        Write-Host "Listing containers..." -ForegroundColor Cyan
        docker-compose ps
    }
    "clean" {
        Write-Host "Cleaning up everything..." -ForegroundColor Red
        docker-compose down -v --rmi all
    }
    "rebuild" {
        Write-Host "Rebuilding from scratch..." -ForegroundColor Yellow
        docker-compose down
        docker-compose build
        docker-compose up -d
    }
    "exec-app" {
        Write-Host "Opening shell in app container..." -ForegroundColor Green
        docker-compose exec app sh
    }
    "exec-db" {
        Write-Host "Opening SQL Server shell..." -ForegroundColor Green
        docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd
    }
    default {
        Show-Help
    }
}
