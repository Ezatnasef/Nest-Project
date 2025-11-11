// src/main.ts

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response/wrap-response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 🚨 1. استدعاء Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // 🚨 2. إعداد Swagger (التوثيق) 🚨
  const config = new DocumentBuilder()
    .setTitle('NestJS Spotify Clone API')
    .setDescription('API documentation for the core services, authentication, and security features.')
    .setVersion('1.0')
    .addTag('Auth') // تصنيف أساسي
    .addBearerAuth() // 3. إضافة زر Authorize (JWT)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 4. تشغيل الصفحة على مسار /api

  await app.listen(3000);
}

bootstrap();