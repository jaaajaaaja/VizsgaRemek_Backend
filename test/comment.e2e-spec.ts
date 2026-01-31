import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { CommentService } from 'src/comment/comment.service';

describe('CommentController E2E', () => {
    let app: INestApplication
    let jwtService: JwtService
    let token: string

    const mockUser = {
        id: 1,
        email: 'test@test.test',
        userName: 'test',
    }

    const mockCommentService = {
        add: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
    }

    const invalid_token = "invalid_token"

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(CommentService)
            .useValue(mockCommentService)
            .compile()

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(new ValidationPipe({ transform: true }))
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
        it('(POST) /comment', async () => {
            return request(app.getHttpServer())
                .post('/comment')
                .set('Authorization', `Bearer ${token}`)
                .send({ commentText: "nice place", placeID: 1 })
                .expect(201)
        })

        it('(PUT) /comment/:id', async () => {
            return request(app.getHttpServer())
                .put('/comment/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ commentText: "nice place", placeID: 1 })
                .expect(200)
        })

        it('(DELETE) /comment/:id', async () => {
            return request(app.getHttpServer())
                .delete('/comment/1')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
        })
    })

    describe("should throw UnathorizedException", () => {
        it('(POST) /comment', async () => {
            return request(app.getHttpServer())
                .post('/comment')
                .set('Authorization', `Bearer ${invalid_token}`)
                .send({ commentText: "nice place", placeID: 1 })
                .expect(401)
        })

        it('(PUT) /comment/:id', async () => {
            return request(app.getHttpServer())
                .put('/comment/1')
                .set('Authorization', `Bearer ${invalid_token}`)
                .send({ commentText: "nice place", placeID: 1 })
                .expect(401)
        })

        it('(DELETE) /comment/:id', async () => {
            return request(app.getHttpServer())
                .delete('/comment/1')
                .set('Authorization', `Bearer ${invalid_token}`)
                .expect(401)
        })
    })

    describe("sanitize", () => {
        it("should throw bad request", async () => {
            const response = await request(app.getHttpServer())
                .post('/comment')
                .set('Authorization', `Bearer ${token}`)
                .send({ commentText: "<a><script> sdfsdf</script></a>", placeID: 1 })

            expect(response.status).toBe(400)
        })
    })
})