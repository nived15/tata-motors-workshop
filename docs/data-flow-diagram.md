---
title: Data Flow Diagram for Tata Motors Workshop App
---

%% Mermaid Data Flow Diagram
flowchart TD
    User[User]
    Frontend[Frontend (React/Vite)]
    Backend[Backend (Node.js/Express)]
    DB[(Database: Prisma/PostgreSQL)]

    User -->|HTTP Requests| Frontend
    Frontend -->|API Calls (fetch/axios)| Backend
    Backend -->|ORM Queries| DB
    Backend -->|API Response| Frontend
    Frontend -->|UI Update| User

    subgraph Frontend
        App[App.tsx]
        Services[services/api.ts]
        Store[store/authStore.ts]
        Components[components/*]
        App --> Services
        Services --> Backend
        App --> Store
        App --> Components
    end

    subgraph Backend
        Server[src/server.ts]
        Middleware[src/middleware/*]
        Utils[src/utils/logger.ts]
        Database[src/database/seed.ts]
        Server --> Middleware
        Server --> Database
        Server --> Utils
        Server --> DB
    end

    DB -->|Data| Backend
    Backend -->|Processed Data| Frontend
    Frontend -->|Display| User
