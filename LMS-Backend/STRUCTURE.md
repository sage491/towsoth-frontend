# Project Structure Reference

## Root Files
- `pom.xml` - Maven configuration with Spring Boot 3, PostgreSQL, JWT, Redis dependencies
- `README.md` - Complete project documentation with setup, API endpoints, examples
- `QUICKSTART.md` - Quick start guide for developers
- `ENVIRONMENT.md` - Environment-specific configuration guide
- `.gitignore` - Git ignore patterns

## Source Code Structure

### Build & Configuration
```
src/main/
├── java/com/towsoth/edu/
│   └── LmsApplication.java              Main Spring Boot application class
│   └── config/
│       ├── SecurityConfig.java          JWT auth, CORS, Spring Security setup
│       └── WebConfig.java               Web MVC configuration
│
│   └── security/
│       ├── RequireRole.java             Custom authorization annotation
│       └── jwt/
│           ├── JwtAuthenticationFilter.java   JWT extraction & tenant context
│           └── JwtTokenProvider.java         Token generation/validation
│
│   └── common/
│       ├── dto/                          Request/Response DTOs
│       │   ├── InstitutionResponseDTO.java
│       │   ├── InstitutionBrandingDTO.java
│       │   ├── CreateInstitutionRequestDTO.java
│       │   ├── UpdateInstitutionRequestDTO.java
│       │   ├── UserResponseDTO.java
│       │   ├── CreateUserRequestDTO.java
│       │   ├── AuditLogResponseDTO.java
│       │   ├── RoleResponseDTO.java
│       │   ├── PermissionDTO.java
│       │   └── PlanResponseDTO.java
│       │
│       ├── entity/
│       │   ├── BaseEntity.java           JPA base with audit fields
│       │   └── AuditLog.java             Audit log entity
│       │
│       ├── response/
│       │   └── ApiResponse.java          Global response envelope
│       │
│       ├── exception/
│       │   └── GlobalExceptionHandler.java    Global error handling
│       │
│       ├── service/
│       │   └── AuditService.java         Audit log recording service
│       │
│       └── utils/
│           └── TenantContext.java        ThreadLocal tenant/user context
│
│   └── modules/
│       ├── auth/
│       │   ├── controller/
│       │   │   └── AuthController.java                    Login endpoint
│       │   ├── service/
│       │   │   └── AuthService.java                       JWT issuance logic
│       │   ├── entity/
│       │   │   ├── Role.java                              Role entity
│       │   │   ├── Permission.java                        Permission entity
│       │   │   └── RolePermission.java                    Role-Permission mapping
│       │   ├── repository/
│       │   │   ├── RoleRepository.java                    Role JPA repository
│       │   │   ├── PermissionRepository.java              Permission JPA repository
│       │   │   └── RolePermissionRepository.java          RolePermission JPA repository
│       │   └── dto/
│       │       ├── LoginRequestDTO.java
│       │       └── LoginResponseDTO.java
│       │
│       ├── institution/
│       │   ├── controller/
│       │   │   ├── SuperAdminInstitutionController.java   /api/super-admin/institutions routes
│       │   │   └── InstitutionController.java             /api/v1/institutions alias routes
│       │   ├── service/
│       │   │   └── InstitutionService.java                Institution CRUD + state transitions
│       │   ├── entity/
│       │   │   ├── Institution.java                       Institution entity (multi-tenant scoped)
│       │   │   └── Feature.java                           Feature flags entity
│       │   ├── repository/
│       │   │   ├── InstitutionRepository.java             Institution scoped queries
│       │   │   └── FeatureRepository.java                 Feature lookups
│       │   └── mapper/
│       │       └── InstitutionMapper.java                 Entity <-> DTO conversion
│       │
│       ├── user/
│       │   ├── entity/
│       │   │   └── User.java                              User entity (institution-scoped)
│       │   └── repository/
│       │       └── UserRepository.java                    User scoped queries (institution_id required)
│       │
│       └── (future modules: billing, analytics, security, compliance)
│
└── resources/
    ├── application.yml                  Main configuration (PostgreSQL, Redis, JWT)
    ├── application-dev.yml              Development profile
    └── db/migration/
        ├── V1__Initial_schema.sql       Tables: institutions, users, roles, permissions, audit_logs
        └── V2__Seed_roles_and_permissions.sql   RBAC baseline data
```

### Test Code
```
src/test/
├── java/com/towsoth/edu/
│   └── modules/
│       ├── institution/
│       │   └── controller/
│       │       └── SuperAdminInstitutionControllerTest.java
│       │
│       └── (future test packages mirror main structure)
│
└── resources/
    └── application-test.yml             Test profile (H2 or TestContainers)
```

## Key Classes and Their Responsibilities

### Core Authentication & Security
- **JwtTokenProvider** - Generates/validates JWT tokens, extracts claims
- **JwtAuthenticationFilter** - Intercepts requests, validates tokens, sets tenant context
- **SecurityConfig** - Spring Security configuration, CORS, endpoint permissions
- **TenantContext** - ThreadLocal storage of tenant/user context for request scope

### Data Access Layer
- **InstitutionRepository** - Institution queries with full listing, search, status filtering
- **UserRepository** - User queries with institution_id enforcement (prevents cross-tenant leaks)
- **AuditLogRepository** - Institution-scoped audit queries with filtering

### Business Logic
- **InstitutionService** - CRUD + suspend/resume/archive state transitions + audit emission
- **AuthService** - User authentication and token issuance
- **AuditService** - Decoupled audit log recording from service logic

### API Contracts
- **SuperAdminInstitutionController** (@RequestMapping("/super-admin/institutions"))
- **InstitutionController** (@RequestMapping("/v1/institutions")) - Alias routes
- **AuthController** (@RequestMapping("/auth")) - Login/refresh endpoints

### Response Handling
- **ApiResponse<T>** - Consistent envelope: { success, data, message, error, timestamp }
- **GlobalExceptionHandler** - Catches and formats exceptions, validation errors

## API Routes (Contract from Frontend)

### Primary Routes (/api/super-admin/...)
- GET    /institutions              List all institutions with search/filter/pagination
- GET    /institutions/{id}         Get institution details
- POST   /institutions              Create new institution
- PATCH  /institutions/{id}         Update institution (partial)
- POST   /institutions/{id}/suspend     Suspend operations (idempotent)
- POST   /institutions/{id}/resume      Resume operations (idempotent)
- POST   /institutions/{id}/archive     Archive institution (soft delete, idempotent)
- DELETE /institutions/{id}         Delete institution (hard delete)

### Alias Routes (/api/v1/...)
- Same endpoints, same behavior (dual routing for frontend compatibility)

### Authentication Routes (/api/auth/...)
- POST   /auth/login                Login and get JWT tokens
- POST   /auth/refresh              Refresh access token using refresh token

## Multi-Tenancy Implementation

### Enforcement Points
1. **Repository Level** - UserRepository, AuditLogRepository enforce institution_id filters
2. **Service Layer** - Services use tenant-scoped repositories only
3. **JWT Context** - TenantContext set per request with institutionId from token
4. **Audit Logs** - All mutations captured with institution_id for traceability

### Zero-Trust Pattern
- No "global" user/audit queries exposed
- SuperAdmin has cross-institution read via RBAC, but writes always scoped
- ThreadLocal context cleared after each request to prevent leaks

## Database Schema (Flyway)

### Tables
- `institutions` - Multi-tenant root entity, JSONB fields for branding
- `institution_features` - Junction table (institution_id, feature_id)
- `users` - User accounts with institution_id PK component
- `roles` - RBAC roles (SUPER_ADMIN, INSTITUTION_ADMIN, FACULTY, STUDENT)
- `permissions` - Granular permissions (INSTITUTION_CREATE, USER_SUSPEND, etc.)
- `role_permissions` - Role-permission assignments
- `audit_logs` - Complete audit trail with institution_id, user_id, action, metadata
- `features` - Feature definitions and availability

### Indexes
- All institution_id columns indexed for fast scoping
- status, created_at, timestamp indexes for filtering
- Unique constraints on institution_id + email for users

## Build & Dependency Management

### Maven Configuration
- Parent: spring-boot-starter-parent 3.2.0
- Key Dependencies:
  - spring-boot-starter-web (REST)
  - spring-boot-starter-data-jpa (ORM)
  - spring-boot-starter-security (Auth)
  - org.postgresql:postgresql (DB Driver)
  - io.jsonwebtoken:jjwt-* (JWT)
  - org.flywaydb:flyway-* (Migrations)
  - spring-boot-starter-data-redis (Caching)

### Compilation
- Java source/target: 17
- Spring Boot plugin: auto builds JAR with embedded Tomcat

## Phase Implementation Status

✅ Phase A - Contract Baseline
- DTOs matching frontend contracts
- Response envelope standardization

✅ Phase B - Data Persistence
- JPA entities with tenant scoping
- Flyway migrations with seed data
- Tenant-aware repositories

✅ Phase C - Security & RBAC
- JWT token provider & validation
- Spring Security configuration
- Tenant context injection & cleanup
- Role-based endpoint authorization

✅ Phase D - Super Admin APIs
- Institution CRUD endpoints
- Dual route support (/api/super-admin + /api/v1)
- Audit logging on all mutations
- Request validation

⏳ Phase E - (Ready for implementation)
- Audit log query endpoints
- Analytics aggregation APIs
- Feature flag service
- Rate limiting with Redis

⏳ Phase F - Testing & Verification
- Example integration test provided
- Security test patterns
- Contract validation tests

## Next Developer Steps

1. Review `README.md` for full API usage
2. Set up local PostgreSQL and Redis
3. Run: `mvn clean install` then `mvn spring-boot:run`
4. Test login endpoint to get JWT token
5. Use token for protected endpoints
6. Implement additional modules (User, Billing, Analytics, Security)
7. Add comprehensive integration tests
8. Configure CI/CD pipeline
