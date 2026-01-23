import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

describe('CommentController', () => {
  let controller: CommentController
  let service: CommentService

  const mockComment = {
    id: 1,
    commentText: 'Great place!',
    rating: 5,
    userID: 1,
    placeID: 1,
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockCommentService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findAllByUser: jest.fn(),
    findAllByPlace: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    findAllByGooglePlace: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue(() => { canActivate: { sub: 1 } })
      .compile()

    controller = module.get<CommentController>(CommentController)
    service = module.get<CommentService>(CommentService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAll', () => {
    it('should return all comments', async () => {
      mockCommentService.findAll.mockResolvedValue(mockComments)

      const result = await controller.getAll()

      expect(result).toEqual(mockComments)
      expect(service.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('getOne', () => {
    it('should return a comment by id', async () => {
      mockCommentService.findOne.mockResolvedValue(mockComment)

      const result = await controller.getOne(1)

      expect(result).toEqual(mockComment)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })

    it('should handle string id conversion', async () => {
      mockCommentService.findOne.mockResolvedValue(mockComment)

      const result = await controller.getOne(123)

      expect(result).toEqual(mockComment)
      expect(service.findOne).toHaveBeenCalledWith(123)
    })
  })

  describe('getAllByUser', () => {
    it('should return all comments for a user', async () => {
      mockCommentService.findAllByUser.mockResolvedValue(mockComments)

      const result = await controller.getAllByUser(1)

      expect(result).toEqual(mockComments)
      expect(service.findAllByUser).toHaveBeenCalledWith(1)
    })
  })

  describe('findAllByPlace', () => {
    it('should return all comments for a place', async () => {
      mockCommentService.findAllByPlace.mockResolvedValue(mockComments)

      const result = await controller.findAllByPlace(1)

      expect(result).toEqual(mockComments)
      expect(service.findAllByPlace).toHaveBeenCalledWith(1)
    })
  })

  describe('add', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = {
        commentText: 'Amazing place!',
        rating: 5,
        placeID: 1,
      }

      mockCommentService.add.mockResolvedValue(mockComment)

      const result = await controller.add(createCommentDto, { user: { sub: 1 } } as any)

      expect(result).toEqual(mockComment)
      expect(service.add).toHaveBeenCalledWith(createCommentDto, 1)
    })
  })

  describe('delete', () => {
    it('should delete a comment by id', async () => {
      mockCommentService.remove.mockResolvedValue(mockComment)

      const result = await controller.delete(1, { user: { sub: 1 } } as any)

      expect(result).toEqual(mockComment)
      expect(service.remove).toHaveBeenCalledWith(1, 1)
    })
  })

  describe('update', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        commentText: 'Updated comment text',
        rating: 4,
      };

      mockCommentService.update.mockResolvedValue(mockComment)

      const result = await controller.update(1, updateCommentDto, { user: { sub: 1 } } as any)

      expect(result).toEqual(mockComment)
      expect(service.update).toHaveBeenCalledWith(1, updateCommentDto, 1)
    })
  })
})