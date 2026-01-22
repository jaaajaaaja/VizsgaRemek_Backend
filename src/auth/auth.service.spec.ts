import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt')
import * as bcrypt from "bcrypt";

describe('AuthService', () => {
  let service: AuthService
  let userService: UserService
  let jwtService: JwtService

  const mockUserService = {
    findOne: jest.fn()
  }

  const mockJwtService = {
    signAsync: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe("signIn", () => {
    it("should throw NotFoundException when user does not exist", async () => {
      mockUserService.findOne.mockResolvedValue(null)

      await expect(service.signIn('test@test.com', 'password')).rejects.toThrow(NotFoundException)
      expect(mockUserService.findOne).toHaveBeenCalledWith("test@test.com")
    })

    it("should return jwt token", async () => {
      const mockUser = {
        id: 1,
        userName: "test username",
        email: "test@test.com",
        password: "password"
      }

      mockUserService.findOne.mockResolvedValue(mockUser)
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never)
      mockJwtService.signAsync.mockResolvedValue("jwt-token")

      const result = await service.signIn(mockUser.email, mockUser.password)

      expect(result).toEqual({ access_token: "jwt-token" })
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email
        }
      )
    })
  })
})
