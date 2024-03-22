-- CreateTable
CREATE TABLE `bus` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'A1',
    `originId` INTEGER NOT NULL,
    `destinationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originId` INTEGER NOT NULL,
    `destinationId` INTEGER NOT NULL,
    `tripDate` VARCHAR(191) NOT NULL,
    `departure` DATETIME(3) NOT NULL,
    `arrival` DATETIME(3) NOT NULL,
    `durationInHours` INTEGER NOT NULL,
    `busId` VARCHAR(191) NOT NULL,
    `busType` ENUM('AC', 'NON_AC') NOT NULL,
    `seatType` ENUM('SLEEPER', 'SEATER') NOT NULL,
    `totalSeats` INTEGER NOT NULL,
    `farePerSeat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bus` ADD CONSTRAINT `bus_originId_fkey` FOREIGN KEY (`originId`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus` ADD CONSTRAINT `bus_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip` ADD CONSTRAINT `trip_originId_fkey` FOREIGN KEY (`originId`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip` ADD CONSTRAINT `trip_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip` ADD CONSTRAINT `trip_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `bus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
