# Host: localhost  (Version 5.5.5-10.4.32-MariaDB)
# Date: 2026-01-08 22:28:25
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "certificates"
#

DROP TABLE IF EXISTS `certificates`;
CREATE TABLE `certificates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `certificateId` varchar(255) NOT NULL,
  `studentName` varchar(255) NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `hours` int(11) NOT NULL,
  `issueDate` date NOT NULL,
  `qrCodeUrl` text NOT NULL,
  `status` enum('active','inactive','revoked') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificateId` (`certificateId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'admin',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
