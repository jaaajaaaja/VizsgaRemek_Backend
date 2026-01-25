import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PlaceService } from 'src/place/place.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentService } from 'src/comment/comment.service';
import { PhotoService } from 'src/photo/photo.service';
import { UserService } from 'src/user/user.service';

jest.setTimeout(30000)

describe('Throttle E2E', () => {
    let app: INestApplication

    const mockAuthService = {
        signIn: jest.fn()
    }

    const mockCommentService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findAllByUser: jest.fn(),
        findAllByPlace: jest.fn(),
        add: jest.fn(),
        remove: jest.fn(),
        update: jest.fn()
    }

    const mockPhotoService = {
        getAll: jest.fn(),
        getOne: jest.fn(),
        getAllByUser: jest.fn(),
        getAllByPlace: jest.fn(),
        add: jest.fn(),
        remove: jest.fn()
    }

    const mockPlaceService = {
        // getAll: jest.fn(),
        getOne: jest.fn(),
        getOneByGoogleplaceID: jest.fn(),
        // add: jest.fn(),
        // remove: jest.fn(),
        // update: jest.fn()
    }

    const mockUserService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        add: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AuthGuard)
            .useValue(mockAuthService)
            .overrideProvider(CommentService)
            .useValue(mockCommentService)
            .overrideProvider(PhotoService)
            .useValue(mockPhotoService)
            .overrideProvider(PlaceService)
            .useValue(mockPlaceService)
            .overrideProvider(UserService)
            .useValue(mockUserService)
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => { 1 } })
            .compile()

        app = moduleFixture.createNestApplication();
        await app.init()
    })
    
    afterAll(async () => {
        await app.close()
    })

    describe("/auth", () => {
        describe("3 REQUESTS MAXIMUM", () => {
            it("POST LOGIN", async () => {
                const endpoint = "/auth/login"
                const agent = request(app.getHttpServer())

                const limit = 3

                for (let i = 0; i < limit; i++) {
                    const response = await agent.post(endpoint).send({ email: "test@test.test", password: "test" })
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.post(endpoint).send({ email: "test@test.test", password: "test" })
                expect(lastResponse.status).toBe(429)
            })
        })

        describe("120 REQUESTS MAX", () => {
            it("GET PROFILE", async () => {
                const endpoint = "/auth/profile"
                const agent = request(app.getHttpServer())

                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })
        })
    })

    describe("/photo", () => {
        describe("120 REQUESTS MAX", () => {
            it("GET ALL", async () => {
                const endpoint = "/photo"
                const agent = request(app.getHttpServer())

                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            it("GET BY ID", async () => {
                const agent = request(app.getHttpServer())

                const endpoint = "/photo/1"
                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            it("GET BY USER", async () => {
                const agent = request(app.getHttpServer())

                const endpoint = "/photo/getAllByUser/1"
                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            it("GET BY PLACE", async () => {
                const agent = request(app.getHttpServer())

                const endpoint = "/photo/getAllByPlace/1"
                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            it("DELETE", async () => {
                const endpoint = "/photo/1"
                const agent = request(app.getHttpServer())

                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.delete(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.delete(endpoint)
                expect(lastResponse.status).toBe(429)
            })
        })

        describe("5 REQUESTS MAX", () => {
            it("POST", async () => {
                const endpoint = "/photo/upload"
                const agent = request(app.getHttpServer())

                const limit = 5

                const payload = {}

                for (let i = 0; i < limit; i++) {
                    const response = await agent.post(endpoint).send(payload)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.post(endpoint).send(payload)
                expect(lastResponse.status).toBe(429)
            })
        })
    })

    describe("/comment", () => {
        describe("120 REQUESTS MAX", () => {
            it("GET ALL", async () => {
                const endpoint = "/comment"
                const agent = request(app.getHttpServer())

                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            it("GET BY ID", async () => {
                const agent = request(app.getHttpServer())

                const endpoint = "/comment/1"
                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            it("GET BY USER", async () => {
                const agent = request(app.getHttpServer())

                const endpoint = "/comment/findAllByUser/1"
                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            it("GET BY PLACE", async () => {
                const agent = request(app.getHttpServer())

                const endpoint = "/comment/findAllByPlace/1"
                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            it("DELETE", async () => {
                const endpoint = "/comment/1"
                const agent = request(app.getHttpServer())

                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.delete(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.delete(endpoint)
                expect(lastResponse.status).toBe(429)
            })
        })

        describe("60 REQUESTS MAXIMUM", () => {
            it("POST", async () => {
                const endpoint = "/comment"
                const agent = request(app.getHttpServer())

                const limit = 60

                const payload = { commentText: "test text", userID: 1, placeID: 1 }

                for (let i = 0; i < limit; i++) {
                    const response = await agent.post(endpoint).send(payload)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.post(endpoint).send(payload)
                expect(lastResponse.status).toBe(429)
            })

            it("PUT", async () => {
                const endpoint = "/comment/1"
                const agent = request(app.getHttpServer())

                const limit = 60

                const payload = { commentText: "test text" }

                for (let i = 0; i < limit; i++) {
                    const response = await agent.put(endpoint).send(payload)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.put(endpoint).send(payload)
                expect(lastResponse.status).toBe(429)
            })
        })
    })

    describe("/place", () => {
        describe("120 REQUESTS MAXIMUM", () => {
            // it("GET ALL", async () => {
            //     const endpoint = "/place"
            //     const agent = request(app.getHttpServer())

            //     const limit = 120

            //     for (let i = 0; i < limit; i++) {
            //         const response = await agent.get(endpoint)
            //         expect(response.status).toBeLessThan(429)
            //     }

            //     const lastResponse = await agent.get(endpoint)
            //     expect(lastResponse.status).toBe(429)
            // })

            it("GET BY ID", async () => {
                const agent = request(app.getHttpServer())

                const endpoint = "/place/1"
                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            it("GET BY GOOGLEPLACEID", async () => {
                const agent = request(app.getHttpServer())

                const endpoint = "/place/getByGooglePlaceId/test-googleplace-id"
                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.get(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.get(endpoint)
                expect(lastResponse.status).toBe(429)
            })

            // it("DELETE", async () => {
            //     const endpoint = "/place/1"
            //     const agent = request(app.getHttpServer())

            //     const limit = 120

            //     for (let i = 0; i < limit; i++) {
            //         const response = await agent.delete(endpoint)
            //         expect(response.status).toBeLessThan(429)
            //     }

            //     const lastResponse = await agent.delete(endpoint)
            //     expect(lastResponse.status).toBe(429)
            // })
        })

        describe("60 REQUESTS MAXIMUM", () => {
            it("POST", async () => {
                const endpoint = "/place"
                const agent = request(app.getHttpServer())

                const limit = 60

                const payload = { name: "test name", address: "test address" }

                for (let i = 0; i < limit; i++) {
                    const googlePlaceID = `test${i}`
                    const response = await agent.post(endpoint).send({ ...payload, googlePlaceID })
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.post(endpoint).send(payload)
                expect(lastResponse.status).toBe(429)
            })

        //     it("PUT", async () => {
        //         const endpoint = "/place/1"
        //         const agent = request(app.getHttpServer())

        //         const limit = 60

        //         const payload = { name: "test name" }

        //         for (let i = 0; i < limit; i++) {
        //             const response = await agent.put(endpoint).send(payload)
        //             expect(response.status).toBeLessThan(429)
        //         }

        //         const lastResponse = await agent.put(endpoint).send(payload)
        //         expect(lastResponse.status).toBe(429)
        //     })
        })
    })

    describe("/user", () => {
        describe("120 REQUESTS MAXIMUM", () => {
            // it("GET ALL", async () => {
            //     const endpoint = "/user"
            //     const agent = request(app.getHttpServer())

            //     const limit = 120

            //     for (let i = 0; i < limit; i++) {
            //         const response = await agent.get(endpoint)
            //         expect(response.status).toBeLessThan(429)
            //     }

            //     const lastResponse = await agent.get(endpoint)
            //     expect(lastResponse.status).toBe(429)
            // })

            // it("GET BY ID", async () => {
            //     const agent = request(app.getHttpServer())

            //     const endpoint = "/user/1"
            //     const limit = 120

            //     for (let i = 0; i < limit; i++) {
            //         const response = await agent.get(endpoint)
            //         expect(response.status).toBeLessThan(429)
            //     }

            //     const lastResponse = await agent.get(endpoint)
            //     expect(lastResponse.status).toBe(429)                
            // })

            it("DELETE", async () => {
                const endpoint = "/user/1"
                const agent = request(app.getHttpServer())

                const limit = 120

                for (let i = 0; i < limit; i++) {
                    const response = await agent.delete(endpoint)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.delete(endpoint)
                expect(lastResponse.status).toBe(429)
            })
        })

        describe("60 REQUESTS MAXIMUM", () => {
            it("POST", async () => {
                const endpoint = "/user"
                const agent = request(app.getHttpServer())

                const limit = 60

                const payload = { email: "test@test.test", userName: "test", password: "test" }

                for (let i = 0; i < limit; i++) {
                    const response = await agent.post(endpoint).send(payload)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.post(endpoint).send(payload)
                expect(lastResponse.status).toBe(429)
            })

            it("PUT", async () => {
                const endpoint = "/user/1"
                const agent = request(app.getHttpServer())

                const limit = 60

                const payload = { userName: "test name" }

                for (let i = 0; i < limit; i++) {
                    const response = await agent.put(endpoint).send(payload)
                    expect(response.status).toBeLessThan(429)
                }

                const lastResponse = await agent.put(endpoint).send(payload)
                expect(lastResponse.status).toBe(429)
            })
        })
    })    
})