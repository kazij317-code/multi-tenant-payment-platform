const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 0. System Master Tenant & Super Admin Users
  const systemTenant = await prisma.tenant.upsert({
    where: { slug: 'system' },
    update: {},
    create: {
      name: 'System Administration',
      slug: 'system',
      status: 'ACTIVE',
    },
  });

  const hashedPasswordAdmin1 = await bcrypt.hash('SuperAdmin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@platform.com' },
    update: {
      passwordHash: hashedPasswordAdmin1,
      role: 'SUPER_ADMIN',
      tenantId: systemTenant.id,
    },
    create: {
      email: 'admin@platform.com',
      passwordHash: hashedPasswordAdmin1,
      role: 'SUPER_ADMIN',
      tenantId: systemTenant.id,
      firstName: 'Super',
      lastName: 'Admin',
    },
  });

  const hashedPasswordAdmin2 = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'superadmin@platform.com' },
    update: {
      passwordHash: hashedPasswordAdmin2,
      role: 'SUPER_ADMIN',
      tenantId: systemTenant.id,
    },
    create: {
      email: 'superadmin@platform.com',
      passwordHash: hashedPasswordAdmin2,
      role: 'SUPER_ADMIN',
      tenantId: systemTenant.id,
      firstName: 'Super',
      lastName: 'Admin',
    },
  });

  // 1. Beta Corp Tenant & Users
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

  const hashedPasswordBetaAdmin = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@beta.com' },
    update: {
      passwordHash: hashedPasswordBetaAdmin,
      tenantId: betaTenant.id,
      role: 'TENANT_ADMIN',
    },
    create: {
      email: 'admin@beta.com',
      passwordHash: hashedPasswordBetaAdmin,
      role: 'TENANT_ADMIN',
      tenantId: betaTenant.id,
      firstName: 'Beta',
      lastName: 'Admin',
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

  // Additional demo merchants to total 18 active profiles
  for (let i = 3; i <= 15; i++) {
    await prisma.merchant.upsert({
      where: { id: `m-beta-${i}` },
      update: {},
      create: {
        id: `m-beta-${i}`,
        name: `Beta Merchant Branch #${i}`,
        email: `branch${i}@beta.com`,
        tenantId: betaTenant.id,
        status: 'ACTIVE',
      },
    });
  }



  // 4. Create 28 Demo Transactions to reach $18,840.00 Revenue ($18,584 SUCCESS + $256 COMPLETED)
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
    // Batch 2 to match Localhost 28 transactions ($18,840)
    { id: 'tx-15', reference: 'TXN-2001', amount: 5000, status: 'SUCCESS', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-16', reference: 'TXN-2002', amount: 4292, status: 'SUCCESS', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
    { id: 'tx-17', reference: 'TXN-2003', amount: 128, status: 'COMPLETED', paymentMethod: 'Card', merchantId: acmeMerchant1.id },
    { id: 'tx-18', reference: 'TXN-2004', amount: 1200, status: 'PENDING', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-19', reference: 'TXN-2005', amount: 1500, status: 'REFUNDED', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
    { id: 'tx-20', reference: 'TXN-2006', amount: 1100, status: 'REFUNDED', paymentMethod: 'Card', merchantId: acmeMerchant1.id },
    { id: 'tx-21', reference: 'TXN-2007', amount: 1000, status: 'REFUNDED', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-22', reference: 'TXN-2008', amount: 350, status: 'SUCCESS', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
    { id: 'tx-23', reference: 'TXN-2009', amount: 450, status: 'SUCCESS', paymentMethod: 'Card', merchantId: acmeMerchant1.id },
    { id: 'tx-24', reference: 'TXN-2010', amount: 200, status: 'SUCCESS', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-25', reference: 'TXN-2011', amount: 150, status: 'SUCCESS', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
    { id: 'tx-26', reference: 'TXN-2012', amount: 500, status: 'SUCCESS', paymentMethod: 'Card', merchantId: acmeMerchant1.id },
    { id: 'tx-27', reference: 'TXN-2013', amount: 300, status: 'SUCCESS', paymentMethod: 'bKash', merchantId: betaMerchant1.id },
    { id: 'tx-28', reference: 'TXN-2014', amount: 2042, status: 'SUCCESS', paymentMethod: 'Nagad', merchantId: betaMerchant2.id },
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
