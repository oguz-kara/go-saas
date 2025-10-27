# Quick Deployment Guide - DoluCRM

## Deploy with IP-based Access

Since DNS isn't configured yet, this setup uses IP addresses directly.

### 1. Environment Setup

Create `.env` files:

**`api/.env`:**
```env
DATABASE_URL=postgresql://dolucrm:changeme@db:5432/dolucrm
JWT_SECRET=your-super-secret-jwt-key-change-me
JWT_EXPIRATION_TIME=7d
CACHE_TTL_SECONDS=3600
CACHE_MAX_ITEMS=500
CORS_ORIGIN=*
FRONTEND_URL=http://YOUR_VPS_IP:3000
PORT=3000
```

**`web-admin/.env`:**
```env
NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL=http://YOUR_VPS_IP:5000/admin-api
NEXTAUTH_SECRET=your-nextauth-secret-change-me
NEXTAUTH_URL=http://YOUR_VPS_IP:3000
```

Replace `YOUR_VPS_IP` with your actual VPS IP address.

### 2. Deploy

```bash
# Create network
docker network create dolucrm-network

# Start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# View specific service
docker-compose logs -f api
docker-compose logs -f web-admin
docker-compose logs -f db
```

### 3. Access

- **Admin Dashboard**: `http://YOUR_VPS_IP:3000`
- **API**: `http://YOUR_VPS_IP:5000`
- **GraphQL**: `http://YOUR_VPS_IP:5000/admin-api`
- **Health Check**: `http://YOUR_VPS_IP:5000/health`

### 4. Database Migrations

Migrations run automatically on startup. To check status:

```bash
docker-compose exec api npx prisma migrate status
```

### 5. Common Commands

```bash
# Restart a service
docker-compose restart api

# Rebuild a service
docker-compose up -d --build api

# Stop all
docker-compose down

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec api sh
```

## Notes

- The API runs on port 5000
- Web Admin runs on port 3000  
- PostgreSQL runs on port 5432 (internal only)
- CORS is set to `*` for now - **secure this in production**
- All services restart automatically unless stopped

## Security Warnings

⚠️ **This setup is for development/testing only:**

1. Change default database password in `api/.env`
2. Use strong JWT_SECRET
3. Restrict CORS_ORIGIN to specific domains in production
4. Add firewall rules to restrict port access
5. Use SSL/TLS for production

## Troubleshooting

**Can't connect to API:**
```bash
# Check if running
docker-compose ps api

# Check logs
docker-compose logs api

# Check health
curl http://YOUR_VPS_IP:5000/health
```

**Database not starting:**
```bash
# Check logs
docker-compose logs db

# Check if database is healthy
docker-compose exec db pg_isready -U dolucrm
```

**Build fails:**
```bash
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

