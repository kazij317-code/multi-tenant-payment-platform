// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common'; // এটি ইমপোর্ট করো

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // গ্লোবাল ভ্যালিডেশন পাইপ যুক্ত করা
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true, // DTO-তে ডিফাইন করা নাই এমন কোনো অতিরিক্ত ফিল্ড রিকোয়েস্টে আসলে তা রিমুভ করে দিবে
//     forbidNonWhitelisted: true, // অতিরিক্ত ফিল্ড আসলে এরর দিবে
//     transform: true, // স্বয়ংক্রিয়ভাবে ডেটা টাইপ রূপান্তর করবে (যেমন স্ট্রিং থেকে নাম্বারে)
//   }));

//   await app.listen(3000);
// }
// bootstrap();

// -----------------

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS এনাবল করা
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
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

  await app.listen(5000);
}
bootstrap();