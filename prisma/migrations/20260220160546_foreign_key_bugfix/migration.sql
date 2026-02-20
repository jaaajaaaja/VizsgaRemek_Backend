-- DropForeignKey
ALTER TABLE `user_interest` DROP FOREIGN KEY `User_Interest_userID_fkey`;

-- AddForeignKey
ALTER TABLE `User_Interest` ADD CONSTRAINT `User_Interest_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
