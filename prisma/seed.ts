import { PrismaClient } from '../generated/prisma/client'
import * as bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const GOOGLE_PLACE_CATEGORIES = [
    'bar',
    'pub',
    'nightclub',
    //'cocktail_bar',
    'dance_club',
    //'beer_bar',
    'wine_bar',
    'karaoke',
    //'lounge',
    //'sports_bar',
    //'dive_bar',
    //'beer_garden',
    //'tavern',
    //'live_music_venue',
    'bowling_alley',
    //'billiard_hall',
    //'brewery',
    //'distillery'
]

async function main() {
    console.log("\nSeeding...\n")

    //USERS

    const userCount = 15
    const defaultPassword = await bcrypt.hash('12345678', 10)

    const userData = Array.from({ length: userCount }, () => ({
        userName: faker.internet.username(),
        email: faker.internet.email(),
        password: defaultPassword,
    }))

    await prisma.user.create({
        data: {
            userName: "test",
            email: "test@test.test",
            password: defaultPassword,
        }
    })

    await prisma.user.createMany({
        data: userData,
        skipDuplicates: true,
    })

    const users = await prisma.user.findMany()
    console.log("Users in database:", users.length)

    //USER_INTEREST

    const userInterestData = users.flatMap(user =>
        faker.helpers.arrayElements(GOOGLE_PLACE_CATEGORIES, { min: 0, max: 3 }).map(interest => ({
            interest,
            userID: user.id == 1 ? faker.number.int({ min: 2, max: 20 }) : user.id
        }))
    )

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

    await prisma.user_Interest.createMany({
        data: userInterestData,
        skipDuplicates: true,
    })

    const userInterests = await prisma.user_Interest.findMany()
    console.log("User Interests in database:", userInterests.length)

    //PLACES

    const placeCount = 20

    const testPlace = await prisma.place.create({
        data: {
            googleplaceID: "test-googleplace-id",
            name: "Test Place",
            address: "123 Test Street, Test City",
        }
    })

    const placeData = Array.from({ length: placeCount }, () => ({
        googleplaceID: `${faker.string.alphanumeric(20)}`,
        name: faker.company.name(),
        address: faker.location.streetAddress({ useFullAddress: true })
    }))

    await prisma.place.createMany({
        data: placeData,
        skipDuplicates: true,
    })

    const places = await prisma.place.findMany()
    console.log("Places in database:", places.length)

    //PLACE_CATEGORY

    const placeCategoryData = places.flatMap(place =>
        faker.helpers
            .arrayElements(
                GOOGLE_PLACE_CATEGORIES,
                faker.number.int({ min: 1, max: 3 })
            )
            .map(category => ({
                category,
                placeID: place.id == 1 ? faker.number.int({ min: 2, max: 20 }) : place.id,
            }))
    )

    await prisma.place_Category.create({
        data: {
            category: "billiard_hall",
            placeID: 1
        }
    })

    await prisma.place_Category.create({
        data: {
            category: "beer_bar",
            placeID: 1
        }
    })

    await prisma.place_Category.createMany({
        data: placeCategoryData,
        skipDuplicates: true,
    })

    const placeCategories = await prisma.place_Category.findMany()
    console.log("Place Categories in database:", placeCategories.length)

    //COMMENTS

    const commentCount = 50
    const commentData = Array.from({ length: commentCount }, () => ({
        commentText: faker.lorem.sentence({ min: 5, max: 15 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        userID: faker.helpers.arrayElement(users).id,
        placeID: faker.helpers.arrayElement(places).id,
    }))

    const testUser = await prisma.user.findUnique({ where: { email: "test@test.test" } })
    await prisma.comment.create({
        data: {
            commentText: "This is a test comment.",
            rating: 5,
            userID: testUser ? testUser.id : 1,
            placeID: testPlace.id,
        },
    })

    await prisma.comment.createMany({
        data: commentData,
        skipDuplicates: true,
    })

    const comments = await prisma.comment.findMany()
    console.log("Comments in database:", comments.length)

    //PHOTOS

    const photoCount = 40
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif']
    const photoData = Array.from({ length: photoCount }, () => ({
        location: `uploads/${faker.string.alphanumeric(10)}.${faker.helpers.arrayElement(imageTypes)}`,
        type: `image/${faker.helpers.arrayElement(imageTypes)}`,
        userID: faker.helpers.arrayElement(users).id,
        placeID: faker.helpers.arrayElement(places).id,
    }))

    await prisma.photo.create({
        data: {
            location: "uploads/test-photo.jpg",
            type: "image/jpg",
            userID: testUser ? testUser.id : 1,
            placeID: testPlace.id,
        },
    })

    await prisma.photo.createMany({
        data: photoData,
        skipDuplicates: true,
    })

    const photos = await prisma.photo.findMany()
    console.log("Photos in database:", photos.length)

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
