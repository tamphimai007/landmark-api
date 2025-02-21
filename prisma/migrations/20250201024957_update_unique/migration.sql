/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Profile_clerkId_key` ON `Profile`(`clerkId`);
