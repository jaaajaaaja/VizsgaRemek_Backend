import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { PhotoService } from 'src/photo/photo.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import path from 'path';
import * as fs from 'fs';

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
    const wrong_image = path.join(__dirname, 'test picture', 'wrong_file.txt')

    const invalid_token = "invalid_token"

    function deleteTestImage() {
        const dir = path.join(process.cwd(), './uploads')
        const files = fs.readdirSync(dir).sort()

        if (files.length === 0) return

        fs.unlinkSync(path.join(dir, files[files.length - 1]))
    }

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
        await app.close()
    })

    describe("should not throw exception", () => {
        it('(POST) /photo/upload', async () => {
            const result = await request(app.getHttpServer())
                .post('/photo/upload')
                .set('Authorization', `Bearer ${token}`)
                .field({ userID: 1, placeID: 1 })
                .attach('file', photoPath)
                .expect(201)

            deleteTestImage()
            return result
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

    describe("should throw bad request exceptions", () => {
        it('(POST) /photo/upload - userID missing', async () => {
            return request(app.getHttpServer())
                .post('/photo/upload')
                .set('Authorization', `Bearer ${token}`)
                .field({ placeID: 1 })
                .attach('file', photoPath)
                .expect(400)
        })

        it('(POST) /photo/upload - zero files', async () => {
            return request(app.getHttpServer())
                .post('/photo/upload')
                .set('Authorization', `Bearer ${token}`)
                .field({ placeID: 1, userID: 1 })
                .expect(409)
        })
    })
})