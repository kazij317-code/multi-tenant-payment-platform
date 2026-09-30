import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('User Management (e2e)', () => {
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

  describe('GET /users', () => {
    it('should reject unauthenticated user listing requests with 401 Unauthorized', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });
  });

  describe('POST /users', () => {
    it('should prevent unauthorized creation of users', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'testuser@tenant.com',
          name: 'Test User',
          role: 'OPERATOR',
        })
        .expect(401);
    });
  });
});
