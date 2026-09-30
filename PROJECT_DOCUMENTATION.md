# Multi-Tenant Payment Platform - System Documentation

**Project Name:** Multi-Tenant Payment & Merchant Management Platform  
**Architecture:** Multi-Tenant SaaS (Isolated Workspaces)  
**Backend:** Node.js, NestJS, Prisma ORM, PostgreSQL, Passport JWT, Swagger  
**Frontend:** Next.js 16 (App Router), React 19, TypeScript, Lucide Icons, Tailwind CSS  
**Date:** October 2026  

---

## Executive Summary

The **Multi-Tenant Payment Platform** is an enterprise-grade payment and merchant management solution. It provides complete data isolation across multiple corporate tenants while offering a centralized global admin panel for system administrators.

The system features robust role-based access control (RBAC) spanning 5 hierarchical roles, real-time in-app notifications, transactional email alerts, audit logging, custom period reporting with CSV export, and Swagger-documented RESTful APIs.

---

## 🏗️ System Architecture & Technology Stack

```
+-----------------------------------------------------------------------+
|                           FRONTEND LAYER                              |
|   Next.js 16 (App Router) | React 19 | TypeScript | Tailwind CSS      |
|   Axios (Interceptors)    | Lucide Icons | Responsive Glassmorphism UI |
+-----------------------------------+-----------------------------------+
                                    |
                            HTTP / REST APIs
                                    |
+-----------------------------------+-----------------------------------+
|                           BACKEND LAYER                               |
|   NestJS Framework        | TypeScript        | Swagger (/api-docs)   |
|   Passport JWT Auth       | RolesGuard (RBAC) | Throttler Guard       |
|   AllExceptionsFilter     | LoggingInterceptor| Mail & Notifications  |
+-----------------------------------+-----------------------------------+
                                    |
                               Prisma ORM
                                    |
+-----------------------------------+-----------------------------------+
|                           DATABASE LAYER                              |
|   PostgreSQL (Multi-tenant schemas: Tenants, Users, Merchants,        |
|   Transactions, AuditLogs, Notifications, ApiKeys, SystemConfigs)     |
+-----------------------------------------------------------------------+
```

---

## 🔑 5-Role Based Access Control (RBAC) Matrix

| Role | Tenant Scope | Key Capabilities |
| :--- | :--- | :--- |
| **`SUPER_ADMIN`** | Global Platform | Global overview, Tenant CRUD & status, Global User Management, System Config, Global Audit Logs. |
| **`TENANT_ADMIN`** | Single Tenant | Full workspace management, User CRUD & role assignment, Merchant CRUD & status, API keys, Reports. |
| **`MANAGER`** | Single Tenant | Transaction Approvals, Rejections, Refunds, Merchant performance observation, Reports & CSV Export. |
| **`OPERATOR`** | Single Tenant | Create & entry new transaction requests, check status, read-only view of merchants and dashboard. |
| **`VIEWER`** | Single Tenant | Read-only access across transactions, merchants, dashboard analytics, and reports. No mutate permissions. |

---

## 🛠️ Implemented Modules & Features

### 1. Multi-Tenant Architecture & Isolation
- Data isolation enforced via `tenantId` across database models.
- Support for Master System Tenant (`system`) and Corporate Tenants (`beta-corp`, `acme-corp`).
- Tenant lifecycle control: Create Tenant, Suspend/Activate Tenant status.

### 2. Authentication & Authorization
- **JWT Authentication**: Short-lived Access Tokens + Hashed Refresh Tokens in DB.
- **Login & Register**: Secure bcrypt password hashing.
- **Logout Flow**: Token invalidation and automatic `USER_LOGOUT` audit log recording.

### 3. Merchant Management
- Full CRUD: Create Merchant, Edit Details, Activate / Suspend Merchant.
- Merchant Profile Modal: Detailed overview of merchant status, email, and recent transactions.

### 4. User Management
- User CRUD: Create User, Edit User, Delete User, Assign Roles (`SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`, `OPERATOR`, `VIEWER`).
- Real-time search, pagination, and role filters.

### 5. Transaction Management
- Fields: Transaction Reference, Merchant, Amount, Currency, Status, Payment Method, Created By, Created Date.
- Status Lifecycle: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `REFUNDED`.
- Operations: Create Transaction, Approve Transaction (`COMPLETED`), Reject Transaction (`FAILED`), Refund Transaction (`REFUNDED`).
- Multi-field Search & Filters.

### 6. Dashboard Analytics
- Summary Metric Cards: Revenue, Total Transactions, Failed Transactions, Total Merchants, Active API Keys.
- Transaction Status Breakdown Charts & Distribution.
- Recent Transactions Feed.

### 7. Notification System
- **In-App Notifications**: Real-time alerts for Transaction Created, Transaction Failed, User Created, Transaction Approved/Refunded.
- **Email Notifications**: Password Reset email with token link, Transaction Status Update emails (`COMPLETED`, `FAILED`, `REFUNDED`).

### 8. Reporting & Data Export
- Filter Presets: **All Time**, **Daily (Today)**, **Monthly (This Month)**, **Custom Date Range** (Start Date & End Date).
- Dynamic Reporting: Filtered revenue calculation, transaction counts, status breakdown, and recent transaction feeds.
- **CSV Export**: One-click download of transactions report matching active date range filters.

### 9. System Audit Logs
- Tracks: Login (`USER_LOGIN`), Logout (`USER_LOGOUT`), User Creation (`USER_CREATED`), Role Changes (`SUPERADMIN_USER_ROLE_UPDATED`, `USER_UPDATED`), Transaction Actions (`TRANSACTION_CREATED`, `TRANSACTION_APPROVED`, `TRANSACTION_REJECTED`, `TRANSACTION_REFUNDED`).
- Enriched User Data: Includes User Email, Name, Role, Tenant Name, and exact Timestamp.

### 10. Technical Requirements & Security Implementation
- **Password Hashing**: `bcrypt` salt-hashed passwords for secure user credential storage.
- **JWT Security**: Access Tokens (15m) + Database Hashed Refresh Tokens (7d) with `PassportJwtStrategy`.
- **Rate Limiting**: NestJS `@nestjs/throttler` (`ThrottlerGuard`) limiting requests to prevent brute force and DoS attacks.
- **Input Validation**: Global `ValidationPipe` with DTO whitelist, forbidNonWhitelisted fields, and type auto-transformation.
- **SQL Injection Protection**: Prisma ORM parameterized SQL queries preventing any SQL injection attacks.
- **XSS Protection & Secure Headers**: Integrated `helmet` middleware configuring HTTP security headers (X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, HSTS).
- **Environment Variables**: Managed via `.env` configuration files for database connection string, JWT secrets, and ports.
- **Global Error Handling**: `AllExceptionsFilter` formatting errors into structured JSON responses (`statusCode`, `timestamp`, `path`, `method`, `message`).
- **Structured Logging**: `LoggingInterceptor` capturing HTTP Method, Path, Status Code, IP, User Agent, Execution Delay (ms).
- **Swagger Documentation**: Live interactive API docs at `http://localhost:5000/api-docs`.

---

## 📑 API Endpoints Summary

### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout & audit log
- `POST /auth/refresh` - Refresh JWT tokens
- `POST /auth/forgot-password` - Request password reset email
- `POST /auth/reset-password` - Reset password

### Merchants (`/merchants`)
- `GET /merchants` - List tenant merchants
- `GET /merchants/:id` - Merchant profile & transactions
- `POST /merchants` - Create merchant
- `PATCH /merchants/:id` - Update merchant
- `PATCH /merchants/:id/status` - Toggle status (ACTIVE/SUSPENDED)
- `GET /merchants/global` - Global merchants list (Super Admin)

### Transactions (`/transactions`)
- `GET /transactions` - List tenant transactions with status/search filter
- `POST /transactions` - Create/entry transaction
- `PATCH /transactions/:id/approve` - Approve transaction
- `PATCH /transactions/:id/reject` - Reject transaction
- `PATCH /transactions/:id/refund` - Refund transaction
- `GET /transactions/global` - Global transactions (Super Admin)

### Users (`/users`)
- `GET /users` - List tenant users (paginated & searchable)
- `POST /users` - Create user in tenant
- `PATCH /users/:id` - Update user details/role
- `DELETE /users/:id` - Delete user
- `GET /users/global` - Global user list (Super Admin)
- `PATCH /users/global/:id/role` - Change user role globally

### Reports (`/reports`)
- `GET /reports/summary` - Transaction summary & chart data (supports period & date range)
- `GET /reports/transactions/csv` - Download CSV report matching filters
- `GET /reports/global-summary` - Global system summary (Super Admin)

### Audit Logs (`/audit-logs`)
- `GET /audit-logs` - Tenant audit logs
- `GET /audit-logs/global` - Global audit logs (Super Admin)

---

## 🗄️ Database Architecture & Performance Indexing

- **Database Engine**: PostgreSQL (Relational SQL Database).
- **ORM & Migrations**: Prisma ORM with versioned SQL migrations (`prisma/schema.prisma`).
- **Tenant Isolation Strategy**: Multi-tenant data segregation enforced at schema & query level using indexed `tenantId` foreign key relations (`onDelete: Cascade`).
- **Performance Indexes**:
  - `User`: `@@index([tenantId])`, `@@index([email])`, `@@index([role])`
  - `Merchant`: `@@index([tenantId])`, `@@index([status])`, `@@index([email])`
  - `Transaction`: `@@index([merchantId])`, `@@index([status])`, `@@index([createdAt])`, `@@index([reference])`
  - `AuditLog`: `@@index([tenantId])`, `@@index([userId])`, `@@index([createdAt])`, `@@index([action])`
  - `Notification`: `@@index([tenantId])`, `@@index([isRead])`, `@@index([createdAt])`
  - `ApiKey`: `@@index([tenantId])`, `@@index([key])`

---

*Documentation generated for Multi-Tenant Payment Platform.*
