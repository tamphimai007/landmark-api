/*
  Warnings:

  - Added the required column `email` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile` ADD COLUMN `email` VARCHAR(191) NOT NULL;
