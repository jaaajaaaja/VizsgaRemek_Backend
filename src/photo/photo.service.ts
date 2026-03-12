import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesArray, GetAllBy, GetOne } from 'src/types/photo-types';
import { ApprovedByAdmin } from 'src/types/comment-types';
import { Photo, Prisma } from 'generated/prisma/client';

@Injectable()
export class PhotoService {
    constructor(private prisma: PrismaService) { }

    async getOne(id: number): Promise<GetOne> {
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

    async getAllByUser(userID: number): Promise<GetAllBy[]> {
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

    async getAllByPlace(placeID: number): Promise<GetAllBy[]> {
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

    async add(
        files: Express.Multer.File[],
        placeID: number,
        loggedInUserId: number
    ): Promise<Prisma.BatchPayload> {
        const user = await this.prisma.user.findUnique({
            where: { id: loggedInUserId }
        })

        if(!user) {
            throw new ConflictException("User does not exist!")
        }

        const place = await this.prisma.place.findUnique({
            where: { id: placeID }
        })

        if (!place) {
            throw new NotFoundException(`Place with ID ${placeID} not found`)
        }

        const fileArray = Array.isArray(files) ? files : [files]

        const images: FilesArray[] = []

        for (const file of fileArray) {
            images.push({
                location: `uploads/${file.filename}`,
                type: file.mimetype,
                userID: loggedInUserId,
                placeID: placeID
            })
        }

        const data = await this.prisma.photo.createMany({
            data: images
        })

        return data
    }

    async remove(id: number, loggedInUserId: number): Promise<Photo> {
        const photo = await this.prisma.photo.findUnique({ where: { id } })

        if (!photo) {
            throw new NotFoundException("Image not found!")
        }

        if (photo.userID != loggedInUserId) {
            throw new ForbiddenException("You can only delete your own photos!")
        }

        return this.prisma.photo.delete({ where: { id } })
    }

    async update(id: number): Promise<ApprovedByAdmin> {
        const photo = await this.prisma.photo.findUnique({ where: { id } })

        if (!photo) {
            throw new NotFoundException("Image not found!")
        }

        const data = await this.prisma.photo.update({ where: { id }, data: { approved: true } })

        return { id: data.id, approved: data.approved }
    }

    getAll(): Promise<Photo[]> {
        return this.prisma.photo.findMany({
            where: { approved: false }
        })
    }
}
