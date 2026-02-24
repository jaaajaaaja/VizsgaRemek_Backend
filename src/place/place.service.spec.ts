import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PlaceService } from './place.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';

describe('PlaceService', () => {
  let service: PlaceService
  let prisma: PrismaService

  const mockPlaces = [
    {
      id: 1,
      googlePlaceID: "agasgfaeb54353453rerfxf",
      name: "test name",
      address: "test address"
    },
    {
      id: 2,
      googlePlaceID: "gasefrgsdzsdg4353",
      name: "test name2",
      address: "test address2"
    }
  ]

  const mockPrismaService = {
    place: {
      // findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      // create: jest.fn(),
      addPlaceCategory: jest.fn(),
      // delete: jest.fn(),
      // update: jest.fn()
    },
    place_Category: {
      create: jest.fn(),
    },
    news: {
      create: jest.fn(),
      findFirst: jest.fn(),
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

  describe("getOne", () => {
    it("should return a place by id", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(mockPlaces[0])

      const result = await service.getOne(1)

      expect(result).toEqual(mockPlaces[0])
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it("should throw NotFoundException when place does not exist", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(null)

      await expect(service.getOne(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })

  describe("getOneByGoogleplaceID", () => {
    it("should return a place by googlePlaceID", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(mockPlaces[0])

      const result = await service.getOneByGoogleplaceID("agasgfaeb54353453rerfxf")

      expect(result).toEqual(mockPlaces[0])
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledWith({ where: { googleplaceID: "agasgfaeb54353453rerfxf" } })
    })

    it("should throw NotFoundException when place does not exist", async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(null)

      await expect(service.getOne(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })

  describe("addPlaceCategory", () => {
    it("should add a place category", async () => {
      const category: CreatePlaceCategoryDto = { category: "test" }
      const returnCategory = { category: category, placeID: 1 }

      mockPrismaService.place_Category.create.mockResolvedValue(returnCategory)

      const result = await service.addPlaceCategory(category, 1)

      expect(result).toEqual(returnCategory)
    })
  })

  describe("addNews", () => {
    it("should create a news post for a place", async () => {
      const newsData = { text: "Great place!", placeID: 1 }
      const createdNews = { id: 1, text: "Great place!", placeID: 1, userID: 1, approved: false }

      mockPrismaService.place.findFirst.mockResolvedValue(mockPlaces[0])
      mockPrismaService.news.create.mockResolvedValue(createdNews)

      const result = await service.addNews(newsData as any, 1)

      expect(result).toEqual(createdNews)
      expect(mockPrismaService.news.create).toHaveBeenCalledWith({
        data: { text: "Great place!", placeID: 1, userID: 1 }
      })
    })

    it("should throw NotFoundException when place does not exist", async () => {
      const newsData = { text: "Great place!", placeID: 999 }

      mockPrismaService.place.findFirst.mockResolvedValue(null)

      await expect(service.addNews(newsData as any, 1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.news.create).not.toHaveBeenCalled()
    })
  })

  describe("updateNews", () => {
    it("should update news text", async () => {
      const newsData = { text: "Updated news!" }
      const existingNews = { id: 1, text: "Old news", placeID: 1, userID: 1, approved: false }

      mockPrismaService.news.findFirst.mockResolvedValue(existingNews)
      mockPrismaService.news.update.mockResolvedValue({
        ...existingNews,
        text: "Updated news!",
        approved: false
      })

      const result = await service.updateNews(1, newsData as any, 1)

      expect(mockPrismaService.news.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { text: "Updated news!", approved: false }
      })
    })

    it("should throw NotFoundException when news does not exist", async () => {
      const newsData = { text: "Updated news!" }

      mockPrismaService.news.findFirst.mockResolvedValue(null)

      await expect(service.updateNews(999, newsData as any, 1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.news.update).not.toHaveBeenCalled()
    })
  })
})
