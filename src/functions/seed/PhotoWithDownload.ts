import fs from "fs";
import { Prisma } from "generated/prisma/client";
import path from "path";
import { DownloadType } from "src/types/download-types";
import { faker } from "@faker-js/faker"

async function download_test_images(count: number): Promise<DownloadType[]> {
    const dir = "./uploads"

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    const image_names: DownloadType[] = []

    for (let i = 1; i <= count; i++) {
        const res = await fetch("https://picsum.photos/500")
        const contentType = res.headers.get("content-type") || "image/jpeg"
        const ext = contentType.split("/")[1] || "jpg"

        const buffer = Buffer.from(await res.arrayBuffer())
        const name = `img_${i}.${ext}`

        fs.writeFileSync(path.join(dir, name), buffer)
        image_names.push({ type: contentType, location: name })
    }

    console.log(`Downloaded ${image_names.length} test images!`)

    return image_names
}

/**
 * Use this if you want to download actual files for testing
 * @param count how much test data you want
 * @param users users list
 * @param places palces list
 * @returns list of photos
 */
export async function PhotoWithDownload(
    count: number,
    users: Prisma.userCreateManyInput[],
    places: Prisma.placeCreateManyInput[]
): Promise<Prisma.photoCreateManyInput[]> {
    const images: DownloadType[] = await download_test_images(count)
    const photoData: Prisma.photoCreateManyInput[] = []

    for (const image of images) {
        const photo = {
            location: `uploads/${image.location}`,
            type: `image/${image.type}`,
            userID: faker.helpers.arrayElement(users).id!!,
            placeID: faker.helpers.arrayElement(places).id!!,
            approved: faker.datatype.boolean(0.5),
            createdAt: faker.date.between({ from: '2026-01-01T00:00:00.000Z', to: '2027-01-01T00:00:00.000Z' })
        }

        photoData.push(photo)
    }

    return photoData
}