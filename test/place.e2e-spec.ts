import request from 'supertest';
import { Test } from '@nestjs/testing';
import { PlaceModule } from '../src/place/place.module';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PlaceService } from 'src/place/place.service';

describe("Places", () => {
    let app: INestApplication

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
        // getAll: jest.fn(),
        getOne: jest.fn(),
        getOneByGoogleplaceID: jest.fn(),
        // remove: jest.fn(),
        // add: jest.fn(),
        // update: jest.fn()
    }


    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [PlaceModule]
        })
            .overrideProvider(PlaceService)
            .useValue(mockPlaceService)
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    describe("/GET", () => {
        // it("/GET all place", () => {
        //     mockPlaceService.getAll.mockResolvedValue(mockPlace)

        //     return request(app.getHttpServer())
        //         .get("/place")
        //         .expect(200)
        //         .expect(mockPlace)
        // })

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

    // describe("/DELETE", () => {
    //     it("/DELETE place", () => {
    //         mockPlaceService.remove.mockResolvedValue(mockPlace[0])

    //         request(app.getHttpServer())
    //             .delete("/place/1")
    //             .expect(200)
    //             .expect(mockPlace[0])

    //         request(app.getHttpServer())
    //             .get("/place/1")
    //             .expect(404)
    //     })

    //     it("/DELETE place by not existing id", () => {
    //         mockPlaceService.remove.mockRejectedValueOnce(NotFoundException)

    //         request(app.getHttpServer())
    //             .delete("/place/1")
    //             .expect(200)
    //             .expect(mockPlace[0])

    //         request(app.getHttpServer())
    //             .get("/place/1")
    //             .expect(404)
    //     })
    // })

    // describe("/PUT", () => {
    //     it("/PUT place", () => {
    //         mockPlaceService.update.mockResolvedValue(mockPlace[0])

    //         request(app.getHttpServer())
    //             .put("/place")
    //             .expect(200)
    //             .expect(mockPlace[0])
    //     })

    //     it("/PUT place by not existing id", () => {
    //         mockPlaceService.update.mockRejectedValueOnce(NotFoundException)

    //         request(app.getHttpServer())
    //             .put("/place")
    //             .expect(200)
    //             .expect(mockPlace[0])
    //     })

    //     it("/PUT place by not acceptable value", () => {
    //         mockPlaceService.update.mockRejectedValueOnce({"test": "test"})

    //         request(app.getHttpServer())
    //             .put("/place/1")
    //             .expect(400)
    //     })
    // })

    // describe("/POST", () => {
    //     it("/POST place", () => {
    //         mockPlaceService.add.mockResolvedValue(mockPlace[0])

    //         request(app.getHttpServer())
    //             .post("/place")
    //             .expect(200)
    //             .expect(mockPlace[0])
    //     })
    // })

    afterAll(async () => {
        await app.close()
    })
})