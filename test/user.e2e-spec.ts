import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

describe('CommentController E2E', () => {
    let app: INestApplication
    let jwtService: JwtService
    let token: string

    const mockUser = {
        id: 1,
        email: 'test@test.test',
        userName: 'test',
    }

    const mockUserService = {
        remove: jest.fn(),
        update: jest.fn(),
    }

    const invalid_token = "invalid_token"

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(UserService)
            .useValue(mockUserService)
            .compile()

        app = moduleFixture.createNestApplication()
        await app.init()

        jwtService = moduleFixture.get(JwtService)

        token = jwtService.sign(
            {
                sub: mockUser.id,
                email: mockUser.email,
            },
            {
                secret: process.env.JWT_SECRET
            }
        )
    })

    afterAll(async () => {
        await app.close();
    })

    describe("should not throw exception", () => {
        it('(PUT) /user/:id', async () => {
            return request(app.getHttpServer())
                .put('/user/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ userName: "test" })
                .expect(200)
        })

        it('(DELETE) /user/:id', async () => {
            return request(app.getHttpServer())
                .delete('/user/1')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
        })
    })

    describe("should throw UnathorizedException", () => {
        it('(PUT) /user/:id', async () => {
            return request(app.getHttpServer())
                .put('/user/1')
                .set('Authorization', `Bearer ${invalid_token}`)
                .send({ commentText: "nice place", placeID: 1 })
                .expect(401)
        })

        it('(DELETE) /user/:id', async () => {
            return request(app.getHttpServer())
                .delete('/user/1')
                .set('Authorization', `Bearer ${invalid_token}`)
                .expect(401)
        })
    })

    afterAll(async () => {
        await app.close()
    })
})