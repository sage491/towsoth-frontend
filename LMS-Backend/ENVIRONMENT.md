# Environment Setup

## Development (dev)

Uses H2 in-memory database or local PostgreSQL. Enables detailed logging and schema auto-updates.

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

## Production (prod)

Uses PostgreSQL with Flyway migrations. Minimal logging. Schema validation only (no auto-updates).

```bash
java -jar target/*.jar --spring.profiles.active=prod
```

## Testing (test)

Uses H2 in-memory database with Testcontainers for PostgreSQL when needed.

```bash
mvn test
```
