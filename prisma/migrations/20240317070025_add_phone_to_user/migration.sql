/*
  Warnings:

  - You are about to drop the column `defaultBillingAddress` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `defaultShippingAddress` on the `users` table. All the data in the column will be lost.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `defaultBillingAddress`,
    DROP COLUMN `defaultShippingAddress`,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;
