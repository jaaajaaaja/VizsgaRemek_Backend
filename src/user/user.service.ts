import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        userName: true,
        email: true,
        password: true,
        age: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async add(data: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    const email = data.email;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new ConflictException('Email already in use!');
    }

    return this.prisma.user.create({
      data: {
        userName: data.userName,
        email: data.email,
        password: hash,
        age: data.age
      },
    });
  }

  async addUserInterest(data: CreateUserInterestDto, loggedInUserId: number) {
    try {
      const fullData = {
        interest: data.interest,
        userID: loggedInUserId,
      };

      return this.prisma.user_Interest.create({ data: fullData });
    } catch (e) {
      throw new ForbiddenException('You already have this interest!');
    }
  }

  async remove(id: number, loggedInUserId: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (user.id != loggedInUserId) {
      throw new ForbiddenException('You can only delete your own profile!');
    }

    return this.prisma.user.delete({ where: { id } });
  }

  async update(id: number, data: UpdateUserDto, loggedInUserId: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (user.id != loggedInUserId) {
      throw new ForbiddenException('You can only edit your own profile!');
    }

    return this.prisma.user.update({ where: { id }, data });
  }

  async recommendations(loggedInUserId: number) {
    const interests = await this.prisma.user_Interest.findMany({
      where: { id: loggedInUserId },
    });

    if (interests.length === 0 || !interests) {
      throw new NotFoundException('User has no interests!');
    }

    const interest = interests.map((i) => i.interest);

    const recommendations = await this.prisma.place_Category.findMany({
      where: { category: { in: interest } },
    });

    if (recommendations.length === 0) {
      throw new ForbiddenException('No places found matching your interests!');
    }

    return recommendations;
  }

  async recommendByAge(loggedInUserId: number) {
    if (!loggedInUserId) {
      throw new UnauthorizedException('Log in first!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: { age: true },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (user.age == null) {
      throw new ConflictException('Please set your age!');
    }

    const places = await this.prisma.place.findMany({
      where: {
        comments: {
          some: {
            userID: { not: loggedInUserId },
            user: { age: { not: null } },
          },
        },
      },
      include: {
        comments: {
          where: {
            userID: { not: loggedInUserId },
            user: { age: { not: null } },
          },
          select: {
            user: { select: { age: true } },
          },
        },
      },
      take: 5,
    });

    if (!places.length) {
      throw new ForbiddenException('Not enough comments to recommend!');
    }

    places.sort((place1, place2) => {
      const diffA = Math.min(
        ...place1.comments.map((comment) =>
          Math.abs(comment.user.age! - user.age!),
        ),
      );
      const diffB = Math.min(
        ...place2.comments.map((comment) =>
          Math.abs(comment.user.age! - user.age!),
        ),
      );
      return diffA - diffB;
    });

    return places.map(({ comments, ...place }) => place);
  }

  async addFriend(sentToUserId: number, loggedInUserId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: sentToUserId },
    });

    if (!user) {
      throw new NotFoundException(
        'The user you are trying to send the request to does not exist!',
      );
    }

    const friend = await this.prisma.user_Friend.findFirst({
      where: {
        OR: [
          {
            userID: loggedInUserId,
            friendID: sentToUserId,
          },
          {
            friendID: loggedInUserId,
            userID: sentToUserId,
          },
        ],
      },
    });

    if (friend) {
      throw new ForbiddenException('You already have this user as a friend!');
    } else {
      try {
        return this.prisma.pending_Friend_Request.create({
          data: {
            userID: loggedInUserId,
            friendID: sentToUserId,
          },
        });
      } catch (e) {
        throw new ConflictException('You already sent a request to this user!');
      }
    }
  }

  async dealWithFriendRequest(
    recievedFromUserId: number,
    loggedInUserId: number,
    accepted: boolean,
  ) {
    const request = await this.prisma.pending_Friend_Request.findFirst({
      where: {
        userID: recievedFromUserId,
        friendID: loggedInUserId,
      },
    });

    if (!request) {
      throw new NotFoundException(
        'You do not have a pending friend request from this user!',
      );
    }

    if (accepted) {
      await this.prisma.user_Friend.create({ data: request });
      await this.prisma.pending_Friend_Request.delete({ where: request });
      return { message: 'Friend request accepted' };
    }

    if (!accepted) {
      await this.prisma.pending_Friend_Request.delete({ where: request });
      return { message: 'Friend request rejected!' };
    }
  }

  async searchByUsername(username: string) {
    return this.prisma.user.findMany({
      where: { userName: username },
      select: { id: true, userName: true },
    });
  }

  async friendlist(loggedInUserId: number) {
    if (!loggedInUserId) {
      throw new UnauthorizedException('Log in to see your friendlist!');
    }

    const friends = await this.prisma.user_Friend.findMany({
      where: { userID: loggedInUserId },
      include: {
        friend: {
          select: { id: true, userName: true },
        },
      },
    });

    if (!friends || friends.length === 0) {
      throw new NotFoundException('You do not have any friends yet!');
    }

    return friends.map((f) => f.friend);
  }

  async getUserData(loggedInUserId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: {
        id: true,
        userName: true,
        email: true,
        age: true,
      }
    })

    return user
  }
}
