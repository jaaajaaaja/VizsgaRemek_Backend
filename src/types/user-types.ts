import { Prisma } from "generated/prisma/client";
import { Request } from 'express';

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

export type LoggedInUser = {
    sub: number
    email: string
    password?: string
    role: string
}

export interface AuthenticatedRequest extends Request {
    user: LoggedInUser
}