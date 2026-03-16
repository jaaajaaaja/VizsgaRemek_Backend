import { faker } from "@faker-js/faker"
import { place, Prisma, PrismaClient, user } from "generated/prisma/client"

const prisma = new PrismaClient()

export async function CreateNews(
    count: number,
    places: place[],
    users: user[]
): Promise<Prisma.newsCreateManyInput[]> {
    const testPlace = places[0]
    const testUser = users[0]

    const newsData: Prisma.newsCreateManyInput[] = Array.from({ length: count }, () => ({
        text: faker.lorem.paragraphs({ min: 1, max: 3 }),
        placeID: faker.helpers.arrayElement(places).id,
        userID: faker.helpers.arrayElement(users).id,
        approved: faker.datatype.boolean(0.5),
        createdAt: faker.date.between({ from: '2026-01-01T00:00:00.000Z', to: '2027-01-01T00:00:00.000Z' })
    }))

    await prisma.news.create({
        data: {
            text: "Test news text.",
            placeID: testPlace.id,
            userID: testUser ? testUser.id : 1,
            approved: true
        },
    })

    return newsData
}