-- CreateTable
CREATE TABLE `user_interest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `interest` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `place_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `placeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_interest` ADD CONSTRAINT `User_Interest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `place_category` ADD CONSTRAINT `Place_Category_placeId_fkey` FOREIGN KEY (`placeId`) REFERENCES `place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
