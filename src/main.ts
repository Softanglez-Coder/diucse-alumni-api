import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cacheManager = app.get<Cache>(CACHE_MANAGER);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new CacheInterceptor(cacheManager, reflector));
  const port = process.env.PORT ?? 3000;
  await app
    .listen(port)
    .then(() => console.log(`Server running on http://localhost:${port}`));
}

bootstrap();


