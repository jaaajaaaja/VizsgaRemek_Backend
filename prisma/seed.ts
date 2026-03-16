import { PrismaClient, Prisma, place, user } from '../generated/prisma/client'
import * as bcrypt from 'bcrypt'
import chalk from 'chalk'
import { PhotoWithDownload } from 'src/functions/seed/PhotoWithDownload'
import { PhotoNoDownload } from 'src/functions/seed/PhotoNoDownload'
import { CreateUsers } from 'src/functions/seed/CreateUsers'
import { CraeteUserInterests } from 'src/functions/seed/CreateUserInterests'
import { CreatePlace } from 'src/functions/seed/CreatePlaces'
import { CreatePlaceCategories } from 'src/functions/seed/CreatePlaceCategories'
import { CreateComments } from 'src/functions/seed/CreateComments'
import { CreatePendingFriendRequests } from 'src/functions/seed/CreatePendingFriendREquests'
import { CreateNews } from 'src/functions/seed/CreateNews'

const prisma = new PrismaClient()

export const GOOGLE_PLACE_CATEGORIES = [
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

    /*
    ----------------------------------------------------------------------------------------------------------
    USERS
    ----------------------------------------------------------------------------------------------------------
    */

    const userCount = 15

    const usersData = await CreateUsers(userCount, defaultPassword)

    const userData: Prisma.userCreateManyInput[] = usersData.userData
    const testUser: user = usersData.testUser

    console.log("Admins in database: ", 1)

    await prisma.user.createMany({
        data: userData,
        skipDuplicates: true,
    })

    const users = await prisma.user.findMany()
    console.log("Users in database:", users.length)


    /*
    ----------------------------------------------------------------------------------------------------------
    user INTERESTS
    ----------------------------------------------------------------------------------------------------------
    */

    const userInterestData: Prisma.user_interestCreateManyInput[] = await CraeteUserInterests(users)

    await prisma.user_interest.createMany({
        data: userInterestData,
        skipDuplicates: true,
    })

    const userInterests = await prisma.user_interest.findMany()
    console.log("user Interests in database:", userInterests.length)

    /*
    ----------------------------------------------------------------------------------------------------------
    PLACES
    ----------------------------------------------------------------------------------------------------------
    */

    const placeCount = 20

    const placesData = (await CreatePlace(placeCount))

    const placeData: Prisma.placeCreateManyInput[] = placesData.placeData
    const testPlace: place = placesData.testPlace

    await prisma.place.createMany({
        data: placeData,
        skipDuplicates: true,
    })

    const places = await prisma.place.findMany()
    console.log("Places in database:", places.length)

    /*
    ----------------------------------------------------------------------------------------------------------
    place CATEGORIES
    ----------------------------------------------------------------------------------------------------------
    */

    const placeCategoryData: Prisma.place_categoryCreateManyInput[] = await CreatePlaceCategories(placeCount, places)

    await prisma.place_category.createMany({
        data: placeCategoryData,
        skipDuplicates: true,
    })

    const placeCategories = await prisma.place_category.findMany()
    console.log("place Categories in database:", placeCategories.length)

    /*
    ----------------------------------------------------------------------------------------------------------
    COMMENTS
    ----------------------------------------------------------------------------------------------------------
    */

    const commentCount = 50

    const commentData: Prisma.commentCreateManyInput[] = await CreateComments(commentCount, users, places)

    await prisma.comment.createMany({
        data: commentData,
        skipDuplicates: true,
    })

    const comments = await prisma.comment.findMany()
    console.log("Comments in database:", comments.length)

    /*
    ----------------------------------------------------------------------------------------------------------
    PHOTOS
    ----------------------------------------------------------------------------------------------------------
    */

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

    const photoData: Prisma.photoCreateManyInput[] = await PhotoWithDownload(photoCount, users, places)
    // const photoData: Prisma.photoCreateManyInput[] = PhotoNoDownload(photoCount, users, places)

    await prisma.photo.createMany({
        data: photoData,
        skipDuplicates: true,
    })

    const photos = await prisma.photo.findMany()
    console.log("Photos in database:", photos.length)

    /*
    ----------------------------------------------------------------------------------------------------------
    FRIENDS
    ----------------------------------------------------------------------------------------------------------
    */

    const userFriendData: Prisma.user_friendCreateManyInput[] = []

    for (let i = 0; i < users.length - 1; i++) {
        const user = users[i]
        const nextUser = users[i + 1]

        userFriendData.push({
            userID: user.id,
            friendID: nextUser.id
        })
    }

    await prisma.user_friend.createMany({
        data: userFriendData,
        skipDuplicates: true,
    })

    const userFriends = await prisma.user_friend.findMany()
    console.log("user Friends in database:", userFriends.length)

    /*
    ----------------------------------------------------------------------------------------------------------
    PENDING FRIEND REQUESTS
    ----------------------------------------------------------------------------------------------------------
    */

    const pendingFriendRequestData: Prisma.pending_friend_requestCreateManyInput[] = CreatePendingFriendRequests(userCount, users)

    await prisma.pending_friend_request.createMany({ 
        data: pendingFriendRequestData
    })

    const pendingFriendRequests = await prisma.pending_friend_request.findMany()
    console.log("Pending Friend Requests in database:", pendingFriendRequests.length)

    /*
    ----------------------------------------------------------------------------------------------------------
    news
    ----------------------------------------------------------------------------------------------------------
    */

    const newsCount = 20
    
    const newsData = await CreateNews(newsCount, places, users)

    await prisma.news.createMany({
        data: newsData,
        skipDuplicates: true,
    })

    const news = await prisma.news.findMany()
    console.log("news in database:", news.length)

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