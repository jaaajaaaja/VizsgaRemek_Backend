import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PlaceService } from 'src/place/place.service';
import { JwtService } from '@nestjs/jwt';

describe("Places", () => {
    let app: INestApplication
    let jwtService: JwtService
    let token: string

    const mockUser = {
        id: 1,
        email: 'test@test.test',
        userName: 'test',
    }

    const mockPlace = [
        {
            id: 1,
            name: 'Test place',
            googleplaceID: 'test-google-id',
            address: 'Test address',
        },
        {
            id: 2,
            name: 'Test place2',
            googleplaceID: 'test-google-id2',
            address: 'Test address2',
        }
    ]

    const mockPlaceService = {
        getOne: jest.fn(),
        getOneByGoogleplaceID: jest.fn(),
        add: jest.fn(),
        addPlaceCategory: jest.fn(),
        addNews: jest.fn(),
        updateNews: jest.fn(),
    }


    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(PlaceService)
            .useValue(mockPlaceService)
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

    describe("/GET", () => {

        it("/GET place by id", () => {
            mockPlaceService.getOne.mockResolvedValue(mockPlace[0])

            return request(app.getHttpServer())
                .get("/place/1")
                .expect(200)
                .expect(res => {
                    expect(res.body).toMatchObject(mockPlace[0])
                })
        })

        it("/GET place by not existing id", () => {
            mockPlaceService.getOne.mockRejectedValueOnce(
                new NotFoundException("Place not found!")
            )

            return request(app.getHttpServer())
                .get("/place/1")
                .expect(404)
        })

        it("/GET place by googleplaceID", () => {
            mockPlaceService.getOneByGoogleplaceID.mockResolvedValue(mockPlace[0])

            return request(app.getHttpServer())
                .get(`/place/getByGooglePlaceId/${mockPlace[0].googleplaceID}`)
                .expect(200)
                .expect(res => {
                    expect(res.body).toMatchObject(mockPlace[0])
                })
        })

        it("/GET place by not existing googleplaceID", () => {
            mockPlaceService.getOneByGoogleplaceID.mockRejectedValueOnce(
                new NotFoundException("Place not found!")
            )

            return request(app.getHttpServer())
                .get("/place/getByGooglePlaceId/noID")
                .expect(404)
        })
    })

    describe("addPlaceCategory", () => {
        it("/POST should create a place category", async () => {
            mockPlaceService.add.mockResolvedValue(mockPlace[0])

            return request(app.getHttpServer())
                .post("/place/1/category")
                .send("bar")
                .expect(201)
        })
    })

    describe("/POST", () => {
        it("/POST place", () => {
            mockPlaceService.add.mockResolvedValue(mockPlace[0])

            request(app.getHttpServer())
                .post("/place")
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect(mockPlace[0])
        })
    })
})