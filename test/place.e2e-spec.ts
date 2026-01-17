import request from 'supertest';
import { Test } from '@nestjs/testing';
import { PlaceModule } from '../src/place/place.module';
import { PlaceService } from '../src/place/place.service';
import { INestApplication } from '@nestjs/common';

describe("Places", () => {
    let app: INestApplication
    let placeService = { getAll: () => ["test"] }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [PlaceModule]
        })
            .overrideProvider(PlaceService)
            .useValue(placeService)
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it("/GET place", () => {
        return request(app.getHttpServer())
        .get("/place")
        .expect(200)
        .expect({
            data: placeService.getAll()
        })
    })

    afterAll(async () => {
        await app.close()
    })
})