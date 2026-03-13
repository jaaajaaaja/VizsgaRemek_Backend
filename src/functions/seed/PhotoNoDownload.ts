import { faker } from "@faker-js/faker";
import { Prisma } from "generated/prisma/client";

/**
 * Use this if you don't want to download actual files
 * @param count how much test data you want
 * @param users users list
 * @param places palces list
 * @returns list of photos
 */
export function PhotoNoDownload(
    count: number,
    users: Prisma.UserCreateManyInput[],
    places: Prisma.PlaceCreateManyInput[]
): Prisma.PhotoCreateManyInput[] {
    const FILE_TYPES = ["jpeg", "png", "gif"]

    const randomType = faker.helpers.arrayElement(FILE_TYPES)

    const photoData = Array.from({ length: count }, () => ({
        location: `uploads/${faker.string.alphanumeric(5)}.${randomType}`,
        type: `image/${randomType}`,
        userID: faker.helpers.arrayElement(users).id!!,
        placeID: faker.helpers.arrayElement(places).id!!,
        approved: faker.datatype.boolean(0.5),
        createdAt: faker.date.between({ from: '2026-01-01T00:00:00.000Z', to: '2027-01-01T00:00:00.000Z' })
    }))

    return photoData
}