-- CreateTable
CREATE TABLE `users_authentication` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `username` VARCHAR(16) NOT NULL,
    `password` VARCHAR(72) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_authentication_email_key`(`email`),
    UNIQUE INDEX `users_authentication_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_profile` (
    `id` VARCHAR(36) NOT NULL,
    `user_authentication_id` VARCHAR(36) NOT NULL,
    `fullName` VARCHAR(100) NOT NULL,
    `bio` VARCHAR(255) NULL,
    `profilePictureUrl` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_profile_user_authentication_id_key`(`user_authentication_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users_profile` ADD CONSTRAINT `users_profile_user_authentication_id_fkey` FOREIGN KEY (`user_authentication_id`) REFERENCES `users_authentication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
