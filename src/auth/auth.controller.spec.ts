import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService: any = {
    signIn: jest.fn(),
  };

  const mockJwtService: any = {
    verifyAsync: jest.fn(),
  };

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
        },
        AuthGuard,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signIn should return access token on successful login', async () => {
    const body = {
      email: 'test@example.com',
      password: 'password123',
    };
    const tokenResponse = {
      access_token: 'mock-jwt-token',
    };
    mockAuthService.signIn.mockResolvedValue(tokenResponse);

    const result = await controller.signIn(body);

    expect(service.signIn).toHaveBeenCalledWith(body.email, body.password);
    expect(result).toEqual(tokenResponse);
  });

  it('signIn should throw UnauthorizedException on invalid credentials', async () => {
    const body = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };
    mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

    await expect(controller.signIn(body)).rejects.toThrow(UnauthorizedException);
    expect(service.signIn).toHaveBeenCalledWith(body.email, body.password);
  });

  it('getProfile should return user from request', () => {
    const mockUser = {
      id: 1,
      userName: 'testuser',
      email: 'test@example.com',
    };
    const mockRequest = {
      user: mockUser,
    };

    const result = controller.getProfile(mockRequest);

    expect(result).toEqual(mockUser);
  });
});
