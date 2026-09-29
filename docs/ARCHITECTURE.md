# Multi-Tenant Payment Platform Architecture & System Design

## 1. System Architecture Overview

```mermaid
graph TD
    Client[Next.js Frontend / API Client] -->|HTTPS + JWT| Gateway[NestJS API Gateway / Server]
    Gateway -->|Guard & Middleware| Auth[Authentication & RBAC]
    Auth -->|Tenant Context| Services[Core Services]
    
    subgraph Core Services
        Merchants[Merchant Management]
        Users[User & Tenant Management]
        Tx[Transaction Processing]
        Audit[Immutable Audit Logger]
        Notify[Notifications & Mailer]
        Reports[Reporting Service]
    end

    Services -->|Data Isolation| Prisma[Prisma ORM]
    Prisma -->|PostgreSQL Schema| DB[(PostgreSQL Database)]
```

---

## 2. Multi-Tenant Data Isolation Strategy

- **Logical Data Isolation**: Every entity (`User`, `Merchant`, `Transaction`, `AuditLog`, `Notification`, `ApiKey`) contains a non-nullable `tenantId`.
- **JWT Context Enforcement**: JWT tokens embed `tenantId` and `role`. 
- **RBAC Roles Hierarchy**:
  1. `SUPER_ADMIN` (Cross-tenant access for system management)
  2. `TENANT_ADMIN` (Full administrative privileges within tenant workspace)
  3. `MANAGER` (Transaction management and reporting access)
  4. `OPERATOR` (Transaction creation and basic operational access)
  5. `VIEWER` (Read-only access to dashboard and logs)

---

## 3. Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    Tenant ||--o{ User : contains
    Tenant ||--o{ Merchant : owns
    Tenant ||--o{ AuditLog : records
    Tenant ||--o{ Notification : logs
    Tenant ||--o{ ApiKey : owns
    Merchant ||--o{ Transaction : processes

    Tenant {
        string id PK
        string name
        string slug UK
        datetime createdAt
        datetime updatedAt
    }

    User {
        string id PK
        string email UK
        string passwordHash
        string refreshTokenHash
        enum role
        string tenantId FK
        boolean isActive
    }

    Merchant {
        string id PK
        string name
        string email
        string status
        string tenantId FK
    }

    Transaction {
        string id PK
        float amount
        string currency
        string status
        string reference UK
        string merchantId FK
    }

    AuditLog {
        string id PK
        string action
        string userId
        string tenantId FK
        string details
        datetime createdAt
    }

    Notification {
        string id PK
        string title
        string message
        string type
        boolean isRead
        string tenantId FK
    }
```
