-- DropForeignKey
ALTER TABLE `news` DROP FOREIGN KEY `News_placeID_fkey`;

-- DropForeignKey
ALTER TABLE `news` DROP FOREIGN KEY `News_userID_fkey`;

-- DropIndex
DROP INDEX `News_placeID_fkey` ON `news`;

-- DropIndex
DROP INDEX `News_userID_fkey` ON `news`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `News_placeID_fkey` FOREIGN KEY (`placeID`) REFERENCES `place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `News_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
