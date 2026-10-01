import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 0. System Master Tenant & Super Admin User
  const systemTenant = await prisma.tenant.upsert({
    where: { slug: 'system' },
    update: {},
    create: {
      name: 'System Administration',
      slug: 'system',
      status: 'ACTIVE',
    },
  });

  const hashedPasswordAdmin = await bcrypt.hash('SuperAdmin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@platform.com' },
    update: {
      passwordHash: hashedPasswordAdmin,
      role: 'SUPER_ADMIN',
      tenantId: systemTenant.id,
    },
    create: {
      email: 'admin@platform.com',
      passwordHash: hashedPasswordAdmin,
      role: 'SUPER_ADMIN',
      tenantId: systemTenant.id,
      firstName: 'Super',
      lastName: 'Admin',
    },
  });

  // 1. Beta Corp Tenant & User
  const betaTenant = await prisma.tenant.upsert({
    where: { slug: 'beta-corp' },
    update: {},
    create: {
      name: 'Beta Corp',
      slug: 'beta-corp',
      status: 'ACTIVE',
    },
  });

  const hashedPasswordBeta = await bcrypt.hash('newpassword123', 10);
  await prisma.user.upsert({
    where: { email: 'manager@beta.com' },
    update: {
      passwordHash: hashedPasswordBeta,
      tenantId: betaTenant.id,
    },
    create: {
      email: 'manager@beta.com',
      passwordHash: hashedPasswordBeta,
      role: 'MANAGER',
      tenantId: betaTenant.id,
    },
  });

  // 2. Acme Corp Tenant & User
  const acmeTenant = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      status: 'ACTIVE',
    },
  });

  const hashedPasswordAcme = await bcrypt.hash('Nabhan@123', 10);
  await prisma.user.upsert({
    where: { email: 'manager@acme.com' },
    update: {
      passwordHash: hashedPasswordAcme,
      tenantId: acmeTenant.id,
    },
    create: {
      email: 'manager@acme.com',
      passwordHash: hashedPasswordAcme,
      role: 'MANAGER',
      tenantId: acmeTenant.id,
    },
  });

  // 3. Create Demo Merchants for Beta Corp and Acme Corp
  const betaMerchant1 = await prisma.merchant.upsert({
    where: { id: 'm-beta-1' },
    update: {},
    create: {
      id: 'm-beta-1',
      name: 'Beta Electronics Store',
      email: 'store@beta.com',
      tenantId: betaTenant.id,
      status: 'ACTIVE',
    },
  });

  const betaMerchant2 = await prisma.merchant.upsert({
    where: { id: 'm-beta-2' },
    update: {},
    create: {
      id: 'm-beta-2',
      name: 'Beta Fashion Wear',
      email: 'fashion@beta.com',
      tenantId: betaTenant.id,
      status: 'ACTIVE',
    },
  });

  const acmeMerchant1 = await prisma.merchant.upsert({
    where: { id: 'm-acme-1' },
    update: {},
    create: {
      id: 'm-acme-1',
      name: 'Acme Supermart',
      email: 'supermart@acme.com',
      tenantId: acmeTenant.id,
      status: 'ACTIVE',
    },
  });

  // 4. Create 14 Clean Demo Transactions
  const transactionsData = [
    { id: 'tx-1', reference: 'TXN-1001', amount: 5000, status: 'SUCCESS', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-2', reference: 'TXN-1002', amount: 4292, status: 'SUCCESS', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
    { id: 'tx-3', reference: 'TXN-1003', amount: 128, status: 'COMPLETED', paymentMethod: 'Card', merchantId: acmeMerchant1.id },
    { id: 'tx-4', reference: 'TXN-1004', amount: 1200, status: 'PENDING', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-5', reference: 'TXN-1005', amount: 1500, status: 'REFUNDED', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
    { id: 'tx-6', reference: 'TXN-1006', amount: 1100, status: 'REFUNDED', paymentMethod: 'Card', merchantId: acmeMerchant1.id },
    { id: 'tx-7', reference: 'TXN-1007', amount: 1000, status: 'REFUNDED', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-8', reference: 'TXN-1008', amount: 350, status: 'PROCESSING', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
    { id: 'tx-9', reference: 'TXN-1009', amount: 450, status: 'PROCESSING', paymentMethod: 'Card', merchantId: acmeMerchant1.id },
    { id: 'tx-10', reference: 'TXN-1010', amount: 200, status: 'PROCESSING', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-11', reference: 'TXN-1011', amount: 150, status: 'PROCESSING', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
    { id: 'tx-12', reference: 'TXN-1012', amount: 500, status: 'PROCESSING', paymentMethod: 'Card', merchantId: acmeMerchant1.id },
    { id: 'tx-13', reference: 'TXN-1013', amount: 300, status: 'PROCESSING', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-14', reference: 'TXN-1014', amount: 250, status: 'PROCESSING', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
  ];

  for (const tx of transactionsData) {
    await prisma.transaction.upsert({
      where: { id: tx.id },
      update: {
        amount: tx.amount,
        status: tx.status,
      },
      create: tx,
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
