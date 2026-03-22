import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import chalk from 'chalk';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.use(cookieParser(process.env.COOKIE_SECRET))

  const frontend = process.env.FRONTEND_IP

  let origins: (string | RegExp)[] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    /^http:\/\/10\./,
    /^http:\/\/172\.1[0-6]\./,
    /^http:\/\/172\.2[0-9]\./,
    /^http:\/\/172\.3[0-1]\./,
    /^http:\/\/192\.168\./,
  ]

  if (frontend) {
    origins = [
      ...origins,
      frontend
    ]
  }

  app.enableCors({
    origin: origins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle("BarSonar API")
    .setDescription("Barsonar Backend NestJS + Prisma + Swagger")
    .setVersion("1.0.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      operationsSorter: (a: any, b: any) => {
        const methodOrder: Record<string, number> = {
          get: 1,
          post: 2,
          delete: 3,
          put: 4,
        };

        const methodA = a.get("method")
        const methodB = b.get("method")

        return (methodOrder[methodA] || 99) - (methodOrder[methodB] || 99)
      }
    }
  })

  app.useGlobalPipes(new ValidationPipe())

  app.use("/uploads", express.static(join(process.cwd(), "uploads")))

  const port = process.env.PORT ?? 3000
  await app.listen(port, '0.0.0.0')

  console.log(
    chalk.red(`\n${chalk.rgb(128, 0, 128)("Server running on:")} http://0.0.0.0:${port}`)
  )

  console.log(chalk.green(`\n${chalk.rgb(128, 0, 128)("Allowed origins:")}`))
  origins.forEach((e) => {
    if (typeof e !== "string") {
      e =
        e.source
          .replace(/^\^/, "")
          .replace(/\\\/\\\//, "//")
          .replace(/\\/, "")
          .replace(/\\\./, "")
    }

    console.log(chalk.green(`\t${e}`))
  })
}
void bootstrap();
