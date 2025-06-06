### First add a test db to docker-compose.yml file

```javascript
# docker-compose.yml
version: '3.8'
services:
  postgres-test:
    image: postgres:15
    container_name: myapp-postgres-test
    environment:
      POSTGRES_USER: testuser
      POSTGRES_PASSWORD: testpassword
      POSTGRES_DB: testdb
    ports:
      - '5433:5432' # Use a different port to avoid conflicts with your dev DB
    volumes:
      - postgres_test_data:/var/lib/postgresql/data

volumes:
  postgres_test_data:

```

### Create a .env.test file at the root of the project and add necasary env variables like:

# .env.test

```env

DATABASE_URL="postgresql://testuser:testpassword@localhost:5433/testdb?schema=public"
JWT_SECRET="a-very-secret-and-safe-key-for-testing"
JWT_EXPIRATION_TIME="15m"

```


### install cross-env package via npm -> npm install --save-dev cross-env

### Prisma: Apply Migrations to the Test Database

* Unix based systems

```powershell

# This command points prisma to your test database URL and applies migrations
npx cross-env DATABASE_URL=$(grep DATABASE_URL .env.test | cut -d '=' -f2) npx prisma migrate deploy

```

* Windows systems

```powershell

# Replace the string inside the quotes with your actual URL from .env.test
npx cross-env DATABASE_URL="postgresql://testuser:testpassword@localhost:5433/testdb?schema=public" npx prisma migrate deploy

```

* Or instead of directly giving db url env variable to terminal, you can use dotenv-cli

```powershell

npm install --save-dev dotenv-cli

```

```powershell

npx dotenv -e .env.test -- npx prisma migrate deploy

```

* or add in to package.json

```json

// package.json
"scripts": {
  "test": "jest",
  "db:migrate:test": "npx dotenv -e .env.test -- npx prisma migrate deploy"
},

```

That should be it!