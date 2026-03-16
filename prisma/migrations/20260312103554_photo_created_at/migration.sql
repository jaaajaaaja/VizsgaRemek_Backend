/*
  Warnings:

  - A unique constraint covering the columns `[friendID,userID]` on the table `pending_friend_request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[friendID,userID]` on the table `user_friend` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `photo` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Pending_Friend_Request_friendID_userID_key` ON `pending_friend_request`(`friendID`, `userID`);

-- CreateIndex
CREATE UNIQUE INDEX `User_Friend_friendID_userID_key` ON `user_friend`(`friendID`, `userID`);
