/*
  Warnings:

  - You are about to drop the column `placeId` on the `place_category` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_interest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category,placeID]` on the table `Place_Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID,interest]` on the table `User_Interest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `placeID` to the `Place_Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `User_Interest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `place_category` DROP FOREIGN KEY `Place_Category_placeId_fkey`;

-- DropForeignKey
ALTER TABLE `user_interest` DROP FOREIGN KEY `User_Interest_userId_fkey`;

-- DropIndex
DROP INDEX `Place_Category_placeId_fkey` ON `place_category`;

-- DropIndex
DROP INDEX `User_Interest_userId_fkey` ON `user_interest`;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `approved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pending` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `photo` ADD COLUMN `approved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pending` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `place_category` DROP COLUMN `placeId`,
    ADD COLUMN `placeID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user_interest` DROP COLUMN `userId`,
    ADD COLUMN `userID` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `User_Friend` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `friendID` INTEGER NOT NULL,

    UNIQUE INDEX `User_Friend_userID_friendID_key`(`userID`, `friendID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pending_Friend_Request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `friendID` INTEGER NOT NULL,

    UNIQUE INDEX `Pending_Friend_Request_userID_friendID_key`(`userID`, `friendID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` LONGTEXT NOT NULL,
    `placeID` INTEGER NOT NULL,
    `userID` INTEGER NOT NULL,
    `pending` BOOLEAN NOT NULL DEFAULT true,
    `approved` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Place_Category_category_placeID_key` ON `Place_Category`(`category`, `placeID`);

-- CreateIndex
CREATE UNIQUE INDEX `User_Interest_userID_interest_key` ON `User_Interest`(`userID`, `interest`);

-- AddForeignKey
ALTER TABLE `User_Interest` ADD CONSTRAINT `User_Interest_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Friend` ADD CONSTRAINT `User_Friend_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Friend` ADD CONSTRAINT `User_Friend_friendID_fkey` FOREIGN KEY (`friendID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pending_Friend_Request` ADD CONSTRAINT `Pending_Friend_Request_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pending_Friend_Request` ADD CONSTRAINT `Pending_Friend_Request_friendID_fkey` FOREIGN KEY (`friendID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Place_Category` ADD CONSTRAINT `Place_Category_placeID_fkey` FOREIGN KEY (`placeID`) REFERENCES `Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_placeID_fkey` FOREIGN KEY (`placeID`) REFERENCES `Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
