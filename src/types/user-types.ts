import { Prisma } from "generated/prisma/client";

export type FindOne = Prisma.UserGetPayload<{
    select: {
        id: true
        email: true
        password: true
        role: true
    }
}>

export type UserDataType = Prisma.UserGetPayload<{
    select: {
        id: true
        userName: true
        email: true
        age: true
    }
}>

export type GetAllUserType = Prisma.UserGetPayload<{
    select: {
        id: true
        userName: true
        email: true
        age: true
        role: true
    }
}>

export type AddUserType = {
    userName: string
    email: string
    age?: number | null
}