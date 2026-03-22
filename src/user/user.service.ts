import {
  ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';
import * as bcrypt from 'bcrypt';
import { AddUserType, FindOne, GetAllUserType, LoggedInUser, PendingFriendRequestType, UserDataType } from 'src/types/user-types';
import { place, user, user_interest } from 'generated/prisma/client';
import chalk from 'chalk';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  /*
    ----------------------------------------------------------------------------------------------------------
    DEFAULT FUNCTIONS
    ----------------------------------------------------------------------------------------------------------
  */

  /**
   * Returns the user for authentication
   * @param email find user by email
   * @returns id, email, password, role
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
      // console.log(chalk.red("\nUser not found!"))
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

  async remove(id: number, loggedInUser: LoggedInUser): Promise<user> {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundException("User not found!")
    }

    if (user.id != loggedInUser.sub && loggedInUser.role != "admin") {
      throw new ForbiddenException("You can only delete your own profile!")
    }

    return this.prisma.user.delete({ where: { id } })
  }

  async update(id: number, data: UpdateUserDto, loggedInUserId: number): Promise<user> {
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

  async deleteUserByAdmin(id: number): Promise<user> {
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
    const interests = await this.prisma.user_interest.findMany({
      where: { userID: loggedInUserId },
    })

    if (interests.length === 0) {
      throw new NotFoundException("User has no interests!")
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
      throw new ForbiddenException("No places found matching your interests!")
    }

    return recommendations
  }

  async recommendByAge(loggedInUserId: number): Promise<place[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: { age: true },
    })

    if (!user) {
      throw new NotFoundException("User not found!")
    }

    if (user.age == null) {
      throw new ConflictException("Please set your age!")
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
      throw new ForbiddenException("Not enough comments to recommend!")
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

    if(user.id == loggedInUserId) {
      throw new ConflictException("You can not send a friend request to yourself!")
    }

    const already_sent = await this.prisma.pending_friend_request.findFirst({
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
      }
    })

    if (already_sent?.userID == loggedInUserId) {
      throw new ConflictException("You already sent this user a friend request!")
    }

    if (already_sent?.friendID == loggedInUserId) {
      throw new ConflictException("You already have a pending friend request from this user!")
    }

    const friend = await this.prisma.user_friend.findFirst({
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
      throw new ForbiddenException("You already have this user as a friend!")
    } else {
      try {
        return this.prisma.pending_friend_request.create({
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
    const request = await this.prisma.pending_friend_request.findFirst({
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
      await this.prisma.user_friend.create({
        data: { userID: request.userID, friendID: request.friendID },
      })
      await this.prisma.pending_friend_request.delete({ where: request })
      return { message: 'Friend request accepted' }
    } else {
      await this.prisma.pending_friend_request.delete({ where: request })
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
    const friends = await this.prisma.user_friend.findMany({
      where: {
        OR: [
          {
            userID: loggedInUserId,
          },
          {
            friendID: loggedInUserId
          }
        ]
      },
      include: {
        friend: {
          select: {
            id: true,
            userName: true
          },
        },
        user: {
          select: {
            id: true,
            userName: true
          }
        }
      },
    })

    if (!friends || friends.length === 0) {
      throw new NotFoundException("You do not have any friends yet!")
    }

    return friends.map((f) => (
      f.user.id == loggedInUserId ? f.friend : f.user
    ))
  }

  async getPendingFriendRequests(loggedInUserId: number): Promise<PendingFriendRequestType[]> {
    if (!loggedInUserId) {
      throw new UnauthorizedException("Log in to see pending friend requests!")
    }

    const pending_request = await this.prisma.pending_friend_request.findMany({
      where: {
        OR: [
          {
            userID: loggedInUserId,
          },
          {
            friendID: loggedInUserId
          }
        ]
      },
      include: {
        friend: {
          select: {
            id: true,
            userName: true
          },
        },
        user: {
          select: {
            id: true,
            userName: true
          }
        }
      },
    })

    if(!pending_request) {
      throw new NotFoundException("You don't have any pending friend requests!")
    }

    return pending_request.map((p) => (
      p.user.id == loggedInUserId ? p.friend : p.user
    ))
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    INTERESTS
    ----------------------------------------------------------------------------------------------------------
  */

  async deleteUserInterest(id: number, loggedInUserId: number): Promise<user_interest> {
    const interest = await this.prisma.user_interest.findFirst({
      where: {
        id: id,
        userID: loggedInUserId
      }
    })

    if (!interest) {
      throw new NotFoundException("Interest not found!")
    }

    const deleteInterest = await this.prisma.user_interest.delete({
      where: { id: interest.id }
    })

    return deleteInterest
  }

  async addUserInterest(
    data: CreateUserInterestDto,
    loggedInUserId: number
  ): Promise<user_interest> {
    try {
      const fullData = {
        interest: data.interest,
        userID: loggedInUserId,
      }

      return this.prisma.user_interest.create({ data: fullData })
    } catch (e) {
      throw new ForbiddenException('You already have this interest!')
    }
  }

  async getAllUserInterestByAdmin(): Promise<user_interest[]> {
    return this.prisma.user_interest.findMany({
      orderBy: {
        userID: "asc"
      }
    })
  }

  async interestList(loggedInUserId: number): Promise<user_interest[]> {
    const interests = await this.prisma.user_interest.findMany({
      where: { userID: loggedInUserId }
    })

    if (!interests) {
      throw new NotFoundException("User has no interests set!")
    }

    return interests
  }
}
