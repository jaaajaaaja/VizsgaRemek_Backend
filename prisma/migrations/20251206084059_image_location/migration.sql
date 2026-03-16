/*
  Warnings:

  - You are about to drop the column `data` on the `photo` table. All the data in the column will be lost.
  - Added the required column `location` to the `photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `photo` DROP COLUMN `data`,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;
