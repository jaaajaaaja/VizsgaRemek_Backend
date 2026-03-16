import { Prisma, user } from "generated/prisma/client"

export function CreatePendingFriendRequests(
    usersCount: number,
    users: user[]
): Prisma.pending_friend_requestCreateManyInput[] {
    const pendingFriendRequestData: Prisma.pending_friend_requestCreateManyInput[] = []

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