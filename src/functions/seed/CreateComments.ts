import { faker } from "@faker-js/faker"
import { place, Prisma, PrismaClient, user } from "generated/prisma/client"

const prisma = new PrismaClient

export async function CreateComments(
    count: number,
    users: user[],
    places: place[]
): Promise<Prisma.commentCreateManyInput[]> {
    const testUser = users[0]
    const testPlace = places[0]

    const commentData: Prisma.commentCreateManyInput[] = Array.from({ length: count }, () => ({
        commentText: faker.lorem.sentence({ min: 5, max: 15 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        userID: faker.helpers.arrayElement(users).id,
        placeID: faker.helpers.arrayElement(places).id,
        approved: faker.datatype.boolean(0.5),
        createdAt: faker.date.between({ from: '2026-01-01T00:00:00.000Z', to: '2027-01-01T00:00:00.000Z' })
    }))

    await prisma.comment.createMany({
        data: [
            {
                commentText: "This is a test comment.",
                rating: 5,
                userID: testUser.id,
                placeID: testPlace.id,
                approved: true
            },
            {
                commentText: "This is another test comment.",
                rating: 5,
                userID: testUser.id,
                placeID: testPlace.id,
                approved: true
            },
        ],
    })

    return commentData
}