import { faker } from "@faker-js/faker"
import { Place, Prisma, PrismaClient } from "generated/prisma/client"

const prisma = new PrismaClient()

export async function CreatePlace(count: number): Promise<{placeData: Prisma.PlaceCreateManyInput[], testPlace: Place}> {
    const testPlace = await prisma.place.create({
        data: {
            googleplaceID: "test-googleplace-id",
            name: "Test Place",
            address: "123 Test Street, Test City",
        }
    })

    const placeData: Prisma.PlaceCreateManyInput[] = Array.from({ length: count }, () => ({
        googleplaceID: `${faker.string.alphanumeric(20)}`,
        name: faker.company.name(),
        address: faker.location.streetAddress({ useFullAddress: true })
    }))

    return {placeData, testPlace}
}