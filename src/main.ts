import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { UserService } from '@user';
import { Role } from '@core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userService = app.get(UserService);

  // create bot user if it doesn't exist
  const botEmail = process.env.BOT_EMAIL;
  const botPassword = process.env.BOT_PASSWORD;
  if (botEmail && botPassword) {
    try {
      const existingUser = await userService.findByEmail(botEmail);
      
      if (!existingUser) {
        await userService.createBotAccount(botEmail, botPassword);
        console.log(`Bot user created with email: ${botEmail}`);
      } else {
        console.log(`Bot user already exists with email: ${botEmail}`);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        if (error.getStatus() === HttpStatus.NOT_FOUND) {
          await userService.createBotAccount(botEmail, botPassword);
          console.log(`Bot user created with email: ${botEmail}`);
          return;
        }

        if (error.getStatus() === HttpStatus.BAD_REQUEST) {
          console.error(`Bad request: ${error.message}`);
          return;
        }

        return console.error(`Error: ${error.message}`);
      }

      console.error(`Error creating bot user: ${error.message}`);
    }
  } else {
    console.warn('BOT_EMAIL and BOT_PASSWORD environment variables are not set.');
  }

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
