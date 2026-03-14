import { Prisma, User } from "generated/prisma/client"

export function CreatePendingFriendRequests(
    usersCount: number,
    users: User[]
): Prisma.Pending_Friend_RequestCreateManyInput[] {
    const pendingFriendRequestData: Prisma.Pending_Friend_RequestCreateManyInput[] = []

    for (let i = 1; i < usersCount; i++) {
        const user = users[i]
        const friend = users[i + 2]

        if (user.id !== friend.id) {
            pendingFriendRequestData.push({
                userID: user.id,
                friendID: friend.id
            })
        }
    }

    return pendingFriendRequestData
}