import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser(process.env.COOKIE_SECRET));

  const frontend = process.env.FRONTEND_IP || "0.0.0.0"

  app.enableCors({
    origin: [
      "localhost:5173",
      "http://127.0.0.1:5173",
      /^http:\/\/10\./,
      /^http:\/\/172\.1[0-6]\./,
      /^http:\/\/172\.2[0-9]\./,
      /^http:\/\/172\.3[0-1]\./,
      /^http:\/\/192\.168\./,
      frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Barsonar API')
    .setDescription('Barsonar Backend NestJS + Prisma + Swagger')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      operationsSorter: (a: any, b: any) => {
        const methodOrder: Record<string, number> = {
          get: 1,
          post: 2,
          delete: 3,
          put: 4,
        };

        const methodA = a.get('method');
        const methodB = b.get('method');

        return (methodOrder[methodA] || 99) - (methodOrder[methodB] || 99);
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // await app.listen(process.env.PORT ?? 3000);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on http://0.0.0.0:${port}`);
}
void bootstrap();
