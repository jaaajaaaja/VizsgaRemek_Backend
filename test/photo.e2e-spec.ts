import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { PhotoService } from 'src/photo/photo.service';
import path from 'path';
import * as multer from 'multer'
import { FileInterceptor } from '@nestjs/platform-express';

describe('PhotoController E2E', () => {
    let app: INestApplication
    let jwtService: JwtService
    let token: string

    const mockUser = {
        id: 1,
        email: 'test@test.test',
        userName: 'test',
    }

    const mockPhotoService = {
        add: jest.fn(),
        remove: jest.fn()
    }

    const photoPath = path.join(__dirname, 'test picture', 'test_picture.png')

    const invalid_token = "invalid_token"

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PhotoService)
            .useValue(mockPhotoService)
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
        it('(POST) /photo/upload', async () => {
            return request(app.getHttpServer())
                .post('/photo/upload')
                .set('Authorization', `Bearer ${token}`)
                .field({ userID: 1, placeID: 1 })
                .attach('file', photoPath)
                .expect(201)
        })

        it('(DELETE) /photo/:id', async () => {
            return request(app.getHttpServer())
                .delete('/photo/1')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
        })
    })

    describe("should throw UnathorizedException", () => {
        it('(POST) /photo', async () => {
            return request(app.getHttpServer())
                .post('/photo/upload')
                .set('Authorization', `Bearer ${invalid_token}`)
                .field({ userID: 1, placeID: 1 })
                .expect(401)
        })

        it('(DELETE) /photo/:id', async () => {
            return request(app.getHttpServer())
                .delete('/photo/1')
                .set('Authorization', `Bearer ${invalid_token}`)
                .expect(401)
        })
    })

    afterAll(async () => {
        await app.close()
    })
})