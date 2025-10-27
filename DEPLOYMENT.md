# Deployment Guide

This guide will help you deploy the DoluCRM application using Docker and Docker Compose with Traefik.

## Prerequisites

- Docker and Docker Compose installed
- Traefik reverse proxy running with Let's Encrypt configured
- Domain names configured (DNS A records pointing to your server)

## Quick Start

### 1. Configure Environment Variables

Create environment files for each service:

#### Root `.env` (for docker-compose.yml)
```bash
cp .env.example .env
# Edit .env and set your database credentials
```

#### API `.env`
```bash
cd api
cp .env.example .env
# Edit api/.env with your configuration
```

Required variables for API:
```env
# Database
DATABASE_URL=postgresql://dolucrm:changeme@db:5432/dolucrm

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-me
JWT_EXPIRATION_TIME=7d

# Cache
CACHE_TTL_SECONDS=3600
CACHE_MAX_ITEMS=500

# CORS
CORS_ORIGIN=https://admin.yourdomain.com

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL (for WebSocket CORS)
FRONTEND_URL=https://admin.yourdomain.com
```

#### Web Admin `.env`
```bash
cd web-admin
cp .env.example .env
# Edit web-admin/.env with your configuration
```

Required variables for Web Admin:
```env
NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL=https://api.yourdomain.com/admin-api
NEXTAUTH_SECRET=your-nextauth-secret-change-me
NEXTAUTH_URL=https://admin.yourdomain.com
```

### 2. Update Domain Names

Edit `docker-compose.yml` and replace the following:
- `admin.yourdomain.com` → your actual admin domain
- `api.yourdomain.com` → your actual API domain

### 3. Ensure Traefik Network Exists

If using an external Traefik network:
```bash
# Create the network if it doesn't exist
docker network create dolucrm-network

# Or update docker-compose.yml to use your existing Traefik network:
# networks:
#   dolucrm-network:
#     name: your-traefik-network
#     external: true
```

### 4. Build and Deploy

```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Check specific service logs
docker-compose logs -f api
docker-compose logs -f web-admin
docker-compose logs -f db
```

### 5. Run Database Migrations

Migrations run automatically on API startup via the command:
```bash
npx prisma migrate deploy && node dist/main
```

If you need to run migrations manually:
```bash
docker-compose exec api npx prisma migrate deploy
```

### 6. Verify Deployment

- Health check: `https://api.yourdomain.com/health`
- Readiness check: `https://api.yourdomain.com/health/ready`
- GraphQL Playground: `https://api.yourdomain.com/admin-api` (if debug enabled)
- Admin Dashboard: `https://admin.yourdomain.com`

## Production Recommendations

### 1. Database Backups

Add a backup service or schedule periodic backups:
```bash
# Example backup script
docker-compose exec -T db pg_dump -U dolucrm dolucrm > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Secure Database Access

Remove the exposed port in production:
```yaml
# In docker-compose.yml, comment out or remove:
# ports:
#   - "5432:5432"
```

### 3. Resource Limits

Add resource limits to services:
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 4. Enable Health Checks

Health checks are already configured. Monitor them via:
```bash
docker-compose ps
```

### 5. Log Management

Configure log rotation:
```yaml
services:
  api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart a service
docker-compose restart api

# Rebuild and restart
docker-compose up -d --build api

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ WARNING: This will delete all data)
docker-compose down -v

# Execute command in container
docker-compose exec api sh

# Run Prisma commands
docker-compose exec api npx prisma studio
docker-compose exec api npx prisma migrate status

# Scale services (if stateless)
docker-compose up -d --scale api=2
```

## Troubleshooting

### API won't start
1. Check database connection: `docker-compose logs db`
2. Verify environment variables: `docker-compose exec api env`
3. Check migrations: `docker-compose exec api npx prisma migrate status`

### Database connection errors
1. Ensure DATABASE_URL points to `db:5432` (internal Docker network)
2. Check database is healthy: `docker-compose ps db`
3. Verify credentials match between `.env` and `api/.env`

### Traefik routing issues
1. Verify network: `docker network ls | grep dolucrm`
2. Check labels: `docker inspect dolucrm-api | grep traefik`
3. Ensure DNS points to your server
4. Check Traefik logs: `docker logs traefik`

### Web Admin can't connect to API
1. Verify `NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL` uses public domain
2. Check CORS settings in API
3. Ensure SSL certificates are valid

## Development vs Production

For development, you can use a simpler setup without Traefik:

```yaml
# Development docker-compose.override.yml
services:
  api:
    ports:
      - "5000:3000"
    labels: []
  
  web-admin:
    ports:
      - "3000:3000"
    labels: []
```

Then update `.env` files to use `http://localhost:5000` for API URLs.

## Monitoring

Consider adding monitoring tools:
- Prometheus for metrics
- Grafana for dashboards
- Sentry for error tracking
- Uptime monitoring for health checks

## Support

For issues, check:
- Application logs: `docker-compose logs`
- Health endpoints: `/health` and `/health/ready`
- Database connectivity
- Traefik configuration

