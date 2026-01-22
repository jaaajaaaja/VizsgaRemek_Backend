import { Test, TestingModule } from '@nestjs/testing';
import { PhotoController } from './photo.controller';
import { PrismaService } from 'src/prisma.service';
import { PhotoService } from './photo.service';
import { Photo } from 'generated/prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

describe('PhotoController', () => {
  let controller: PhotoController
  let service: PhotoService

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

  const mockPhotoService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    getAllByUser: jest.fn(),
    getAllByPlace: jest.fn(),
    add: jest.fn(),
    remove: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotoController],
      providers: [
        {
          provide: PhotoService,
          useValue: mockPhotoService
        }
      ]
    }).overrideGuard(AuthGuard)
      .useValue(() => { canActivate: { sub: 1 } })
      .compile()

    controller = module.get<PhotoController>(PhotoController)
    service = module.get<PhotoService>(PhotoService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe("getAll", () => {
    it("should return all photos", async () => {
      mockPhotoService.getAll.mockResolvedValue(mockPhoto)

      const result = await controller.getAll()

      expect(result).toEqual(mockPhoto)
      expect(mockPhotoService.getAll).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOne", () => {
    it("should return a photo by id", async () => {
      mockPhotoService.getOne.mockResolvedValue(mockPhoto[0])

      const result = await controller.getOne(1)

      expect(result).toEqual(mockPhoto[0])
      expect(mockPhotoService.getOne).toHaveBeenCalledWith(1)
      expect(mockPhotoService.getOne).toHaveBeenCalledTimes(1)
    })
  })

  describe("getAllByUser", () => {
    it("should get all photos by userID", async () => {
      mockPhotoService.getAllByUser.mockResolvedValue(mockPhoto)

      const result = await controller.getAllByUser(1)

      expect(result).toEqual(mockPhoto)
      expect(mockPhotoService.getAllByUser).toHaveBeenCalledTimes(1)
      expect(mockPhotoService.getAllByUser).toHaveBeenCalledWith(1)
    })
  })

  describe("getAllByPlace", () => {
    it("should get all photos by placeID", async () => {
      mockPhotoService.getAllByPlace.mockResolvedValue(mockPhoto)

      const result = await controller.getAllByPlace(1)

      expect(result).toEqual(mockPhoto)
      expect(mockPhotoService.getAllByPlace).toHaveBeenCalledTimes(1)
      expect(mockPhotoService.getAllByPlace).toHaveBeenCalledWith(1)
    })
  })

  describe("remove", () => {
    it("should delete a photo by id", async () => {
      mockPhotoService.remove.mockResolvedValue(mockPhoto[0])

      const result = await controller.remove(1, { user: { sub: 1 } } as any)

      expect(result).toEqual(mockPhoto[0])
      expect(mockPhotoService.remove).toHaveBeenCalledTimes(1)
      expect(mockPhotoService.remove).toHaveBeenCalledWith(1, 1)
    })
  })

  it('should upload files and return created photos using shared mock data', async () => {
    const files = [
      { originalname: 'test.png' },
      { originalname: 'test2.png' },
    ] as Express.Multer.File[];

    const body = {
      userID: String(mockUser.id),
      placeID: String(mockPlace.id),
    }

    mockPhotoService.add
      .mockResolvedValueOnce(mockPhoto[0])
      .mockResolvedValueOnce(mockPhoto[1])

    const result = await controller.uploadFile(files, body, { user: { sub: 1 } } as any)

    expect(mockPhotoService.add).toHaveBeenCalledTimes(2)
    expect(mockPhotoService.add).toHaveBeenNthCalledWith(
      1,
      files[0],
      mockUser.id,
      mockPlace.id,
    )
    expect(mockPhotoService.add).toHaveBeenNthCalledWith(
      2,
      files[1],
      mockUser.id,
      mockPlace.id,
    )

    expect(result).toEqual({
      message: 'File uploaded successfully',
      images: mockPhoto,
    });
  });
})