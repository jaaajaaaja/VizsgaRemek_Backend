import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    const comments = await this.prisma.comment.findMany()

    return comments
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) {
      throw new NotFoundException()
    }

    return comment
  }

  async findAllByUser(userID: number) {
    const comments = await this.prisma.comment.findMany({ where: { userID } })

    if (comments.length === 0) {
      throw new NotFoundException("User did not post any comments!")
    }

    return comments
  }

  async findAllByPlace(placeID: number) {
    const comments = await this.prisma.comment.findMany({
      where: { placeID: placeID },
    })

    if (comments.length === 0) {
      throw new NotFoundException("Place does not have any comments!")
    }

    return comments
  }

  async add(data: CreateCommentDto) {
    return this.prisma.comment.create({ data })
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) {
      throw new NotFoundException("Can not delete comment, not found!")
    }

    if(comment.userID !== userId) {
      throw new ForbiddenException("You can only delete your own comment!")
    }

    return this.prisma.comment.delete({ where: { id } })
  }

  async update(id: number, data: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) {
      throw new NotFoundException("No comment found!")
    }

    return this.prisma.comment.update({ where: { id }, data })
  }

  async findAllByGooglePlace(googlePlaceID: string) {
    const place = await this.prisma.place.findFirst({ where: { googleplaceID: googlePlaceID } })

    if (!place) {
      throw new NotFoundException("Place not found!")
    }

    return this.prisma.comment.findMany({
      where: { placeID: place.id },
      include: {
        user: { select: { userName: true } },
      },
    })
  }
}
