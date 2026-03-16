/*
  Warnings:

  - You are about to drop the column `pending` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `pending` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `pending` on the `photo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `comment` DROP COLUMN `pending`;

-- AlterTable
ALTER TABLE `news` DROP COLUMN `pending`;

-- AlterTable
ALTER TABLE `photo` DROP COLUMN `pending`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `age` INTEGER NULL;
