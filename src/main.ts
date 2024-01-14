import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ErrorHandlerExceptionFilter } from './filters/error-handler-exception.filter';
import { join, resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new ErrorHandlerExceptionFilter());
  await app.listen(1812);
}
bootstrap();
