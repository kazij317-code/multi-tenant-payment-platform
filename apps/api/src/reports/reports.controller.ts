// // // import { Controller, Get, UseGuards, Req } from '@nestjs/common';
// // // import { ReportsService } from './reports.service';
// // // import { AuthGuard } from '@nestjs/passport';
// // // import { RolesGuard } from '../auth/guards/roles.guard';
// // // import { Roles } from '../auth/decorators/roles.decorator';
// // // import { Role } from '@prisma/client';

// // // @Controller('reports')
// // // @UseGuards(AuthGuard('jwt'), RolesGuard)
// // // export class ReportsController {
// // //   constructor(private readonly reportsService: ReportsService) {}

// // //   @Get('summary')
// // //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
// // //   async getSummary(@Req() req: any) {
// // //     const tenantId = req.user.tenantId; // টোকেন থেকে টিনেন্ট আইডি নেওয়া
// // //     return this.reportsService.getTransactionSummary(tenantId);
// // //   }
// // // }

// // // -------------------

// // import { Controller, Get, UseGuards, Req } from '@nestjs/common';
// // import { ReportsService } from './reports.service';
// // import { AuthGuard } from '@nestjs/passport';
// // import { RolesGuard } from '../auth/guards/roles.guard';
// // import { Roles } from '../auth/decorators/roles.decorator';
// // import { Role } from '@prisma/client';

// // @Controller('reports')
// // @UseGuards(AuthGuard('jwt'), RolesGuard)
// // export class ReportsController {
// //   constructor(private readonly reportsService: ReportsService) {}

// //   @Get('summary')
// //   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
// //   async getSummary(@Req() req: any) {
// //     const tenantId = req.user.tenantId; // টোকেন থেকে টিনেন্ট আইডি নেওয়া
// //     return this.reportsService.getTransactionSummary(tenantId);
// //   }
// // }

// // ------------------

// import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
// import { ReportsService } from './reports.service';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Role } from '@prisma/client';
// import type { Response } from 'express'; // 'import type' ব্যবহার করা হয়েছে


// @Controller('reports')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// export class ReportsController {
//   constructor(private readonly reportsService: ReportsService) {}

//   @Get('summary')
//   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER)
//   async getSummary(@Req() req: any) {
//     const tenantId = req.user.tenantId; // টোকেন থেকে টিনেন্ট আইডি নেওয়া
//     return this.reportsService.getTransactionSummary(tenantId);
//   }

//   @Get('transactions/csv')
//   @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
//   async downloadTransactionsCsv(@Req() req: any, @Res() res: Response) {
//     const tenantId = req.user.tenantId;
//     const csv = await this.reportsService.exportTransactionsCsv(tenantId);

//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename=transactions-report.csv');
    
//     return res.status(200).send(csv);
//   }
// }

// ---------------

import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'; // সোয়াগার ডেকোরেটর ইমপোর্ট

@ApiTags('Reports') // সোয়াগার ইউআইতে ক্যাটাগরি নাম
@ApiBearerAuth()    // টোকেন ইনপুট দেওয়ার অপশন এনাবল করবে
@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.OPERATOR, Role.VIEWER)
  @ApiOperation({ summary: 'Get transaction summary and dashboard stats for tenant' })
  async getSummary(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.reportsService.getTransactionSummary(tenantId);
  }

  @Get('transactions/csv')
  @Roles(Role.SUPER_ADMIN, Role.TENANT_ADMIN)
  @ApiOperation({ summary: 'Download transactions report as CSV' })
  async downloadTransactionsCsv(@Req() req: any, @Res() res: Response) {
    const tenantId = req.user.tenantId;
    const csv = await this.reportsService.exportTransactionsCsv(tenantId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions-report.csv');
    
    return res.status(200).send(csv);
  }
}