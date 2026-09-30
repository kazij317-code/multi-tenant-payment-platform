import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Beta Corp Tenant & User
  const betaTenant = await prisma.tenant.upsert({
    where: { slug: 'beta-corp' },
    update: {},
    create: {
      name: 'Beta Corp',
      slug: 'beta-corp',
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
