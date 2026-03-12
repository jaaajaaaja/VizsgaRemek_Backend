import fs from "fs";
import path from "path";
import { DownloadType } from "src/types/download-types";

export async function download_test_images(count: number): Promise<DownloadType[]> {
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