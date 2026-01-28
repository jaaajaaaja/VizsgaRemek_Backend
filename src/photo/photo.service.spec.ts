import { Test, TestingModule } from '@nestjs/testing';
import { PhotoService } from './photo.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PhotoService', () => {
  let service: PhotoService
  let prismaService: PrismaService

  const mockUser = {
    id: 1,
    userName: 'test username'
  }

  const mockPlace = {
    id: 1,
    name: 'test place name'
  }

  const mockPhoto = [
    {
      id: 1,
      location: 'uploads/test.png',
      type: 'PNG',
      approved: true,
      userID: mockUser.id,
      placeID: mockPlace.id,
      user: mockUser,
      place: mockPlace
    },
    {
      id: 2,
      location: "uploads/test2.png",
      type: "PNG",
      user: mockUser,
      place: mockPlace
    }
  ]

  const mockPrismaService = {
    photo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    },
    user: {
      findUnique: jest.fn()
    },
    place: {
      findUnique: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ],
    }).compile()

    service = module.get<PhotoService>(PhotoService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  describe("getOne", () => {
    it("should return a photo by id", async () => {
      mockPrismaService.photo.findUnique.mockResolvedValue(mockPhoto[0])

      const result = await service.getOne(1)

      expect(result).toEqual({
        id: 1,
        location: 'uploads/test.png',
        type: 'PNG',
        placeName: 'test place name',
        userName: 'test username',
      })
      expect(mockPrismaService.photo.findUnique).toHaveBeenCalledTimes(1)
    })

    it("should throw NotFoundException when photo does not exist", async () => {
      mockPrismaService.photo.findUnique.mockResolvedValue(null)

      await expect(service.getOne(1)).rejects.toThrow(NotFoundException)      
    })
  })

  describe("getAllByUser", () => {
    it("should return all photo by userID", async () => {
      mockPrismaService.photo.findMany.mockResolvedValue(mockPhoto)

      const result = await service.getAllByUser(1)

      expect(result).toEqual(mockPhoto)
      expect(mockPrismaService.photo.findMany).toHaveBeenCalledWith({
        where: { userID: 1, approved: true },
        select: {
          id: true,
          location: true,
          type: true,
          user: { select: { userName: true } },
          place: { select: { name: true } }
        }
      })
    })

    it("should return error when user does not have any photos", async () => {
      mockPrismaService.photo.findMany.mockResolvedValue(null)

      await expect(service.getAllByUser(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.photo.findMany).toHaveBeenCalledTimes(1)
    })
  })

  describe("getAllByPlace", () => {
    it("should return all photo by placeID", async () => {
      mockPrismaService.photo.findMany.mockResolvedValue(mockPhoto)

      const result = await service.getAllByPlace(2)

      expect(result).toEqual(mockPhoto)
      expect(mockPrismaService.photo.findMany).toHaveBeenCalledWith({
        where: { placeID: 2, approved: true },
        select: {
          id: true,
          location: true,
          type: true,
          user: { select: { userName: true } },
          place: { select: { name: true } }
        }
      })
    })

    it("should throw NotFoundException when place does not have any photos", async () => {
      mockPrismaService.photo.findMany.mockResolvedValue(null)

      await expect(service.getAllByPlace(2)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.photo.findMany).toHaveBeenCalledTimes(1)
    })
  })

  describe("post", () => {
    it('should create a photo', async () => {
      const file = {
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File

      const userID = 1
      const placeID = 2
      const loggedInUserId = 1

      mockPrismaService.photo.create.mockResolvedValue({
        id: 1,
        location: 'uploads/test.jpg',
        type: 'image/jpeg',
        userID: loggedInUserId,
        placeID,
      })

      mockPrismaService.user.findUnique.mockResolvedValue({ id: userID })
      mockPrismaService.place.findUnique.mockResolvedValue({ id: placeID })
      
      const result = await service.add(file, userID, placeID, loggedInUserId)

      expect(mockPrismaService.photo.create).toHaveBeenCalledWith({
        data: {
          location: 'uploads/test.jpg',
          type: 'image/jpeg',
          userID: loggedInUserId,
          placeID,
        },
      })

      expect(result).toEqual(
        expect.objectContaining({
          location: 'uploads/test.jpg',
          type: 'image/jpeg',
        }),
      )
    })
  })

  describe("delete", () => {
    it("should delete a photo by id", async () => {
      mockPrismaService.photo.findUnique.mockResolvedValue(mockPhoto[0])
      mockPrismaService.photo.delete.mockResolvedValue(mockPhoto[0])

      const result = await service.remove(1, 1)

      expect(result).toEqual(mockPhoto[0])
      expect(mockPrismaService.photo.delete).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.photo.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it("should throw NotFoundException when photo with id does not exist", async () => {
      mockPrismaService.photo.findUnique.mockResolvedValue(null)

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.photo.delete).toHaveBeenCalledTimes(0)
    })
  })
})