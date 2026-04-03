# Towsoth Edu Platform

Enterprise-grade learning platform with modular dashboards and Spring Boot backends.

This repository contains multiple applications that together power a multi-role education system for institutions, administrators, and students.

## Repository Layout

The main codebase is inside `Towsoth_Enterprise_grade-mostimp/`.

- `Towsoth_Enterprise_grade-mostimp/Admin_dashboard_frontend/`
	- React + Vite frontend for institutional/admin workflows.
- `Towsoth_Enterprise_grade-mostimp/student_dashboard_frontend/`
	- React + Vite frontend for student experience and task views.
- `Towsoth_Enterprise_grade-mostimp/Super Admin Dashboard Design/`
	- Super-admin dashboard workspace (frontend + backend assets).
- `Towsoth_Enterprise_grade-mostimp/LMS-Backend/`
	- Primary enterprise Spring Boot backend (multi-tenant LMS APIs).
- `Towsoth_Enterprise_grade-mostimp/backend-spring/`
	- Additional Spring Boot backend module and packaged build output.
- `Towsoth_Enterprise_grade-mostimp/student_dashboard_backend/`
	- Student backend service documentation and related backend artifacts.
- `Towsoth_Enterprise_grade-mostimp/render.yaml`
	- Deployment configuration for Render.

## Platform Goal

Towsoth Edu is designed to move learning from static content delivery to intelligence-driven improvement.

Core idea:
- Track concept-level student mistakes.
- Identify repeated weak areas.
- Recommend targeted, verified learning content.
- Reassess and repeat the loop to improve outcomes over time.

## High-Level Architecture

Frontend layer:
- Admin web app (React/Vite)
- Student web app (React/Vite)
- Super-admin UI workspace

Backend layer:
- Spring Boot services (Java 17)
- JWT-based auth and role-based access
- Institution-aware/multi-tenant patterns
- PostgreSQL persistence and Redis caching (in LMS backend)

Infrastructure layer:
- Render/Vercel-oriented deployment files
- Maven and npm based builds

## Prerequisites

Install these before local setup:

- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- PostgreSQL 12+
- Redis 6+ (required by LMS backend features)

## Local Development Quick Start

From repository root:

1. Start backend services.
2. Start admin and student frontends.
3. Verify API URLs and environment settings in each module.

### 1) Run LMS Backend

```powershell
cd Towsoth_Enterprise_grade-mostimp/LMS-Backend
mvn clean install
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

Expected base API path: `http://localhost:8080/api`

### 2) Run Admin Dashboard Frontend

```powershell
cd Towsoth_Enterprise_grade-mostimp/Admin_dashboard_frontend
npm install
npm run dev
```

### 3) Run Student Dashboard Frontend

```powershell
cd Towsoth_Enterprise_grade-mostimp/student_dashboard_frontend
npm install
npm run dev
```

## Build Commands

Admin frontend:

```powershell
cd Towsoth_Enterprise_grade-mostimp/Admin_dashboard_frontend
npm run build
```

Student frontend:

```powershell
cd Towsoth_Enterprise_grade-mostimp/student_dashboard_frontend
npm run build
```

LMS backend:

```powershell
cd Towsoth_Enterprise_grade-mostimp/LMS-Backend
mvn clean package
```

## Configuration Notes

- Backend database and cache settings are managed in backend resource files (for example, `application.yml` in LMS backend).
- Frontend API targets are controlled by each frontend's environment/config setup.
- Keep secrets out of source control; use environment variables or deployment platform secrets.

## Deployment

- Frontend projects include Vercel config files (`vercel.json`).
- Repository includes `render.yaml` for Render-based deployments.
- Ensure environment-specific URLs and credentials are set before deployment.

## Documentation Pointers

Important module-level docs are available in:

- `Main_Idea.MD`
- `Towsoth_Enterprise_grade-mostimp/LMS-Backend/README.md`
- `Towsoth_Enterprise_grade-mostimp/Admin_dashboard_frontend/README.md`
- `Towsoth_Enterprise_grade-mostimp/student_dashboard_frontend/README.md`

## Suggested Next Improvements

- Add a root `.env.example` (or module-specific env examples) for consistent setup.
- Add a one-command local startup script for backend + frontends.
- Add a root-level architecture diagram and request flow documentation.

