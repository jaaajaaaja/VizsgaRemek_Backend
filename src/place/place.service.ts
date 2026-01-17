import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { CreatePlaceDto } from './dto/create-place.dto';

@Injectable()
export class PlaceService {
    constructor(private prisma: PrismaService) { }

    async getAll() {
        const places = await this.prisma.place.findMany()

        if (places.length === 0) {
            return { error: "Még nincsenek helyek!" }
        }

        return places
    }

    async getOne(id: number) {
        const place = await this.prisma.place.findUnique({ where: { id } })

        if (!place) {
            return { error: "Nincs ilyen hely!" }
        }
        return place
    }

    async add(data: CreatePlaceDto) {
        return this.prisma.place.create({ data })
    }

    async remove(id: number) {
        return this.prisma.place.delete({ where: { id } })
    }

    async update(id: number, data: UpdatePlaceDto) {
        return this.prisma.place.update({ where: { id }, data })
    }
}
