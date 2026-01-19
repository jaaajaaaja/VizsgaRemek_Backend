import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany()
    }

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

    async remove(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new NotFoundException("User not found!")
        }

        return this.prisma.user.delete({ where: { id } })
    }

    async update(id: number, data: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new NotFoundException("User not found!")
        }
        
        return this.prisma.user.update({ where: { id }, data })
    }
}
