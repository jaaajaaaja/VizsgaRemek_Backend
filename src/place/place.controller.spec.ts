import { Test, TestingModule } from '@nestjs/testing';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';

describe('PlaceController', () => {
  let controller: PlaceController
  let service: PlaceService

  const mockPlace = {
    id: 1,
    googleplaceID: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    name: "test name",
    address: "test address"
  }

  const mockPlaceService = {
    getOne: jest.fn(),
    getOneByGoogleplaceID: jest.fn(),
    addPlaceCategory: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceController],
      providers: [
        {
          provide: PlaceService,
          useValue: mockPlaceService
        }
      ]
    }).overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<PlaceController>(PlaceController)
    service = module.get<PlaceService>(PlaceService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe("getOne", () => {
    it("should return a place by id", async () => {
      mockPlaceService.getOne.mockResolvedValue(mockPlace)

      const result = await controller.getOne(1)

      expect(result).toEqual(mockPlace)
      expect(service.getOne).toHaveBeenCalledWith(1)
    })
  })

  describe("getByGooglePlaceId", () => {
    it("should return a place by googlePlaceID", async () => {
      mockPlaceService.getOneByGoogleplaceID.mockResolvedValue(mockPlace)

      const result = await controller.getOneByGooglePlaceId(mockPlace.googleplaceID)

      expect(result).toEqual(mockPlace)
      expect(service.getOneByGoogleplaceID).toHaveBeenCalledWith(mockPlace.googleplaceID)
    })
  })

  describe("addPlaceCategory", () => {
    it("should add a place category", async () => {
      const category: CreatePlaceCategoryDto = { category: "test" }
      const returnCategory = { category: category, placeID: 1 }

      mockPlaceService.addPlaceCategory.mockResolvedValue(returnCategory)

      const result = await controller.addPlaceCategory(1, "test" as any)

      expect(result).toEqual(returnCategory)
    })
  })
})
