import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { PlaceService } from './place/place.service';
import { PlaceController } from './place/place.controller';
import { PlaceModule } from './place/place.module';
import { PhotoService } from './photo/photo.service';
import { PhotoController } from './photo/photo.controller';
import { PhotoModule } from './photo/photo.module';
import { UserController } from './user/user.controller';
import { CommentController } from './comment/comment.controller';
import { UserService } from './user/user.service';
import { CommentService } from './comment/comment.service';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: "basic",
          ttl: 60000,
          limit: 120
        },
        {
          name: "postput",
          ttl: 60000,
          limit: 60
        },
        {
          name: "place",
          ttl: 60000,
          limit: 10,
        },
        {
          name: "login",
          ttl: 60000,
          limit: 3
        }
      ]
    },
    ),
    PrismaModule,
    CommentModule,
    UserModule,
    PlaceModule,
    PhotoModule,
    AuthModule,
  ],
  controllers: [AppController, PlaceController, PhotoController, UserController, CommentController],
  providers: [AppService, PlaceService, PhotoService, UserService, CommentService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule { }