/*
  Warnings:

  - You are about to alter the column `mobile` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(15);
