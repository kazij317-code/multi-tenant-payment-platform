# Multi-Tenant Payment Platform

A enterprise-grade, multi-tenant payment platform built with **NestJS**, **Prisma ORM**, **PostgreSQL**, and **Next.js**.

## 🚀 Features & Modules

1. **Multi-Tenant Architecture**: Complete tenant-level data isolation via `tenantId`.
2. **Authentication & RBAC**:
   - JWT Auth & Refresh Tokens
   - Role-Based Access Control (`SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`, `OPERATOR`, `VIEWER`)
3. **Merchant Management**: Full CRUD operations with activate/suspend functionality.
4. **User Management**: Create, update, assign roles, pagination, and tenant scoping.
5. **Transaction Management**:
   - Statuses: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `REFUNDED`
   - Operations: Create, Approve, Reject, Refund, Filter & Search
6. **Dashboard**: Analytics, financial aggregations, and transaction summary cards.
7. **Notifications**: In-app notifications & transactional email alerts (via Mailpit/Nodemailer).
8. **Reporting & Audit Logs**: Export transactions as CSV; immutable audit logs for security compliance.

---

## 🛠️ Quick Setup & Installation

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (if running locally without Docker)

### 1. Run with Docker Compose
```bash
docker-compose up --build -d
```

### 2. Manual Local Setup
```bash
# Install root & backend dependencies
cd apps/api
npm install

# Run database migrations
npx prisma migrate dev --name init

# Start backend dev server
npm run start:dev
```

- **Swagger Documentation**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Mailpit Dashboard**: [http://localhost:8025](http://localhost:8025)

---

## 🔑 Test Credentials (Mock Data)

| Role | Email | Password | Tenant |
|---|---|---|---|
| Super Admin | `superadmin@platform.com` | `admin123` | N/A |
| Tenant Admin | `admin@beta.com` | `admin123` | `beta-corp` |
| Manager | `manager@beta.com` | `newpassword123` | `beta-corp` |

---

## 🧪 Testing

```bash
cd apps/api
npm test
```

---

## 📚 Documentation
- System Architecture & ERD Diagram: [`docs/ARCHITECTURE.md`](file:///e:/Projects/multi-tenant-payment-platform/docs/ARCHITECTURE.md)
