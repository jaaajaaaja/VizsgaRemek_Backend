import {
  ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';
import * as bcrypt from 'bcrypt';
import { AddUserType, FindOne, GetAllUserType, UserDataType } from 'src/types/user-types';
import { Place, User, User_Interest } from 'generated/prisma/client';
import chalk from 'chalk';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }
  
  /*
    ----------------------------------------------------------------------------------------------------------
    DEFAULT FUNCTIONS
    ----------------------------------------------------------------------------------------------------------
  */

  async findOne(email: string): Promise<FindOne> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true
      },
    })

    if (!user) {
      console.log(chalk.red("\nUser not found!"))
      throw new NotFoundException("User not found")
    }

    return user
  }

  async add(data: CreateUserDto): Promise<AddUserType> {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(data.password, salt)

    const email = data.email
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (user) {
      throw new ConflictException("Email already in use!")
    }

    const add = await this.prisma.user.create({
      data: {
        userName: data.userName,
        email: data.email,
        password: hash,
        age: data.age
      },
    })

    return {
      userName: add.userName,
      email: add.email,
      age: add.age
    }
  }

  async remove(id: number, loggedInUser: any): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundException("User not found!")
    }

    if (user.id != loggedInUser.sub && loggedInUser.role != "admin") {
      throw new ForbiddenException("You can only delete your own profile!")
    }

    return this.prisma.user.delete({ where: { id } })
  }

  async update(id: number, data: UpdateUserDto, loggedInUserId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    if (user.id != loggedInUserId) {
      throw new ForbiddenException('You can only edit your own profile!')
    }

    return this.prisma.user.update({ where: { id }, data })
  }

  async getAllUsers(): Promise<GetAllUserType[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        email: true,
        age: true,
        role: true,
      }
    })
  }

  async deleteUserByAdmin(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } })

    if (!user) {
      throw new NotFoundException("User not found!")
    }

    return this.prisma.user.delete({ where: { id } })
  }


  async getUserData(loggedInUserId: number): Promise<UserDataType> {
    const user = await this.prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: {
        id: true,
        userName: true,
        email: true,
        age: true,
      }
    })

    if (!user) {
      throw new NotFoundException("User not found!")
    }

    return user
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    FRIENDS
    ----------------------------------------------------------------------------------------------------------
  */

  async recommendations(loggedInUserId: number): Promise<{ id: number, name: string }[]> {
    const interests = await this.prisma.user_Interest.findMany({
      where: { userID: loggedInUserId },
    })

    if (interests.length === 0) {
      throw new NotFoundException('User has no interests!')
    }

    const interest = interests.map((i) => i.interest)

    const recommendations = await this.prisma.place.findMany({
      where: {
        placeCategories: {
          some: {
            category: {
              in: interest
            }
          }
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    if (recommendations.length === 0) {
      throw new ForbiddenException('No places found matching your interests!')
    }

    return recommendations
  }

  async recommendByAge(loggedInUserId: number): Promise<Place[]> {
    if (!loggedInUserId) {
      throw new UnauthorizedException('Log in first!')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: { age: true },
    })

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    if (user.age == null) {
      throw new ConflictException('Please set your age!')
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
    })

    if (!places.length) {
      throw new ForbiddenException('Not enough comments to recommend!')
    }

    places.sort((place1, place2) => {
      const diffA = Math.min(
        ...place1.comments.map((comment) =>
          Math.abs(comment.user.age! - user.age!)
        )
      )
      const diffB = Math.min(
        ...place2.comments.map((comment) =>
          Math.abs(comment.user.age! - user.age!)
        )
      )
      return diffA - diffB
    })

    return places.map(({ comments, ...place }) => place)
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    FRIENDS
    ----------------------------------------------------------------------------------------------------------
  */

  async addFriend(
    sentToUserId: number,
    loggedInUserId: number
  ): Promise<{ userID: number, friendID: number }> {
    const user = await this.prisma.user.findFirst({
      where: {
        NOT: {
          role: "admin"
        },
        id: sentToUserId,
      }
    })

    if (!user) {
      throw new NotFoundException("The user you are trying to send the request to does not exist!")
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
    })

    if (friend) {
      throw new ForbiddenException('You already have this user as a friend!')
    } else {
      try {
        return this.prisma.pending_Friend_Request.create({
          data: {
            userID: loggedInUserId,
            friendID: sentToUserId,
          },
        })
      } catch (e) {
        throw new ConflictException('You already sent a request to this user!')
      }
    }
  }

  async dealWithFriendRequest(
    recievedFromUserId: number,
    loggedInUserId: number,
    accepted: boolean,
  ): Promise<{ message: string }> {
    const request = await this.prisma.pending_Friend_Request.findFirst({
      where: {
        userID: recievedFromUserId,
        friendID: loggedInUserId,
      },
    })

    if (!request) {
      throw new NotFoundException(
        'You do not have a pending friend request from this user!',
      )
    }

    if (accepted) {
      await this.prisma.user_Friend.create({ data: request })
      await this.prisma.pending_Friend_Request.delete({ where: request })
      return { message: 'Friend request accepted' }
    } else {
      await this.prisma.pending_Friend_Request.delete({ where: request })
      return { message: 'Friend request rejected!' }
    }
  }

  async searchByUsername(username: string): Promise<{ id: number, userName: string }[]> {
    const users = await this.prisma.user.findMany({
      where: {
        userName: {
          contains: username
        },
        NOT: {
          role: "admin"
        }
      },
      select: {
        id: true,
        userName: true
      }
    })

    if (!users) {
      throw new NotFoundException("User(s) with this name not found!")
    }

    return users
  }

  async friendlist(loggedInUserId: number): Promise<{ id: number, userName: string }[]> {
    if (!loggedInUserId) {
      throw new UnauthorizedException('Log in to see your friendlist!')
    }

    const friends = await this.prisma.user_Friend.findMany({
      where: { userID: loggedInUserId },
      include: {
        friend: {
          select: {
            id: true,
            userName: true
          },
        },
      },
    })

    if (!friends || friends.length === 0) {
      throw new NotFoundException('You do not have any friends yet!')
    }

    return friends.map((f) => f.friend)
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    INTERESTS
    ----------------------------------------------------------------------------------------------------------
  */



  async deleteUserInterest(id: number, loggedInUserId: number): Promise<User_Interest> {
    const interest = await this.prisma.user_Interest.findFirst({
      where: {
        id: id,
        userID: loggedInUserId
      }
    })

    if (!interest) {
      throw new NotFoundException("Interest not found!")
    }

    const deleteInterest = await this.prisma.user_Interest.delete({
      where: { id: interest.id }
    })

    return deleteInterest
  }

  async addUserInterest(
    data: CreateUserInterestDto,
    loggedInUserId: number
  ): Promise<User_Interest> {
    try {
      const fullData = {
        interest: data.interest,
        userID: loggedInUserId,
      }

      return this.prisma.user_Interest.create({ data: fullData })
    } catch (e) {
      throw new ForbiddenException('You already have this interest!')
    }
  }

  async getAllUserInterestByAdmin(): Promise<User_Interest[]> {
    return this.prisma.user_Interest.findMany({
      orderBy: {
        userID: "asc"
      }
    })
  }

  async interestList(loggedInUserId: number): Promise<User_Interest[]> {
    const interests = await this.prisma.user_Interest.findMany({
      where: { userID: loggedInUserId }
    })

    if (!interests) {
      throw new NotFoundException("User has no interests set!")
    }

    return interests
  }
}
