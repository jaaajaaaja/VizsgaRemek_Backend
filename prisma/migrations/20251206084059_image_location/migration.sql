/*
  Warnings:

  - You are about to drop the column `data` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `location` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Photo` DROP COLUMN `data`,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;
