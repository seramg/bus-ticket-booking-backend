-- CreateTable
CREATE TABLE `passenger details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seatNumber` VARCHAR(191) NOT NULL,
    `passengerName` VARCHAR(191) NOT NULL,
    `passengerAge` VARCHAR(191) NOT NULL,
    `passengerGender` ENUM('male', 'female') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tripId` INTEGER NOT NULL,
    `status` ENUM('confirmed', 'cancelled') NOT NULL,
    `seatNumber` VARCHAR(191) NOT NULL,
    `passengerName` VARCHAR(191) NOT NULL,
    `passengerAge` VARCHAR(191) NOT NULL,
    `passengerGender` ENUM('male', 'female') NOT NULL,
    `fare` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `pnrNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
