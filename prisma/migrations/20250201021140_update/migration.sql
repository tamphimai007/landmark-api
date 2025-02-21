/*
  Warnings:

  - You are about to drop the column `firstName` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `profile` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL;
