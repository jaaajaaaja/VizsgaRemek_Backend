import { Prisma } from "generated/prisma/client";
import { Request } from 'express';

export type FindOne = Prisma.userGetPayload<{
    select: {
        id: true
        email: true
        password: true
        role: true
    }
}>

export type UserDataType = Prisma.userGetPayload<{
    select: {
        id: true
        userName: true
        email: true
        age: true
    }
}>

export type GetAllUserType = Prisma.userGetPayload<{
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

export type LoggedInUser = {
    sub: number
    email: string
    password?: string
    role: string
}

export interface AuthenticatedRequest extends Request {
    user: LoggedInUser
}

export type PendingFriendRequestType = {
    id: number
    userID: number
    userName: string
}