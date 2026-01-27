import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';

@Injectable()
export class PlaceService {
    constructor(private prisma: PrismaService) { }

    // async getAll() {
    //     const places = await this.prisma.place.findMany()

    //     return places
    // }

    async getOne(id: number) {
        const place = await this.prisma.place.findUnique({ where: { id } })

        if (!place) {
            throw new NotFoundException("Place not found!")
        }

        return place
    }

    async getOneByGoogleplaceID(googleplaceID: string) {
        const place = await this.prisma.place.findUnique({ where: { googleplaceID } })

        if (!place) {
            throw new NotFoundException("Place not found!")
        }

        return place
    }

    async add(data: CreatePlaceDto) {
        return this.prisma.place.create({ data })
    }

    async addPlaceCategory(data: CreatePlaceCategoryDto, placeID: number) {
        try {
            const fullData = {
                category: data.category,
                placeID: placeID
            }

            return this.prisma.place_Category.create({ data: fullData })
        } catch (e) {
            throw new ForbiddenException("Place already has this category")
        }
    }

    // async remove(id: number) {
    //     const place = await this.prisma.place.findUnique({ where: { id } })

    //     if (!place) {
    //         throw new NotFoundException("Place not found!")
    //     }

    //     return this.prisma.place.delete({ where: { id } })
    // }

    // async update(id: number, data: UpdatePlaceDto) {
    //     const place = await this.prisma.place.findUnique({ where: { id } })

    //     if (!place) {
    //         throw new NotFoundException("Place not found!")
    //     }

    //     return this.prisma.place.update({ where: { id }, data })
    // }
}
