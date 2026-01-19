import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaceService } from './place.service';
import { NotFoundException } from '@nestjs/common';

describe('PlaceService', () => {
  let service: PlaceService
  let prisma: PrismaService

  const mockPlace = {
    id: 1,
    googleplaceID: "agasgfaeb54353453rerfxf",
    name: "test name",
    address: "test address"
  }

  const mockPlaces = [
    {
      id: 1,
      googleplaceID: "agasgfaeb54353453rerfxf",
      name: "test name",
      address: "test address"
    },
    {
      id: 2,
      googleplaceID: "gasefrgsdzsdg4353",
      name: "test name2",
      address: "test address2"
    }
  ]

  const mockPrismaService = {
    place: {
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
        PlaceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    service = module.get<PlaceService>(PlaceService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  describe("getAll", () => {
    it("should return all places", async () => {
      mockPrismaService.place.findMany.mockResolvedValue(mockPlaces)

      const result = await service.getAll()

      expect(result).toEqual(mockPlaces)
      expect(mockPrismaService.place.findMany).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOne", () => {
    it("should return a place by id", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(mockPlace)

      const result = await service.getOne(1)

      expect(result).toEqual(mockPlace)
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it("should throw NotFoundException when place does not exist", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(null)

      await expect(service.getOne(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })

  describe("add", () => {
    it("should add a place", async () => {
      mockPrismaService.place.create.mockResolvedValue(mockPlace)

      const result = await service.add(mockPlace)

      expect(result).toEqual(mockPlace)
      expect(mockPrismaService.place.create).toHaveBeenCalledWith({ data: mockPlace })
      expect(mockPrismaService.place.create).toHaveBeenCalledTimes(1)
    })
  })

  describe("remove", () => {
    it("should delete a place by id", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(mockPlace)
      mockPrismaService.place.delete.mockResolvedValue(mockPlace)

      const result = await service.remove(1)

      expect(result).toEqual(mockPlace)
      expect(mockPrismaService.place.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it("should throw NotFoundException when place does not exist", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(null)
      mockPrismaService.place.delete.mockResolvedValue(null)

      await expect(service.remove(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.place.delete).toHaveBeenCalledTimes(0)
    })
  })

  describe("update", () => {
    it("should update a place by id", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(mockPlace)
      mockPrismaService.place.update.mockResolvedValue(mockPlace)

      const result = await service.update(1, mockPlace)

      expect(result).toEqual(mockPlace)
      expect(mockPrismaService.place.update).toHaveBeenCalledWith({ where: { id: 1 }, data: mockPlace })
    })

    it("should throw NotFoundException when place does not exist", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(null)
      mockPrismaService.place.update.mockResolvedValue(mockPlace)

      await expect(service.update(1, mockPlace)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.place.update).toHaveBeenCalledTimes(0)
    })
  })
})
