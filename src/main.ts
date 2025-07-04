import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add security headers
  app.use(helmet());

  // Enable CORS
  app.enableCors({
    origin: [
      'https://csediualumni.com',
      'https://admin.csediualumni.com',
      'https://portal.csediualumni.com',
      'http://localhost:4200',
      'http://admin.localhost:4300',
      'http://portal.localhost:4400'
    ],
    credentials: true,
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
