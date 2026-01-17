import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotoService {
    constructor(private prisma: PrismaService) { }

    async getAll() {
        return this.prisma.photo.findMany()
    }

    async getOne(id: number) {
        const photo = await this.prisma.photo.findUnique({
            where: { id },
            select: {
                id: true,
                location: true,
                type: true,
                user: { select: { userName: true } },
                place: { select: { name: true } }
            }
        })

        if (!photo) {
            return { error: "Nincs ilyen fotó" }
        }

        return {
            id: photo.id,
            location: photo.location,
            type: photo.type,
            userName: photo.user.userName,
            placeName: photo.place.name
        }
    }

    async getAllByUser(userID: number) {
        const allByUser = await this.prisma.photo.findMany({
            where: { userID: userID },
            select: {
                id: true,
                location: true,
                type: true,
                user: { select: { userName: true } },
                place: { select: { name: true } }
            }
        })

        if (!allByUser) {
            return { error: "A felhasználó még nem töltött fel képet!" }
        }

        return allByUser
    }

    async getAllByPlace(placeID: number) {
        const allByPlace = await this.prisma.photo.findMany({
            where: { placeID: placeID },
            select: {
                id: true,
                location: true,
                type: true,
                user: { select: { userName: true } },
                place: { select: { name: true } }
            }
        })

        if(!allByPlace) {
            return {error: "A helyhez még nincsenek fotók feltöltve!"}
        }

        return allByPlace
    }

    async add(file: Express.Multer.File, userID: number, placeID: number) {
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}`

        return this.prisma.photo.create({
            data: {
                location: `/uploads/${file.filename}`,
                type: file.mimetype,
                userID: userID,
                placeID: placeID,
            },
        })
    }

    async remove(id: number) {
        return this.prisma.photo.delete({ where: { id } })
    }
}
