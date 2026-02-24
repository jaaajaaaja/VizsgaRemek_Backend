import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService
  let prisma: PrismaService

  const mockUser = {
    id: 1,
    userName: "testUsername",
    email: "test@test.com",
    password: "password"
  }

  const mockUsers = [
    {
      id: 1,
      userName: "testUsername",
      email: "test@test.com",
      password: "password"
    }
  ]

  const friendUser = {
    id: 2,
    userName: "testUsername",
    email: "test@test.com",
    password: "password"
  }

  const mockInterests = [
    {
      id: 1,
      interest: "kocsma",
      userID: 1
    },
    {
      id: 2,
      interest: "bulihely",
      userID: 1
    }
  ]

  const mockRecommendedPlaces = [
    {
      id: 1,
      category: "kocsma",
      placeID: 1
    },
    {
      id: 2,
      category: "bulihely",
      placeID: 2
    }
  ]

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    place_Category: {
      findMany: jest.fn(),
    },
    user_Interest: {
      findMany: jest.fn(),
      create: jest.fn()
    },
    user_Friend: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn()
    },
    pending_Friend_Request: {
      create: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
    place: {
      findMany: jest.fn(),
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe("findOne", () => {
    it("should return a user by email", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.findOne("test@test.com")

      expect(result).toEqual(mockUser)
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@test.com" } })
    })

    it("should throw NotFoundException when email not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.findOne("test@test.com")).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@test.com" } })
    })
  })

  describe("add", () => {
    it("should add a user", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)
      mockPrismaService.user.create.mockResolvedValue(mockUser)

      const result = await service.add(mockUser)

      expect(result).toEqual(mockUser)
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1)
    })

    it("should throw ConflictException when email already in use", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.user.create.mockResolvedValue(mockUser)

      await expect(service.add(mockUser)).rejects.toThrow(ConflictException)
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(0)
    })
  })

  describe("add user interest", () => {
    it("should create a user interest", async () => {
      const interest = { interest: "bar", userID: mockUser[0] }

      mockPrismaService.user_Interest.create.mockResolvedValue(interest)

      const result = await service.addUserInterest(("bar" as any), mockUser.id)

      expect(result).toEqual(interest)
    })
  })

  describe("remove", () => {
    it("should delete a user by id", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.user.delete.mockResolvedValue(mockUser)

      const result = await service.remove(1, 1)

      expect(result).toEqual(mockUser)
      expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it("should throw NotFoundException when user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)
      mockPrismaService.user.delete.mockResolvedValue(mockUser)

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(0)
    })
  })

  describe("update", () => {
    it("should update a user by id", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.user.update.mockResolvedValue(mockUser)

      const result = await service.update(1, mockUser, 1)

      expect(result).toEqual(mockUser)
      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: mockUser })
    })

    it("should throw NotFoundException when user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)
      mockPrismaService.user.update.mockResolvedValue(mockUser)

      await expect(service.update(1, mockUser, 1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(0)
    })
  })

  describe("recommendations", () => {
    it("should return recommended places", async () => {
      mockPrismaService.user_Interest.findMany.mockResolvedValue(mockInterests)
      mockPrismaService.place_Category.findMany.mockResolvedValue(mockRecommendedPlaces)

      const result = await service.recommendations(1)

      expect(result).toEqual(mockRecommendedPlaces)
      expect(mockPrismaService.user_Interest.findMany).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.user_Interest.findMany).toHaveBeenCalledWith({
        where: { id: 1 }
      })
      expect(mockPrismaService.place_Category.findMany).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.place_Category.findMany).toHaveBeenCalledWith({
        where: { category: { in: ["kocsma", "bulihely"] } }
      })
    })

    it("should throw NotFoundException when user has no interests", async () => {
      mockPrismaService.user_Interest.findMany.mockResolvedValue([])

      await expect(service.recommendations(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.place_Category.findMany).toHaveBeenCalledTimes(0)
    })

    it("should throw NotFoundException when no places match user interests", async () => {
      mockPrismaService.user_Interest.findMany.mockResolvedValue(mockInterests)
      mockPrismaService.place_Category.findMany.mockResolvedValue([])

      await expect(service.recommendations(1)).rejects.toThrow(ForbiddenException)
      expect(mockPrismaService.user_Interest.findMany).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.place_Category.findMany).toHaveBeenCalledTimes(1)
    })
  })

  describe("addFriend", () => {
    it("should create a pending friend request", async () => {
      const mockRequest = { userID: 1, friendID: 2 }
      mockPrismaService.user.findFirst.mockResolvedValue(2)
      mockPrismaService.pending_Friend_Request.create.mockResolvedValue(mockRequest)

      const result = await service.addFriend(2, 1)

      expect(result).toEqual(mockRequest)
      expect(mockPrismaService.pending_Friend_Request.create).toHaveBeenCalledWith({
        data: { userID: 1, friendID: 2 }
      })
    })

    it("should throw ConflictException if request already exists", async () => {
      mockPrismaService.pending_Friend_Request.create.mockRejectedValueOnce(new NotFoundException("You already sent a request to this user!"))

      await expect(service.addFriend(2, 1)).rejects.toThrow(NotFoundException)
    })
  })

  describe("dealWithFriendRequest", () => {
    it("should accept friend request and create friendship", async () => {
      const mockRequest = { id: 1, userID: 2, friendID: 1 }
      mockPrismaService.pending_Friend_Request.findFirst.mockResolvedValue(mockRequest)
      mockPrismaService.user_Friend.create.mockResolvedValue({ id: 1, userID: 2, friendID: 1 })
      mockPrismaService.pending_Friend_Request.delete.mockResolvedValue(mockRequest)

      await service.dealWithFriendRequest(2, 1, true)

      expect(mockPrismaService.pending_Friend_Request.findFirst).toHaveBeenCalledWith({
        where: { userID: 2, friendID: 1 }
      })
      expect(mockPrismaService.user_Friend.create).toHaveBeenCalledWith({ data: mockRequest })
      expect(mockPrismaService.pending_Friend_Request.delete).toHaveBeenCalledWith({ where: mockRequest })
    })

    it("should reject friend request and delete it", async () => {
      const mockRequest = { id: 1, userID: 2, friendID: 1 }
      mockPrismaService.pending_Friend_Request.findFirst.mockResolvedValue(mockRequest)
      mockPrismaService.pending_Friend_Request.delete.mockResolvedValue(mockRequest)

      const result = await service.dealWithFriendRequest(2, 1, false)

      expect(result).toEqual({ message: "Friend request rejected!" })
      expect(mockPrismaService.user_Friend.create).not.toHaveBeenCalled()
      expect(mockPrismaService.pending_Friend_Request.delete).toHaveBeenCalledWith({ where: mockRequest })
    })
  })

  describe("searchByUsername", () => {
    it("should return users matching the username", async () => {
      const searchResult = [
        { id: 1, userName: "testUsername" },
        { id: 2, userName: "testUsername" }
      ]

      mockPrismaService.user.findMany.mockResolvedValue(searchResult)

      const result = await service.searchByUsername("testUsername")

      expect(result).toEqual(searchResult)
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { userName: "testUsername" },
        select: { id: true, userName: true }
      })
    })

    it("should return empty array when no users found", async () => {
      mockPrismaService.user.findMany.mockResolvedValue([])

      const result = await service.searchByUsername("notfound")

      expect(result).toEqual([])
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1)
    })
  })

  describe("friendlist", () => {
    it("should return list of friends with id and userName", async () => {
      const friendsData = [
        { friendID: 2, friend: { id: 2, userName: "friend1" } },
        { friendID: 3, friend: { id: 3, userName: "friend2" } }
      ]

      mockPrismaService.user_Friend.findMany.mockResolvedValue(friendsData)

      const result = await service.friendlist(1)

      expect(result).toEqual([
        { id: 2, userName: "friend1" },
        { id: 3, userName: "friend2" }
      ])
      expect(mockPrismaService.user_Friend.findMany).toHaveBeenCalledWith({
        where: { userID: 1 },
        include: {
          friend: {
            select: { id: true, userName: true }
          }
        }
      })
    })

    it("should throw NotFoundException when user has no friends", async () => {
      mockPrismaService.user_Friend.findMany.mockResolvedValue([])

      await expect(service.friendlist(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.user_Friend.findMany).toHaveBeenCalledTimes(1)
    })
  })
})
