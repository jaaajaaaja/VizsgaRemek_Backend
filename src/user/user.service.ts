import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        return user
    }

    async add(data: CreateUserDto) {
        const email = data.email
        const user = await this.prisma.user.findUnique({ where: { email } })

        if (user) {
            throw new ConflictException("Email already in use!")
        }

        return this.prisma.user.create({ data })
    }

    async remove(id: number, loggedInUserId: number) {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new NotFoundException("User not found!")
        }

        if (user.id != loggedInUserId) {
            throw new NotFoundException("You can only delete your own profile!")
        }

        return this.prisma.user.delete({ where: { id } })
    }

    async update(id: number, data: UpdateUserDto, loggedInUserId: number) {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new NotFoundException("User not found!")
        }

        if (user.id != loggedInUserId) {
            throw new NotFoundException("You can only edit your own profile!")
        }

        return this.prisma.user.update({ where: { id }, data })
    }

    async recommendations(loggedInUserId: number) {
        const interests = await this.prisma.user_Interest.findMany({ where: { id: loggedInUserId } })

        if (interests.length === 0 || !interests) {
            throw new NotFoundException("User has no interests!")
        }

        const interest = interests.map(i => i.interest)

        const recommendations = await this.prisma.place_Category.findMany({
            where: { category: { in: interest } },
            // include: {
            //     placeCategories: true,
            //     comments: true
            // }
        })

        if (recommendations.length === 0) {
            throw new NotFoundException("No places found matching your interests!")
        }

        return recommendations
    }
}
