import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv'
import * as express from 'express'
dotenv.config()
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*"
  })
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
