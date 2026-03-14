/*
  Warnings:

  - A unique constraint covering the columns `[friendID,userID]` on the table `Pending_Friend_Request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[friendID,userID]` on the table `User_Friend` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Photo` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Pending_Friend_Request_friendID_userID_key` ON `Pending_Friend_Request`(`friendID`, `userID`);

-- CreateIndex
CREATE UNIQUE INDEX `User_Friend_friendID_userID_key` ON `User_Friend`(`friendID`, `userID`);
