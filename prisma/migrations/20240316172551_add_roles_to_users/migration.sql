-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    MODIFY `name` VARCHAR(191) NULL;