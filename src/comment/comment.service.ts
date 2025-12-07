import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const comments = await this.prisma.comment.findMany();

    if (comments.length === 0) {
      return { error: 'Még nincsenek kommentek' };
    }

    return comments;
  }

  async findOne(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async findAllByUser(userID: number) {
    const comments = await this.prisma.comment.findMany({ where: { userID } });

    if (comments.length === 0) {
      return { message: 'Még nincsenek kommentek' };
    } else {
      return comments;
    }
  }

  /*async findOneByUser(userID:number) {
        const comments = await this.prisma.comment.findUnique({ where: {userID} })
    }*/

  async findAllByPlace(placeID: number) {
    const comments = await this.prisma.comment.findMany({
      where: { placeID: placeID },
    });

    if (comments.length === 0) {
      return { message: 'A helyhez még nincsenek kommentek' };
    } else {
      return comments;
    }
  }

  async add(data: CreateCommentDto) {
    return this.prisma.comment.create({ data });
  }

  async remove(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }

  async update(id: number, data: UpdateCommentDto) {
    return this.prisma.comment.update({ where: { id }, data });
  }
  async findAllByGooglePlace(googlePlaceID: string) {
    // Először megkeressük a place-t a googlePlaceID alapján
    const place = await this.prisma.place.findFirst({
      where: { googleplaceID: googlePlaceID },
    });

    if (!place) {
      return []; // Ha nincs ilyen hely, üres tömb
    }

    // Visszaadjuk a kommenteket
    return this.prisma.comment.findMany({
      where: { placeID: place.id },
      include: {
        user: { select: { userName: true } },
      },
    });
  }
}
