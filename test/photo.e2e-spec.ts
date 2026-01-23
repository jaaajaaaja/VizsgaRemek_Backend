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

    const invalid_token = "invalid_token"

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PhotoService)
            .useValue(mockPhotoService)
            // .overrideProvider('MULTER_MODULE_OPTIONS')
            // .useValue(FileInterceptor('file', { storage: multer.memoryStorage() }))
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
        /*it('(POST) /photo', async () => {
            //const photoPath = path.join(__dirname, 'test picture', 'test_picture.png')

            return request(app.getHttpServer())
                .post('/photo')
                .set('Authorization', `Bearer ${token}`)
                .field({ placeID: 1, loggedInUserId: mockUser.id })
                .attach('file', Buffer.from("fake image"), "test.png")
                .expect(201)
        })*/

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
                .post('/photo')
                .set('Authorization', `Bearer ${invalid_token}`)
                .send({ commentText: "nice place", placeID: 1 })
                .expect(401)
        })

        it('(DELETE) /photo/:id', async () => {
            return request(app.getHttpServer())
                .delete('/photo/1')
                .set('Authorization', `Bearer ${invalid_token}`)
                .send({ commentText: "nice place", placeID: 1 })
                .expect(401)
        })
    })

    afterAll(async () => {
        await app.close()
    })
})