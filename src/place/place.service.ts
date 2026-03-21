import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { GetAllByPlaceNewsType, PeriodEnum, PlaceStatisticsType } from 'src/types/place-types';
import { ApprovedByAdmin } from 'src/types/comment-types';
import { news, place, place_category } from 'generated/prisma/client';
import { GetDate } from 'src/functions/place/GetDate';

@Injectable()
export class PlaceService {
    constructor(private prisma: PrismaService) { }


    /*
        ----------------------------------------------------------------------------------------------------------
        place
        ----------------------------------------------------------------------------------------------------------
    */

    async getAll(): Promise<place[]> {
        const places = await this.prisma.place.findMany()

        if (!places) {
            throw new NotFoundException("No places in database!")
        }

        return places
    }

    async getPopular(period: PeriodEnum): Promise<PlaceStatisticsType[]> {
        const places: place[] = await this.prisma.place.findMany()
        const statistics: PlaceStatisticsType[] = []

        const getDate = GetDate(period)

        const startOfMonth: Date = getDate.startOfMonth
        const endOfMonth: Date = getDate.endOfMonth

        function query() {
            return {
                placeID: place.id,
                createdAt: {
                    gte: startOfMonth,
                    lt: endOfMonth
                }
            }
        }

        for (var place of places) {
            const totalComments = await this.prisma.comment.count({
                where: query()
            })

            // console.log("*********************************")
            // console.log(place.id)
            // console.log("comments: ", totalComments)

            const totalPhotos = await this.prisma.photo.count({
                where: query()
            })
            // console.log("photos: ", totalPhotos)

            const averageRating = await this.prisma.comment.aggregate({
                where: query(),
                _avg: {
                    rating: true
                }
            })
            // console.log("rating: ", averageRating._avg.rating)

            statistics.push({
                placeId: place.id,
                placeName: place.name,
                totalComments,
                totalPhotos,
                averageRating: averageRating._avg.rating || 0
            })
        }

        return statistics
    }

    async getOne(id: number): Promise<place> {
        const place = await this.prisma.place.findUnique({ where: { id } })

        if (!place) {
            throw new NotFoundException("Place not found!")
        }

        return place
    }

    async getOneByGoogleplaceID(googleplaceID: string): Promise<place> {
        const place = await this.prisma.place.findUnique({ where: { googleplaceID } })

        if (!place) {
            throw new NotFoundException("Place not found!")
        }

        return place
    }

    async add(data: CreatePlaceDto): Promise<place> {
        return this.prisma.place.create({ data })
    }

    async remove(id: number): Promise<place> {
        const place = await this.prisma.place.findFirst({ where: { id } })

        if (!place) {
            throw new NotFoundException("Place not found!")
        }

        return this.prisma.place.delete({ where: { id } })
    }

    /*
        ----------------------------------------------------------------------------------------------------------
        place CATEGORY
        ----------------------------------------------------------------------------------------------------------
    */

    async addPlaceCategory(data: CreatePlaceCategoryDto, placeID: number): Promise<place_category> {
        try {
            const fullData = {
                category: data.category,
                placeID: placeID
            }

            return this.prisma.place_category.create({ data: fullData })
        } catch (e) {
            throw new ForbiddenException("Place already has this category!")
        }
    }

    /*
        ----------------------------------------------------------------------------------------------------------
        news
        ----------------------------------------------------------------------------------------------------------
    */

    async addNews(placeID: number, data: CreateNewsDto, loggedInUserId: number): Promise<news> {
        if (!loggedInUserId) {
            throw new UnauthorizedException("Log in to post news!")
        }

        const place = await this.prisma.place.findFirst({ where: { id: placeID } })

        if (!place) {
            throw new NotFoundException("Place not found")
        }

        const fullData = {
            text: data.text,
            placeID: placeID,
            userID: loggedInUserId
        }

        return this.prisma.news.create({ data: fullData })
    }

    async updateNews(id: number, body: UpdateNewsDto, loggedInUserId: number): Promise<news> {
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

    async getNews(placeID: number): Promise<GetAllByPlaceNewsType[]> {
        const news = await this.prisma.news.findMany({
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

    async getAllNews(): Promise<GetAllByPlaceNewsType[]> {
        return this.prisma.news.findMany({
            where: { approved: false },
            select: {
                id: true,
                text: true,
                placeID: true,
                userID: true,
                createdAt: true,
                place: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 5
        })
    }

    async approveNews(id: number): Promise<ApprovedByAdmin> {
        const news = await this.prisma.news.findFirst({ where: { id } })

        if (!news) {
            throw new NotFoundException("News not found!")
        }

        const update = await this.prisma.news.update({ where: { id }, data: { approved: true } })

        return { id: update.id, approved: update.approved }
    }

    async removeNews(id: number): Promise<{ id: number, message: string }> {
        const news = await this.prisma.news.findFirst({
            where: { id }
        })

        if (!news) {
            throw new NotFoundException("News not found!")
        }

        await this.prisma.news.delete({
            where: { id }
        })

        return {id, message: " deleted"}
    }
}
