import { faker } from "@faker-js/faker"
import { Place, Prisma, PrismaClient } from "generated/prisma/client"
import { GOOGLE_PLACE_CATEGORIES } from "prisma/seed"

const prisma = new PrismaClient()

export async function CreatePlaceCategories(placesCount: number, places: Place[]): Promise<Prisma.Place_CategoryCreateManyInput[]> {
    const placeCategoryData: Prisma.Place_CategoryCreateManyInput[] = []

    for (const place of places) {
        const categories = faker.helpers.arrayElements(
            GOOGLE_PLACE_CATEGORIES,
            faker.number.int({ min: 1, max: 3 })
        )

        for (const category of categories) {
            placeCategoryData.push({
                category,
                placeID: faker.number.int({ min: 2, max: placesCount })
            })
        }
    }

    await prisma.place_Category.createMany({
        data: [
            {
                category: "billiard_hall",
                placeID: 1
            },
            {
                category: "beer_bar",
                placeID: 1
            }
        ]
    })

    return placeCategoryData
}