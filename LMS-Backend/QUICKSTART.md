# Quick Start Guide - LMS Backend

## Installation

### System Requirements
- Java 17+ (check: `java -version`)
- Maven 3.8+ (check: `mvn -version`)
- PostgreSQL 12+ (running)
- Redis 6+ (running)

### 1. Install Dependencies

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql

# Install Redis (macOS with Homebrew)
brew install redis

# Start PostgreSQL and Redis
brew services start postgresql
brew services start redis
```

### 2. Create Database

```bash
psql -U postgres
CREATE DATABASE lms_db;
\q
```

### 3. Clone and Setup

```bash
cd LMS-Backend
```

### 4. Update Configuration (if needed)

Edit `src/main/resources/application.yml` to match your environment:

```yaml
datasource:
  url: jdbc:postgresql://localhost:5432/lms_db
  username: postgres
  password: YOUR_PASSWORD
```

### 5. Build

```bash
mvn clean install
```

### 6. Run

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

Server runs at: `http://localhost:8080/api`

## Common Commands

```bash
# Build only (skip tests)
mvn clean install -DskipTests

# Run tests
mvn test

# Run with production profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"

# Generate project documentation
mvn clean javadoc:javadoc

# Check for dependency vulnerabilities
mvn owasp:check
```

## Testing the API

### Get Auth Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@institution.edu",
    "password": "password123"
  }'
```

### List Institutions

```bash
# Replace TOKEN with the accessToken from login response
curl -X GET "http://localhost:8080/api/super-admin/institutions?page=0&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

### Create Institution

```bash
curl -X POST http://localhost:8080/api/super-admin/institutions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test University",
    "type": "university",
    "country": "USA",
    "timezone": "America/New_York",
    "academicSession": "2025-2026",
    "planId": "pro",
    "featuresEnabled": ["AI_ASSISTANCE", "ANALYTICS"],
    "adminName": "John Doe",
    "adminEmail": "john@testuniversity.edu",
    "autoStructureEnabled": true
  }'
```

## Project Structure

- **pom.xml** - Maven configuration with all dependencies
- **src/main/java** - Java source code
  - **com/towsoth/edu**
    - **config** - Spring configuration (Security, Web, Database)
    - **security** - JWT and authentication logic
    - **common** - Shared DTOs, entities, services, exceptions
    - **modules** - Feature modules (auth, institution, user, etc.)
- **src/main/resources** - Configuration and migration files
  - **application.yml** - Base configuration
  - **db/migration** - Flyway database migrations
- **src/test** - Test code

## IDE Setup

### IntelliJ IDEA
1. Open project
2. Maven projects are auto-configured
3. Mark `src/main/java` as Sources Root
4. Mark `src/test/java` as Test Sources Root

### VS Code
1. Install "Extension Pack for Java"
2. Install "Spring Boot Extension Pack"
3. Open project folder
4. Wait for Maven projects to load

## Next Steps

1. Create additional modules (users, billing, analytics, etc.)
2. Implement user management APIs
3. Add audit log query endpoints
4. Create analytics aggregation endpoints
5. Implement feature flag system
6. Add Redis-based rate limiting
7. Create comprehensive integration tests
8. Set up API documentation auto-generation

## Common Issues

**Maven command not found**
- Ensure Maven is installed and in your PATH
- Verify: `mvn -version`

**Cannot connect to PostgreSQL**
- Ensure PostgreSQL is running: `psql -U postgres`
- Check credentials in `application.yml`
- Create database: `CREATE DATABASE lms_db;`

**Cannot connect to Redis**
- Ensure Redis is running: `redis-cli ping` (should return PONG)
- Check Redis configuration in `application.yml`

**Port already in use**
- Change port in `application.yml`: `server.port: 8081`

## Documentation

- API endpoints: See README.md
- Database schema: See `src/main/resources/db/migration/`
- JWT usage: See JwtTokenProvider.java
- Multi-tenancy: See TenantContext.java
- RBAC: See Role, Permission entities and SecurityConfig.java

## Support

- Check logs: `target/` directory for detailed error messages
- Enable debug logging in `application.yml`:
  ```yaml
  logging:
    level:
      com.towsoth.edu: DEBUG
  ```
