import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // সিকিউর হেডার্স (Secure Headers, XSS Protection & CSP)
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

  // CORS এনাবল করা
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // গ্লোবাল ভ্যালিডেশন পাইপ
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // গ্লোবাল এরর ফিল্টার এবং স্ট্রাকচার্ড লগার ইন্টারসেপ্টর
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // সোয়াগার কনফিগারেশন
  const config = new DocumentBuilder()
    .setTitle('Multi-Tenant Payment Platform API')
    .setDescription('The Multi-Tenant Payment Platform API documentation with authentication, transactions, notifications, and reports.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();