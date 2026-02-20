import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private gateway: EventsGateway,
  ) { }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) {
      throw new NotFoundException("Comment not found!")
    }

    if (!comment.approved) {
      throw new ForbiddenException("This comment is waiting for approval!")
    }

    return comment
  }

  async findAllByUser(userID: number) {
    const comments = await this.prisma.comment.findMany({
      where: { userID: userID, approved: true },
      select: {
        id: true,
        commentText: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        userID: true,
        placeID: true,
      }
    })

    if (comments.length === 0) {
      throw new NotFoundException("User did not post any comments!")
    }

    return comments
  }

  async findAllByPlace(placeID: number) {
    const place = await this.prisma.place.findFirst({ where: { id: placeID } })

    if (!place) {
      throw new ForbiddenException("Place not found!")
    }

    const comments = await this.prisma.comment.findMany({
      where: { placeID: placeID, approved: true },
    })

    if (comments.length === 0) {
      throw new NotFoundException("Place does not have any comments!")
    }

    return comments
  }

  async add(data: CreateCommentDto, loggedInUserId: number) {
    const place = await this.prisma.place.findUnique({ where: { id: data.placeID } })

    if (!place) {
      throw new NotFoundException("Place not found!")
    }

    const fullData = {
      commentText: data.commentText,
      rating: data.rating,
      placeID: data.placeID,
      userID: loggedInUserId
    }

    return this.prisma.comment.create({ data: fullData })
  }

  async remove(id: number, loggedInUser: any) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) {
      throw new NotFoundException("Can not delete comment, not found!")
    }

    if (comment.userID != loggedInUser.sub && loggedInUser.role != "admin") {
      throw new ForbiddenException("You can only delete your own comment!")
    }

    return this.prisma.comment.delete({ where: { id } })
  }

  async update(id: number, data: UpdateCommentDto, loggedInUserId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) {
      throw new NotFoundException("No comment found!")
    }

    if (comment.userID != loggedInUserId) {
      throw new ForbiddenException("You can only edit your own comments!")
    }

    return this.prisma.comment.update({
      where: { id },
      data: {
        ...data,
        approved: false
      }
    })
  }

  async getAll() {
    return this.prisma.comment.findMany()
  }

  async approveByAdmin(id: number) {
    const comment = await this.prisma.comment.findFirst({ where: { id } })

    if (!comment) {
      throw new NotFoundException("Comment not found!")
    }

    const approved = await this.prisma.comment.update({ where: { id }, data: { approved: true } })

    return { id: approved.id, approved: approved.approved }
  }
}
