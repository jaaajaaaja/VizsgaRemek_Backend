import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule {}
