import { Prisma } from "generated/prisma/client";

export type FindAllByUser = Prisma.commentGetPayload<{
    select: {
        id: true
        commentText: true
        rating: true
        createdAt: true
        updatedAt: true
        userID: true
        placeID: true
    }
}>

export type FindAllByPlace = Prisma.commentGetPayload<{
    select: {
        id: true
        commentText: true
        rating: true
        createdAt: true
        updatedAt: true
        placeID: true
        user: {
            select: {
                id: true
                userName: true
            }
        }
    }
}>

export type ApprovedByAdmin = {
    id: number
    approved: boolean
}