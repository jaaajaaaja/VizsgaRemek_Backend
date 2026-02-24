import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';

@Module({
    imports: [PrismaModule],
    providers: [PhotoService],
    controllers: [PhotoController]
})
export class PhotoModule { }
