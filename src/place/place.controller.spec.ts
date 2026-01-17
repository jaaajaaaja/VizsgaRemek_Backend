import { Test, TestingModule } from '@nestjs/testing';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { UpdatePlaceDto } from './dto/update-place.dto';

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
    getAll: jest.fn(),
    getOne: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    update: jest.fn()
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
    }).compile()

    controller = module.get<PlaceController>(PlaceController)
    service = module.get<PlaceService>(PlaceService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe("getAll", () => {
    it("should return all places", async () => {
      mockPlaceService.getAll.mockResolvedValue(mockPlace)

      const result = await controller.getAll()

      expect(result).toEqual(mockPlace)
      expect(service.getAll).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOne", () => {
    it("should return a place by id", async () => {
      mockPlaceService.getOne.mockResolvedValue(mockPlace)

      const result = await controller.getOne(1)

      expect(result).toEqual(mockPlace)
      expect(service.getOne).toHaveBeenCalledWith(1)
    })

    describe("add", () => {
      it("should create a place", async () => {
        mockPlaceService.add.mockResolvedValue(mockPlace)

        const result = await controller.add(mockPlace)

        expect(result).toEqual(mockPlace)
        expect(service.add).toHaveBeenCalledWith(mockPlace)
      })
    })

    describe("delete", () => {
      it("should delete a place by id", async () => {
        mockPlaceService.remove.mockResolvedValue(mockPlace)

        const result = await controller.remove(1)

        expect(result).toEqual(mockPlace)
        expect(service.remove).toHaveBeenCalledWith(1)
      })
    })

    describe("update", () => {
      it("should update a place by id", async () => {
        const updatePlaceDto:UpdatePlaceDto = {
          googleplaceID: "ChIJN1t_tDeuEmsRUsoyG83frY4",
          name: "test name",
          address: "test address"
        }

        mockPlaceService.update.mockResolvedValue(mockPlace)

        const result = await controller.update(1, updatePlaceDto)

        expect(result).toEqual(mockPlace)
        expect(service.update).toHaveBeenCalledWith(1, updatePlaceDto)
      })
    })
  })
})
