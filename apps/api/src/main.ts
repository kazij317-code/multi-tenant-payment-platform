import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // এটি ইমপোর্ট করো

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // গ্লোবাল ভ্যালিডেশন পাইপ যুক্ত করা
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO-তে ডিফাইন করা নাই এমন কোনো অতিরিক্ত ফিল্ড রিকোয়েস্টে আসলে তা রিমুভ করে দিবে
    forbidNonWhitelisted: true, // অতিরিক্ত ফিল্ড আসলে এরর দিবে
    transform: true, // স্বয়ংক্রিয়ভাবে ডেটা টাইপ রূপান্তর করবে (যেমন স্ট্রিং থেকে নাম্বারে)
  }));

  await app.listen(3000);
}
bootstrap();