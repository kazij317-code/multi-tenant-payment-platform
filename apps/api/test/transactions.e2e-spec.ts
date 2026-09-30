import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Transaction Flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /transactions', () => {
    it('should reject unauthenticated transaction list requests with 401', async () => {
      await request(app.getHttpServer())
        .get('/transactions')
        .expect(401);
    });
  });

  describe('POST /transactions', () => {
    it('should enforce authentication guard when creating transaction', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          merchantId: 'merchant-123',
          amount: 500,
          currency: 'USD',
          paymentMethod: 'CREDIT_CARD',
        })
        .expect(401);
    });
  });

  describe('PATCH /transactions/:id/approve', () => {
    it('should reject unauthenticated transaction approval requests', async () => {
      await request(app.getHttpServer())
        .patch('/transactions/tx-123/approve')
        .expect(401);
    });
  });
});
