/*
  Warnings:

  - You are about to alter the column `passengerAge` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `passengerAge` on the `passenger details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `passengerAge` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `passenger details` MODIFY `passengerAge` INTEGER NOT NULL;
