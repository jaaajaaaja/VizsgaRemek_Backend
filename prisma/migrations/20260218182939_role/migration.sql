-- DropForeignKey
ALTER TABLE `News` DROP FOREIGN KEY `News_placeID_fkey`;

-- DropForeignKey
ALTER TABLE `News` DROP FOREIGN KEY `News_userID_fkey`;

-- DropIndex
DROP INDEX `News_placeID_fkey` ON `News`;

-- DropIndex
DROP INDEX `News_userID_fkey` ON `News`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_placeID_fkey` FOREIGN KEY (`placeID`) REFERENCES `Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
