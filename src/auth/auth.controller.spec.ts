import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthenticatedRequest } from 'src/types/user-types';
import { sign } from 'node:crypto';

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  const mockAuthService: any = {
    signIn: jest.fn(),
    getProfile: jest.fn(),
  }

  const mockJwtService: any = {
    verifyAsync: jest.fn(),
  }

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        }
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(() => { { 1 } })
      .compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)

    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })

  it('signIn should return access token on successful login', async () => {
    const body = {
      email: 'test@example.com',
      password: 'password123',
    }

    const tokenResponse = {
      access_token: 'mock-jwt-token',
    }

    mockAuthService.signIn.mockResolvedValue(tokenResponse)

    const result = await controller.signIn(body, mockResponse)

    expect(service.signIn).toHaveBeenCalledWith(body.email, body.password)
  })

  it('signIn should throw UnauthorizedException on invalid credentials', async () => {
    const body = {
      email: 'test@example.com',
      password: 'wrongpassword',
    }

    mockAuthService.signIn.mockRejectedValue(new UnauthorizedException())

    await expect(controller.signIn(body, mockResponse)).rejects.toThrow(UnauthorizedException)
    expect(service.signIn).toHaveBeenCalledWith(body.email, body.password)
  })

  it('getProfile should return user from request', async () => {
    const mockUser = {
      sub: 1,
      id: 1,
      userName: 'testuser',
      email: 'test@example.com',
    }

    const mockRequest = {
      user: mockUser,
    } as any as AuthenticatedRequest

    mockAuthService.getProfile.mockResolvedValue(mockUser)

    const result = await controller.getUserProfile(mockRequest)

    expect(result).toEqual(mockUser)
  })

  it('logout should clear access_token cookie', () => {
    const result = controller.logout(mockResponse)

    expect(mockResponse.clearCookie).toHaveBeenCalledWith(
      'access_token',
      {
        "httpOnly": true,
        "path": "/",
        "sameSite": "lax",
        "signed": true
      }
    )
    expect(result).toEqual({ message: 'Logged out successfully' })
  })
})
