import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

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

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn()
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

  describe("findAll", () => {
    it("should return all users", async () => {
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers)

      const result = await service.findAll()

      expect(result).toEqual(mockUsers)
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1)
    })
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
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data: mockUser })
    })

    it("should throw ConflictException when email already in use", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.user.create.mockResolvedValue(mockUser)

      await expect(service.add(mockUser)).rejects.toThrow(ConflictException)
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(0)
    })
  })

  describe("remove", () => {
    it("should delete a user by id", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.user.delete.mockResolvedValue(mockUser)

      const result = await service.remove(1)

      expect(result).toEqual(mockUser)
      expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it("should throw NotFoundException when user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)
      mockPrismaService.user.delete.mockResolvedValue(mockUser)

      await expect(service.remove(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(0)      
    })
  })

  describe("update", () => {
    it("should update a user by id", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.user.update.mockResolvedValue(mockUser)

      const result = await service.update(1, mockUser)

      expect(result).toEqual(mockUser)
      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: mockUser })
    })

    it("should throw NotFoundException when user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)
      mockPrismaService.user.update.mockResolvedValue(mockUser)

      await expect(service.update(1, mockUser)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(0)      
    })
  })
})
