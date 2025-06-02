import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { MemberService } from '@member';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const memberService = app.get(MemberService);
  await memberService.createBot();

  // Add security headers
  app.use(helmet());

  // Enable CORS
  app.enableCors();

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
