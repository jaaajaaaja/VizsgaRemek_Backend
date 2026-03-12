import { Prisma } from "generated/prisma/client"

export type GetAllByPlaceNewsType = Prisma.NewsGetPayload<{
    select: {
        id: true
        text: true
        placeID: true
        userID: true
    }
}>

export type GetAllNews = Prisma.NewsGetPayload<{
    select: {
        id: true
        text: true
        placeID: true
        userID: true
        createdAt: true
        place: {
            select: {
                name: true
            }
        }
    }
}>

export type PlaceStatisticsType = {
    placeId: number
    placeName: string
    totalPhotos: number
    totalComments: number
    averageRating: number
}

export enum PeriodEnum {
    TODAY = "today",
    MONTH = "month",
    WEEK = "week",
    YEAR = "year"
}