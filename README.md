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
- **Frontend App**: [http://localhost:3001](http://localhost:3001)
- **Mailpit Dashboard**: [http://localhost:8025](http://localhost:8025)
- **Prometheus Dashboard**: [http://localhost:9090](http://localhost:9090)

---

## 🎁 Bonus & Production Features Implemented

1. **Redis Caching**: Configured containerized Redis caching for optimized database query speed.
2. **CI/CD Pipeline**: GitHub Actions workflow ([`.github/workflows/ci.yml`](file:///e:/Projects/multi-tenant-payment-platform/.github/workflows/ci.yml)) for automated linting, unit & E2E testing, and Docker builds.
3. **Kubernetes Deployment**: Fully configured K8s manifests in [`k8s/`](file:///e:/Projects/multi-tenant-payment-platform/k8s/) featuring Deployments, ClusterIP Services, ConfigMap/Secret management, HorizontalPodAutoscaler (HPA), and NGINX Ingress rules.
4. **Prometheus Monitoring**: Metrics collection & scrape configuration ([`monitoring/prometheus.yml`](file:///e:/Projects/multi-tenant-payment-platform/monitoring/prometheus.yml)).
5. **Integration & E2E Testing**: Comprehensive test coverage for Auth, User Management, and Transaction Flow in [`apps/api/test/`](file:///e:/Projects/multi-tenant-payment-platform/apps/api/test/).

---

## 🔑 Test Credentials (Mock Data)

| Role | Email | Password | Tenant |
|---|---|---|---|
| Super Admin | `admin@platform.com` | `SuperAdmin@123` | System (`system`) |
| Manager | `manager@beta.com` | `newpassword123` | Beta Corp (`beta-corp`) |
| Manager | `manager@acme.com` | `Nabhan@123` | Acme Corp (`acme-corp`) |

---

## 🧪 Testing

```bash
cd apps/api

# Run Unit Tests
npm test

# Run Integration / E2E Tests
npm run test:e2e
```

---

## 📚 Documentation
- System Architecture & ERD Diagram: [`docs/ARCHITECTURE.md`](file:///e:/Projects/multi-tenant-payment-platform/docs/ARCHITECTURE.md)
- Complete Project Documentation: [`PROJECT_DOCUMENTATION.md`](file:///e:/Projects/multi-tenant-payment-platform/PROJECT_DOCUMENTATION.md)

