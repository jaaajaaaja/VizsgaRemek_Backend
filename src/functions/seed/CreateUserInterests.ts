import { faker } from "@faker-js/faker"
import { Prisma, PrismaClient, User } from "generated/prisma/client"
import { GOOGLE_PLACE_CATEGORIES } from "prisma/seed"

const prisma = new PrismaClient()

export async function CraeteUserInterests(users: User[]): Promise<Prisma.User_InterestCreateManyInput[]> {
    const userInterestData: Prisma.User_InterestCreateManyInput[] = []

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

    await prisma.user_Interest.create({
        data: {
            interest: "billiard_hall",
            userID: 1
        }
    })

    await prisma.user_Interest.create({
        data: {
            interest: "beer_bar",
            userID: 1
        }
    })

    return userInterestData
}