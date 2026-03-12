import { Photo, PrismaClient, Prisma } from '../generated/prisma/client'
import * as bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import { PhotoWithDownload } from 'src/functions/seed/PhotoWithDownload'

const prisma = new PrismaClient()

const GOOGLE_PLACE_CATEGORIES = [
    'bar',
    'pub',
    'nightclub',
    'dance_club',
    'wine_bar',
    'karaoke',
    'bowling_alley',
]

async function main() {
    console.log("\nSeeding...\n")

    const defaultPassword = await bcrypt.hash('12345678', 10)

    //USERS

    const userCount = 15

    const userData = Array.from({ length: userCount }, () => ({
        userName: faker.internet.username(),
        email: faker.internet.email(),
        password: defaultPassword,
        age: faker.number.int({ min: 18, max: 80 }),
    }))

    await prisma.user.create({
        data: {
            userName: "test",
            email: "test@test.test",
            password: defaultPassword,
            age: 25,
        }
    })

    await prisma.user.create({
        data: {
            userName: "admin",
            email: "admin@admin.admin",
            password: defaultPassword,
            age: 18,
            role: "admin"
        }
    })

    console.log("Admins in database: ", 1)

    await prisma.user.createMany({
        data: userData,
        skipDuplicates: true,
    })

    const users = await prisma.user.findMany()
    console.log("Users in database:", users.length)


    //USER_INTEREST

    const userInterestData: any = []

    for (const user of users) {
        const interests = faker.helpers.arrayElements(
            GOOGLE_PLACE_CATEGORIES,
            { min: 0, max: 3 }
        )

        for (const interest of interests) {
            userInterestData.push({
                interest,
                userID: user.id
            })
        }
    }

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

    const placeCategoryData: any[] = []

    for (const place of places) {
        const categories = faker.helpers.arrayElements(
            GOOGLE_PLACE_CATEGORIES,
            faker.number.int({ min: 1, max: 3 })
        )

        for (const category of categories) {
            placeCategoryData.push({
                category,
                placeID: faker.number.int({ min: 2, max: placeCount })
            })
        }
    }

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
        approved: faker.datatype.boolean(0.5),
        createdAt: faker.date.between({ from: '2026-01-01T00:00:00.000Z', to: '2027-01-01T00:00:00.000Z' })
    }))

    const testUser = await prisma.user.findUnique({ where: { email: "test@test.test" } })

    await prisma.comment.createMany({
        data: [
            {
                commentText: "This is a test comment.",
                rating: 5,
                userID: 1,
                placeID: testPlace.id,
                approved: true
            },
            {
                commentText: "This is another test comment.",
                rating: 5,
                userID: testUser!!.id,
                placeID: testPlace.id,
                approved: true
            },
        ],
    })

    await prisma.comment.createMany({
        data: commentData,
        skipDuplicates: true,
    })

    const comments = await prisma.comment.findMany()
    console.log("Comments in database:", comments.length)

    //PHOTOS

    const photoCount = 10

    await prisma.photo.create({
        data: {
            location: "uploads/test_picture.png",
            type: "image/png",
            userID: testUser ? testUser.id : 1,
            placeID: testPlace.id,
            approved: false
        },
    })

    const photoData = await PhotoWithDownload(photoCount, users, places)

    await prisma.photo.createMany({
        data: photoData,
        skipDuplicates: true,
    })

    const photos = await prisma.photo.findMany()
    console.log("Photos in database:", photos.length)

    //USER_FRIEND

    const userFriendData: any = []

    for (let i = 0; i < users.length - 1; i++) {
        const user = users[i]
        const nextUser = users[i + 1]

        userFriendData.push({
            userID: user.id,
            friendID: nextUser.id
        })
    }

    await prisma.user_Friend.createMany({
        data: userFriendData,
        skipDuplicates: true,
    })

    const userFriends = await prisma.user_Friend.findMany()
    console.log("User Friends in database:", userFriends.length)

    //PENDING_FRIEND_REQUEST

    const pendingFriendRequestData: any = []

    for (let i = 1; i < userCount; i++) {
        const user = users[i]
        const friend = users[i + 2]

        if (user.id !== friend.id) {
            pendingFriendRequestData.push({
                userID: user.id,
                friendID: friend.id
            })
        }
    }

    await prisma.pending_Friend_Request.createMany({ data: pendingFriendRequestData })

    const pendingFriendRequests = await prisma.pending_Friend_Request.findMany()
    console.log("Pending Friend Requests in database:", pendingFriendRequests.length)

    //NEWS

    const newsCount = 500
    const newsData = Array.from({ length: newsCount }, () => ({
        text: faker.lorem.paragraphs({ min: 1, max: 3 }),
        placeID: faker.helpers.arrayElement(places).id,
        userID: faker.helpers.arrayElement(users).id,
        approved: faker.datatype.boolean(0.5),
        createdAt: faker.date.between({ from: '2026-01-01T00:00:00.000Z', to: '2027-01-01T00:00:00.000Z' })
    }))

    const testNews = await prisma.news.create({
        data: {
            text: "Test news text.",
            placeID: testPlace.id,
            userID: testUser ? testUser.id : 1,
            approved: true
        },
    })

    await prisma.news.createMany({
        data: newsData,
        skipDuplicates: true,
    })

    const news = await prisma.news.findMany()
    console.log("News in database:", news.length)

    console.log("\nSeed complete!\n")
}

async function isEmptyDb() {
    const data = await prisma.user.findMany()

    if (data.length === 0) {
        main()
            .catch(err => {
                console.error("Seed failed:", err)
                process.exit(1)
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
    } else {
        console.log(chalk.red("\n" +
            " -------------------------------------------------------------------- \n" +
            "|                                                                    |\n" +
            "|   Seeding can not be executed because the database is not empty!   |\n" +
            "|                                                                    |\n" +
            "|              Run 'npx prisma migrate reset' instead!               |\n" +
            "|                                                                    |\n" +
            " -------------------------------------------------------------------- "
        ))

        await prisma.$disconnect()
    }
}

isEmptyDb()