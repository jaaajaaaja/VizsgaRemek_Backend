import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PhotoService {
    constructor(private prisma: PrismaService) { }

    async getOne(id: number) {
        const photo = await this.prisma.photo.findUnique({
            where: { id },
            select: {
                id: true,
                location: true,
                type: true,
                approved: true,
                user: { select: { userName: true } },
                place: { select: { name: true } }
            }
        })

        if (!photo) {
            throw new NotFoundException("Image not found!")
        }

        if (!photo.approved) {
            throw new ForbiddenException("This image is waiting for approval!")
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
            where: { userID: userID, approved: true },
            select: {
                id: true,
                location: true,
                type: true,
                user: { select: { userName: true } },
                place: { select: { name: true } }
            }
        })

        if (!allByUser) {
            throw new NotFoundException("User did not upload any images!")
        }

        return allByUser
    }

    async getAllByPlace(placeID: number) {
        const allByPlace = await this.prisma.photo.findMany({
            where: { placeID: placeID, approved: true },
            select: {
                id: true,
                location: true,
                type: true,
                user: { select: { userName: true } },
                place: { select: { name: true } }
            }
        })

        if (!allByPlace) {
            throw new NotFoundException("Place does not have any images!")
        }

        return allByPlace
    }

    async add(file: Express.Multer.File, userID: number, placeID: number, loggedInUserId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userID }
        })

        if (user?.id != loggedInUserId) {
            throw new UnauthorizedException("You can not post as another user!")
        }

        const place = await this.prisma.place.findUnique({
            where: { id: placeID }
        })

        if (!place) {
            throw new NotFoundException(`Place with ID ${placeID} not found`)
        }


        return await this.prisma.photo.create({
            data: {
                location: `uploads/${file.filename}`,
                type: file.mimetype,
                userID: loggedInUserId,
                placeID: placeID
            }
        })
    }

    async remove(id: number, loggedInUserId: number) {
        const photo = await this.prisma.photo.findUnique({ where: { id } })

        if (!photo) {
            throw new NotFoundException("Image not found!")
        }

        if (photo.userID != loggedInUserId) {
            throw new ForbiddenException("You can only delete your own photos!")
        }

        return this.prisma.photo.delete({ where: { id } })
    }

    async update(id: number) {
        const photo = await this.prisma.photo.findUnique({ where: { id } })

        if (!photo) {
            throw new NotFoundException("Image not found!")
        }

        const data = await this.prisma.photo.update({ where: { id }, data: { approved: true } })

        return { id: data.id, approved: data.approved }
    }

    getAll() {
        return this.prisma.photo.findMany()
    }
}
