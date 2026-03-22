import { faker } from "@faker-js/faker"
import { Prisma, PrismaClient, user } from "generated/prisma/client"
import { GOOGLE_PLACE_CATEGORIES } from "src/types/place-types"

const prisma = new PrismaClient()

export async function CraeteUserInterests(users: user[]): Promise<Prisma.user_interestCreateManyInput[]> {
    const userInterestData: Prisma.user_interestCreateManyInput[] = []

    for (const user of users) {
        const interests = faker.helpers.arrayElements(
            GOOGLE_PLACE_CATEGORIES,
            { min: 0, max: 3 }
        )

        for (const interest of interests) {
            userInterestData.push({
                interest,
                userID: user.id
            })
        }
    }

    await prisma.user_interest.create({
        data: {
            interest: "billiard_hall",
            userID: 1
        }
    })

    await prisma.user_interest.create({
        data: {
            interest: "beer_bar",
            userID: 1
        }
    })

    return userInterestData
}