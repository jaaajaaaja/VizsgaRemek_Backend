import { PrismaClient } from '../generated/prisma/client'
import * as bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
    console.log("\nStarting seed...\n")

    const userCount = 15
    const defaultPassword = await bcrypt.hash('password123', 10)

    const userData = Array.from({ length: userCount }, () => ({
        userName: faker.internet.username(),
        email: faker.internet.email(),
        password: defaultPassword,
    }))

    await prisma.user.createMany({
        data: userData,
        skipDuplicates: true,
    })

    const users = await prisma.user.findMany()
    console.log("Users inserted:", users.length)

    const placeCount = 20
    const placeData = Array.from({ length: placeCount }, () => ({
        googleplaceID: `place_${faker.string.alphanumeric(20)}`,
        name: faker.company.name(),
        address: faker.location.streetAddress({ useFullAddress: true }),
    }))

    await prisma.place.createMany({
        data: placeData,
        skipDuplicates: true,
    })

    const places = await prisma.place.findMany()
    console.log("Places inserted:", places.length)

    const commentCount = 50
    const commentData = Array.from({ length: commentCount }, () => ({
        commentText: faker.lorem.sentence({ min: 5, max: 15 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        userID: faker.helpers.arrayElement(users).id,
        placeID: faker.helpers.arrayElement(places).id,
    }))

    await prisma.comment.createMany({
        data: commentData,
        skipDuplicates: true,
    })

    const comments = await prisma.comment.findMany()
    console.log("Comments inserted:", comments.length)

    const photoCount = 40
    const imageTypes = ['jpg', 'jpeg', 'png', 'webp']
    const photoData = Array.from({ length: photoCount }, () => ({
        location: `uploads/${faker.string.alphanumeric(10)}.${faker.helpers.arrayElement(imageTypes)}`,
        type: faker.helpers.arrayElement(imageTypes),
        userID: faker.helpers.arrayElement(users).id,
        placeID: faker.helpers.arrayElement(places).id,
    }))

    await prisma.photo.createMany({
        data: photoData,
        skipDuplicates: true,
    })

    const photos = await prisma.photo.findMany()
    console.log("Photos inserted:", photos.length)

    console.log("\nSeed complete!\n")
}

main()
    .catch(err => {
        console.error("Seed failed:", err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
