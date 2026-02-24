import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';

@Module({
    imports: [PrismaModule],
    providers: [PlaceService],
    controllers: [PlaceController]
})
export class PlaceModule {}
