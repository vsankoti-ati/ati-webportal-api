@echo off
REM Batch script for ATI WebPortal API Docker management

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="build" goto build
if "%1"=="up" goto up
if "%1"=="run" goto run
if "%1"=="down" goto down
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="logs-app" goto logs-app
if "%1"=="logs-db" goto logs-db
if "%1"=="ps" goto ps
if "%1"=="clean" goto clean
if "%1"=="rebuild" goto rebuild
if "%1"=="exec-app" goto exec-app
if "%1"=="exec-db" goto exec-db
goto help

:help
echo Available commands:
echo   make.bat build        - Build Docker images
echo   make.bat up           - Start containers in background
echo   make.bat run          - Start containers and follow logs
echo   make.bat down         - Stop and remove containers
echo   make.bat restart      - Restart all containers
echo   make.bat logs         - View logs from all containers
echo   make.bat logs-app     - View logs from app container
echo   make.bat logs-db      - View logs from database container
echo   make.bat ps           - List running containers
echo   make.bat clean        - Remove containers, volumes, and images
echo   make.bat rebuild      - Clean rebuild (down + build + up)
echo   make.bat exec-app     - Open shell in app container
echo   make.bat exec-db      - Open SQL Server shell
goto end

:build
echo Building Docker images...
docker-compose build
goto end

:up
echo Starting containers...
docker-compose up -d
goto end

:run
echo Starting containers with logs...
docker-compose up
goto end

:down
echo Stopping containers...
docker-compose down
goto end

:restart
echo Restarting containers...
docker-compose down
docker-compose up -d
goto end

:logs
echo Viewing all logs...
docker-compose logs -f
goto end

:logs-app
echo Viewing app logs...
docker-compose logs -f app
goto end

:logs-db
echo Viewing database logs...
docker-compose logs -f db
goto end

:ps
echo Listing containers...
docker-compose ps
goto end

:clean
echo Cleaning up everything...
docker-compose down -v --rmi all
goto end

:rebuild
echo Rebuilding from scratch...
docker-compose down
docker-compose build
docker-compose up -d
goto end

:exec-app
echo Opening shell in app container...
docker-compose exec app sh
goto end

:exec-db
echo Opening SQL Server shell...
docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd
goto end

:end
