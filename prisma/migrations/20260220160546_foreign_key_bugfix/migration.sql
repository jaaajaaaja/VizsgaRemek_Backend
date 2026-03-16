-- DropForeignKey
ALTER TABLE `user_interest` DROP FOREIGN KEY `User_Interest_userID_fkey`;

-- AddForeignKey
ALTER TABLE `user_interest` ADD CONSTRAINT `User_Interest_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
