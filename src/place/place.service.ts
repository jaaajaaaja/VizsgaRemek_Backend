import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class PlaceService {
    constructor(private prisma: PrismaService) { }

    async getAll() {
        const places = await this.prisma.place.findMany()

        if (!places) {
            throw new NotFoundException("No places in database!")
        }

        return places
    }

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
            throw new ForbiddenException("Place already has this category!")
        }
    }

    async addNews(data: CreateNewsDto, loggedInUserId: number) {
        if (!loggedInUserId) {
            throw new UnauthorizedException("Log in to post news!")
        }

        const place = await this.prisma.place.findFirst({ where: { id: data.placeID } })

        if (!place) {
            throw new NotFoundException("Place not found")
        }

        const fullData = {
            text: data.text,
            placeID: data.placeID,
            userID: loggedInUserId
        }

        return this.prisma.news.create({ data: fullData })
    }

    async updateNews(id: number, body: UpdateNewsDto, loggedInUserId: number) {
        const news = await this.prisma.news.findFirst({ where: { id } })

        if (!news) {
            throw new NotFoundException("News not found!")
        }

        if (news.userID != loggedInUserId) {
            throw new ForbiddenException("You can only edit your own news!")
        }

        if (!loggedInUserId) {
            throw new UnauthorizedException("You can not edit this news!")
        }

        const fullData = {
            ...body,
            approved: false
        }

        return this.prisma.news.update({ where: { id }, data: fullData })
    }

    async getNews(placeID: number) {
        const news = await this.prisma.news.findFirst({
            where: { placeID, approved: true },
            select: {
                id: true,
                text: true,
                placeID: true,
                userID: true
            }
        })

        if (!news) {
            throw new NotFoundException("No news available for this place!")
        }

        return news
    }

    async remove(id: number) {
        const place = await this.prisma.place.findFirst({ where: { id } })

        if (!place) {
            throw new NotFoundException("Place not found!")
        }

        return this.prisma.place.delete({ where: { id } })
    }

    async getAllNews() {
        return this.prisma.news.findMany()
    }

    async approveNews(id: number) {
        const news = await this.prisma.news.findFirst({ where: { id } })

        if (!news) {
            throw new NotFoundException("News not found!")
        }

        return this.prisma.news.update({
            where: { id },
            data: { approved: true }
        })
    }
}
