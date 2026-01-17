import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';

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

    it("should return error when email already in use", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.add(mockUser)

      expect(result).toEqual({ error: "Ez az email már használatban van!" })
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(0)
    })
  })

  describe("remove", () => {
    it("should delete a user by id", async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockUser)

      const result = await service.remove(1)

      expect(result).toEqual(mockUser)
      expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })

  describe("update", () => {
    it("should update a user by id", async () => {
      mockPrismaService.user.update.mockResolvedValue(mockUser)

      const result = await service.update(1, mockUser)

      expect(result).toEqual(mockUser)
      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: mockUser })
    })
  })
})
