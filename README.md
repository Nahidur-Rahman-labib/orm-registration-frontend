**Project Overview**
This frontend is built using Angular (standalone + modular approach) and integrates with a Spring Boot backend through REST APIs. It focuses on clean UI design, reactive forms, and structured data handling for enterprise-level CRUD operations.

**Tech Stack**
Angular (Standalone Components + Modules)
TypeScript
Reactive Forms
Angular Router
HTTP Client (REST API integration)
SCSS / CSS3
HTML5

**Features**
Client registration form with nested structure
Client personal details management
Address module with cascading dropdowns (Country → Division → District → Thana)
Account creation and management
Dynamic form validation (Reactive Forms)
API integration with Spring Boot backend
Modular and reusable component architecture
Lookup-based dropdown population
Error handling and loading states
Clean UI layout with responsive design support

**Project Structure**
src/
│
├── core/                  # Core services & interceptors
├── shared/               # Reusable components, pipes, directives
├── services/             # Global services (API helpers, toast, etc.)
├── layout/               # Header, sidebar, layout components
├── modules/
│   └── client-registration/
│       ├── client-form/
│       ├── service/
│       └── models/
├── pages/                # Route-based pages
└── app/                  # Root app config

**Data Flow**
Angular Form (Reactive Forms)
        ↓
Service Layer (HTTP Client)
        ↓
Spring Boot REST API
        ↓
Database
