/*
  Warnings:

  - You are about to alter the column `rating` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `UnsignedTinyInt`.
  - You are about to alter the column `type` on the `photo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `location` on the `photo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `name` on the `place` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(40)`.
  - You are about to alter the column `address` on the `place` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `category` on the `place_category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `userName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(35)`.
  - You are about to alter the column `age` on the `user` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `UnsignedTinyInt`.
  - You are about to alter the column `interest` on the `user_interest` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.

*/
-- AlterTable
ALTER TABLE `comment` MODIFY `commentText` VARCHAR(500) NOT NULL,
    MODIFY `rating` TINYINT UNSIGNED NULL;

-- AlterTable
ALTER TABLE `news` MODIFY `text` VARCHAR(4000) NOT NULL;

-- AlterTable
ALTER TABLE `photo` MODIFY `type` VARCHAR(30) NOT NULL,
    MODIFY `location` VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE `place` MODIFY `googleplaceID` VARCHAR(200) NOT NULL,
    MODIFY `name` VARCHAR(40) NOT NULL,
    MODIFY `address` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `place_category` MODIFY `category` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `userName` VARCHAR(35) NOT NULL,
    MODIFY `age` TINYINT UNSIGNED NULL;

-- AlterTable
ALTER TABLE `user_interest` MODIFY `interest` VARCHAR(25) NOT NULL;
