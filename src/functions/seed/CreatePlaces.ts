import { faker } from "@faker-js/faker"
import { place, Prisma, PrismaClient } from "generated/prisma/client"

const prisma = new PrismaClient()

export async function CreatePlace(count: number): Promise<{placeData: Prisma.placeCreateManyInput[], testPlace: place}> {
    const testPlace = await prisma.place.create({
        data: {
            googleplaceID: "test-googleplace-id",
            name: "Test place",
            address: "123 Test Street, Test City",
        }
    })

    const placeData: Prisma.placeCreateManyInput[] = Array.from({ length: count }, () => ({
        googleplaceID: `${faker.string.alphanumeric(20)}`,
        name: faker.company.name(),
        address: faker.location.streetAddress({ useFullAddress: true })
    }))

    return {placeData, testPlace}
}