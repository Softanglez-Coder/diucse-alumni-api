import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add security headers
  app.use(helmet());

  // Enable cookie parsing
  app.use(cookieParser());

  // Enable CORS
  const corsOrigins = process.env.NODE_ENV === 'production'
    ? [
        'https://csediualumni.com',
        'https://admin.csediualumni.com',
      ]
    : [
        'https://csediualumni.com',
        'https://admin.csediualumni.com',
        'http://localhost:4200',
        'http://localhost:4300',
        'http://localhost:3000'
      ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Add global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
