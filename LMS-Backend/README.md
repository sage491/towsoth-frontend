# Towsoth LMS Backend

Enterprise-grade, multi-tenant Learning Management System backend built with Spring Boot 3, Java 17, PostgreSQL, and Redis.

## Features

- **Multi-Tenant Architecture**: Strict tenant isolation at database and application layers
- **JWT Authentication**: Stateless JWT-based authentication with refresh token support
- **Role-Based Access Control (RBAC)**: Role and permission management with flexible authorization
- **Audit Logging**: Comprehensive audit trails for all administrative actions
- **Institution Management**: Full CRUD operations for managing educational institutions
- **REST API**: Contract-compatible with existing React frontend
- **Dual Route Support**: API accessible via both `/api/super-admin/*` and `/api/v1/*` prefixes
- **Database Migration**: Flyway-based schema versioning and seeding
- **Redis Caching**: Built-in caching infrastructure for performance optimization

## Tech Stack

- **Language**: Java 17+
- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL 12+
- **Cache**: Redis
- **ORM**: Spring Data JPA / Hibernate
- **Authentication**: JWT (JJWT)
- **Build Tool**: Maven
- **API Documentation**: SpringDoc OpenAPI / Swagger

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12 or higher
- Redis 6 or higher (for caching)

## Setup and Installation

### 1. Clone and Navigate

```bash
cd LMS-Backend
```

### 2. Configure Database

Update `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/lms_db
    username: postgres
    password: postgres  # Change to your PostgreSQL password
```

### 3. Start PostgreSQL and Redis

```bash
# PostgreSQL
psql -U postgres -c "CREATE DATABASE lms_db;"

# Redis (if using Docker)
docker run -d -p 6379:6379 redis:latest
```

### 4. Build the Project

```bash
mvn clean install
```

### 5. Run the Application

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

The application will start on `http://localhost:8080/api`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login (public)
- `POST /api/auth/refresh` - Refresh JWT token (public)

### Institutions (Super Admin Only)

- `GET /api/super-admin/institutions` - List all institutions
- `GET /api/super-admin/institutions/{id}` - Get institution details
- `POST /api/super-admin/institutions` - Create institution
- `PATCH /api/super-admin/institutions/{id}` - Update institution
- `POST /api/super-admin/institutions/{id}/suspend` - Suspend institution
- `POST /api/super-admin/institutions/{id}/resume` - Resume institution
- `POST /api/super-admin/institutions/{id}/archive` - Archive institution
- `DELETE /api/super-admin/institutions/{id}` - Delete institution

**Alias Routes** (same endpoints also available under `/api/v1/institutions`)

## Authentication

### Login Request

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@institution.edu",
    "password": "password123"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "tokenType": "Bearer",
    "userId": 1,
    "institutionId": 1,
    "email": "admin@institution.edu",
    "role": "SUPER_ADMIN"
  },
  "message": "Login successful",
  "timestamp": "2025-12-29T12:34:56Z"
}
```

### Using the Token

```bash
curl -X GET http://localhost:8080/api/super-admin/institutions \
  -H "Authorization: Bearer eyJhbGc..."
```

## API Response Format

All API responses follow a consistent envelope structure:

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2025-12-29T12:34:56Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": { /* error details */ },
  "timestamp": "2025-12-29T12:34:56Z"
}
```

## Multi-Tenancy

All user requests are automatically scoped to their institution via JWT claims. The tenant context is set in the `JwtAuthenticationFilter` and cleared after each request.

**Key Tenant Safeguards**:
- All user-scoped queries enforce `institution_id` filtering
- Repositories provide only scoped query methods
- Services validate tenant context on sensitive operations
- Audit logs capture institution ID for all actions

## Database Migrations

Migrations are automatically applied on application startup using Flyway:

- `V1__Initial_schema.sql` - Core tables and indexes
- `V2__Seed_roles_and_permissions.sql` - RBAC baseline data

To add new migrations, create files following the naming pattern `V{N}__Description.sql` in `src/main/resources/db/migration/`.

## Audit Logging

Every super admin action is automatically logged with:
- Actor (user email)
- Action (e.g., INSTITUTION_CREATED)
- Resource type and ID
- Timestamp
- IP address
- Status (SUCCESS/WARNING/ERROR)
- Metadata (JSON)

## Structure

```
src/main/java/com/towsoth/edu/
├── LmsApplication.java
├── config/
│   ├── SecurityConfig.java
│   └── WebConfig.java
├── security/
│   ├── RequireRole.java
│   └── jwt/
│       ├── JwtAuthenticationFilter.java
│       └── JwtTokenProvider.java
├── common/
│   ├── dto/
│   ├── entity/
│   ├── exception/
│   ├── response/
│   ├── service/
│   └── utils/
├── modules/
│   ├── auth/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   └── service/
│   ├── institution/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── mapper/
│   │   ├── repository/
│   │   └── service/
│   ├── user/
│   │   ├── entity/
│   │   └── repository/
│   └── (additional modules)
```

## Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=InstitutionControllerTest

# Run with coverage
mvn test jacoco:report
```

## Development

### Create a New Module

1. Create directory under `src/main/java/com/towsoth/edu/modules/{moduleName}/`
2. Add subdirectories: `entity/`, `repository/`, `service/`, `controller/`, `dto/`, `mapper/`
3. Implement entities, repositories, and services
4. Create controllers with proper route prefixes
5. Add integration tests

### Add a New Endpoint

1. Create/update controller in `modules/{module}/controller/`
2. Create/update service in `modules/{module}/service/`
3. Add audit logging if it's a mutating operation
4. Write integration test covering success and error cases
5. Document in README or API docs

## Troubleshooting

### PostgreSQL Connection Refused

Ensure PostgreSQL is running and credentials in `application.yml` are correct.

### Redis Connection Error

Ensure Redis is running on the default port (6379) or update `application.yml`.

### JWT Token Expired

Use the refresh endpoint to obtain a new access token with your existing refresh token.

### CORS Error

Check `SecurityConfig.java` and ensure the frontend origin is in the allowed origins list.

## Production Checklist

- [ ] Change `security.jwt.secret` to a strong, unique value (min 256 bits)
- [ ] Set up PostgreSQL with proper backup strategy
- [ ] Enable Redis persistence
- [ ] Configure environment-specific `application-prod.yml`
- [ ] Set up database connection pooling (HikariCP)
- [ ] Enable HTTPS/TLS
- [ ] Set up monitoring and alerting
- [ ] Regular security audits and dependency updates
- [ ] Implement rate limiting at API gateway level
- [ ] Set up audit log archival and retention policies

## License

Proprietary - Towsoth Edu

## Support

For issues or questions, contact the backend team.
