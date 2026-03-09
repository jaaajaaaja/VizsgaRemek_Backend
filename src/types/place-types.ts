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