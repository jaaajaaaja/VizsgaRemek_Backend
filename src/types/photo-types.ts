import { Prisma } from "generated/prisma/client";

export type GetOne = {
    id: number
    location: string
    type: string
    userName: string
    placeName: string
}

export type GetAllBy = Prisma.PhotoGetPayload<{
    select: {
        id: true
        location: true
        type: true
        user: {
            select: {
                userName: true
            }
        }
        place: {
            select: {
                name: true
            }
        }
    }
}>

export type FilesArray = {
    location: string
    type: string
    userID: number
    placeID: number
}