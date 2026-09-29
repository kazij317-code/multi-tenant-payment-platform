// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import * as crypto from 'crypto';

// @Injectable()
// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import * as crypto from 'crypto';

// @Injectable()
// export class ApiKeysService {
//   constructor(private prisma: PrismaService) {}

//   async createApiKey(tenantId: string, name: string) {
//     const generatedKey = `pk_live_${crypto.randomBytes(24).toString('hex')}`;
    
//     return this.prisma.apiKey.create({
//       data: {
//         name,
//         key: generatedKey,
//         tenantId,
//       },
//     });
//   }

//   async getApiKeysByTenant(tenantId: string) {
//     return this.prisma.apiKey.findMany({
//       where: { tenantId },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async deleteApiKey(id: string, tenantId: string) {
//     return this.prisma.apiKey.deleteMany({
//       where: { id, tenantId },
//     });
//   }
// }

// ------------
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async createApiKey(tenantId: string, name: string) {
    const generatedKey = `pk_live_${crypto.randomBytes(24).toString('hex')}`;
    
    return this.prisma.apiKey.create({
      data: {
        name,
        key: generatedKey,
        tenantId,
      },
    });
  }

  async getApiKeysByTenant(tenantId: string) {
    return this.prisma.apiKey.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteApiKey(id: string, tenantId: string) {
    return this.prisma.apiKey.deleteMany({
      where: { id, tenantId },
    });
  }
}