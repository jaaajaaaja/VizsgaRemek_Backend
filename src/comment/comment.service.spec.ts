import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

describe('CommentService', () => {
  let service: CommentService
  let prismaService: PrismaService

  const mockComment = {
    id: 1,
    commentText: 'Great place!',
    rating: 5,
    userID: 1,
    placeID: 1,
    approved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockComments = [
    {
      id: 1,
      commentText: 'Great place!',
      rating: 5,
      userID: 1,
      placeID: 1,
      approved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      commentText: 'Nice location',
      rating: 4,
      userID: 2,
      placeID: 1,
      approved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockPlace = {
    id: 1,
    googleplaceID: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    name: 'Test Place',
    address: 'Test Address',
  }

  const mockPrismaService = {
    comment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    place: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      add: jest.fn(),
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    })
      .overrideProvider(AuthGuard)
      .useValue(() => { { 1 } })
      .compile()

    service = module.get<CommentService>(CommentService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // describe('findAll', () => {
  //   it('should return all comments when comments exist', async () => {
  //     mockPrismaService.comment.findMany.mockResolvedValue(mockComments)

  //     const result = await service.findAll()

  //     expect(result).toEqual(mockComments)
  //     expect(mockPrismaService.comment.findMany).toHaveBeenCalledTimes(1)
  //   })
  // })

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment)

      const result = await service.findOne(1)

      expect(result).toEqual(mockComment)
      expect(mockPrismaService.comment.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should throw NotFoundException when comment does not exist', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null)

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      })
    })

    it('should return approval message when comment is not approved', async () => {
      const unapprovedComment = { ...mockComment, approved: false }
      mockPrismaService.comment.findUnique.mockResolvedValue(unapprovedComment)

      const result = await service.findOne(1)

      expect(result).toBe("This comment is waiting for approval!")
      expect(mockPrismaService.comment.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })

  describe('findAllByUser', () => {
    it('should return comments for a specific user', async () => {
      mockPrismaService.comment.findMany.mockResolvedValue([mockComment])

      const result = await service.findAllByUser(1)

      expect(result).toEqual([mockComment])
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        where: { id: 1, approved: true },
      })
    })

    it('should throw NotFoundException when user has no comments', async () => {
      mockPrismaService.comment.findMany.mockResolvedValue([])

      await expect(service.findAllByUser(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        where: { id: 1, approved: true },
      })
    })
  })

  describe('findAllByPlace', () => {
    it('should return comments for a specific place', async () => {
      mockPrismaService.comment.findMany.mockResolvedValue([mockComment])

      const result = await service.findAllByPlace(1)

      expect(result).toEqual([mockComment])
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        where: { placeID: 1, approved: true },
      })
    })

    it('should throw NotFoundException when place has no comments', async () => {
      mockPrismaService.comment.findMany.mockResolvedValue([])

      await expect(service.findAllByPlace(1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        where: { placeID: 1, approved: true },
      })
    })
  })

  describe('add', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = {
        commentText: 'Amazing place!',
        rating: 5,
        placeID: 1,
      }

      const mockCreatedComment = {
        id: 1,
        ...createCommentDto,
        userID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const createPlace = {
        id: 1,
        googleplaceID: "id",
        name: "name",
        address: "address"
      }

      mockPrismaService.place.findUnique.mockResolvedValue(createPlace)
      mockPrismaService.comment.create.mockResolvedValue(mockCreatedComment)

      const result = await service.add(createCommentDto, 1)

      expect(result).toEqual(mockCreatedComment)
      expect(mockPrismaService.place.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      })
      expect(mockPrismaService.comment.create).toHaveBeenCalledWith({
        data: { ...createCommentDto, userID: 1 }
      })
    })
  })

  describe('remove', () => {
    it('should delete a comment by id', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment)
      mockPrismaService.comment.delete.mockResolvedValue(mockComment)

      const result = await service.remove(1, 1)

      expect(result).toEqual(mockComment)
      expect(mockPrismaService.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(mockPrismaService.comment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })

    it("should throw NotFoundException when comment does not exits", async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null)

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException)
      expect(mockPrismaService.comment.delete).toHaveBeenCalledTimes(0)
    })
  })

  describe('update', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        commentText: 'Updated comment text',
        rating: 4,
      }

      const existingComment = {
        id: 1,
        commentText: 'Old text',
        rating: 5,
        userID: 1,
        placeID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockUpdatedComment = {
        ...existingComment,
        ...updateCommentDto,
      }

      mockPrismaService.comment.findUnique.mockResolvedValue(existingComment)
      mockPrismaService.comment.update.mockResolvedValue(mockUpdatedComment)

      const result = await service.update(1, updateCommentDto, 1)

      expect(result).toEqual(mockUpdatedComment)
      expect(mockPrismaService.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...updateCommentDto, approved: false },
      })
    })

    it('should update only commentText when rating is not provided', async () => {
      const updateCommentDto: UpdateCommentDto = {
        commentText: 'Updated comment text',
      }

      const existingComment = {
        id: 1,
        rating: 5,
        userID: 1,
        placeID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockUpdatedComment = {
        ...updateCommentDto,
        ...existingComment
      }

      mockPrismaService.comment.update.mockResolvedValue(mockUpdatedComment)

      const result = await service.update(1, updateCommentDto, 1)

      expect(result).toEqual(mockUpdatedComment)
      expect(mockPrismaService.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { approved: false, commentText: 'Updated comment text' },

      })
    })
  })
})