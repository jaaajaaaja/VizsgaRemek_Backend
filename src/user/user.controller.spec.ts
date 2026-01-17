import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController
  let service: UserService

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

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    update: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        }
      ]
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })

  describe("getAll", () => {
    it("should return all users", async () => {
      mockUserService.findAll.mockResolvedValue(mockUsers)

      const result = await controller.getAll()

      expect(result).toEqual(mockUsers)
      expect(service.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOne", () => {
    it("should get a user by email", async () => {
      mockUserService.findOne.mockResolvedValue(mockUser)

      const result = await controller.getOne("test@test.com")

      expect(result).toEqual(mockUser)
      expect(service.findOne).toHaveBeenCalledWith("test@test.com")
    })
  })

  describe("add", () => {
    it("should add a user", async () => {
      mockUserService.add.mockResolvedValue(mockUser)

      const result = await controller.add(mockUser)

      expect(result).toEqual(mockUser)
      expect(service.add).toHaveBeenCalledWith(
        expect.objectContaining({
          userName: mockUser.userName,
          email: mockUser.email,
          password: expect.any(String)
        })
      )
      expect(service.add).toHaveBeenCalledTimes(1)
    })
  })

  describe("remove", () => {
    it("should delete a user by id", async () => {
      mockUserService.remove.mockResolvedValue(mockUser)

      const result = await controller.remove(1)

      expect(result).toEqual(mockUser)
      expect(service.remove).toHaveBeenCalledWith(1)
      expect(service.remove).toHaveBeenCalledTimes(1)
    })
  })

  describe("update", () => {
    it("should update a user by id", async () => {
      const data:UpdateUserDto = {
        userName: "testUsername"
      }

      mockUserService.update.mockResolvedValue(mockUser)

      const result = await controller.update(1, data)

      expect(result).toEqual(mockUser)
      expect(service.update).toHaveBeenCalledWith(1, data)
    })
  })
})
