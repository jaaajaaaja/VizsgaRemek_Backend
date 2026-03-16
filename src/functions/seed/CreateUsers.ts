import { faker } from "@faker-js/faker"
import { Prisma, PrismaClient, user } from "generated/prisma/client"

const prisma = new PrismaClient()

export async function CreateUsers(
    count: number, password: string
): Promise<{ userData: Prisma.userCreateManyInput[], testUser: user }> {
    const userData: Prisma.userCreateManyInput[] = Array.from({ length: count }, () => ({
        userName: faker.internet.username(),
        email: faker.internet.email(),
        password: password,
        age: faker.number.int({ min: 18, max: 80 }),
    }))

    const testUser: user = await prisma.user.create({
        data: {
            userName: "test",
            email: "test@test.test",
            password: password,
            age: 25,
        }
    })

    await prisma.user.create({
        data: {
            userName: "admin",
            email: "admin@admin.admin",
            password: password,
            age: 18,
            role: "admin"
        }
    })

    return { userData, testUser }
}