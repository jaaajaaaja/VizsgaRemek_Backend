import fs from "fs"

export async function DeleteFile(imageName: string): Promise<void> {
    try {
        fs.unlink(`uploads/${imageName}`, (e) => {
            if (e) {
                throw e
            }
            // console.log("Image successfully deleted!")
        })
    } catch (e) {
        if (e.code === "ENOENT") {
            // console.log("Image does not exist!")
        } else {
            throw e
        }
    }
}