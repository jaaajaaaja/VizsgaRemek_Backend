/*
  Warnings:

  - You are about to drop the column `pending` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `pending` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `pending` on the `photo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `pending`;

-- AlterTable
ALTER TABLE `News` DROP COLUMN `pending`;

-- AlterTable
ALTER TABLE `Photo` DROP COLUMN `pending`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `age` INTEGER NULL;
