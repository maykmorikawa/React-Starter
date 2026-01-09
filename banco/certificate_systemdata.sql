# Host: localhost  (Version 5.5.5-10.4.32-MariaDB)
# Date: 2026-01-08 22:30:57
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
  UNIQUE KEY `certificateId` (`certificateId`),
  UNIQUE KEY `certificateId_2` (`certificateId`),
  UNIQUE KEY `certificateId_3` (`certificateId`),
  UNIQUE KEY `certificateId_4` (`certificateId`),
  UNIQUE KEY `certificateId_5` (`certificateId`),
  UNIQUE KEY `certificateId_6` (`certificateId`),
  UNIQUE KEY `certificateId_7` (`certificateId`),
  UNIQUE KEY `certificateId_8` (`certificateId`),
  UNIQUE KEY `certificateId_9` (`certificateId`),
  UNIQUE KEY `certificateId_10` (`certificateId`),
  UNIQUE KEY `certificateId_11` (`certificateId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "certificates"
#

INSERT INTO `certificates` VALUES (1,'f74aacc4-ac8a-4b8d-9c85-ee40416750a9','mayk morikawa','dev sem fronteiras',40,'2026-01-07','http://localhost:5173/validar/f74aacc4-ac8a-4b8d-9c85-ee40416750a9','inactive','2026-01-08 23:57:29','2026-01-09 00:45:11'),(2,'fbabe48b-fae1-4f3e-8eaa-329393f4a309','Morikawa de souza','Administração',40,'2025-01-08','http://localhost:5173/validar/fbabe48b-fae1-4f3e-8eaa-329393f4a309','active','2026-01-09 00:16:08','2026-01-09 00:45:14');

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
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `username_4` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "users"
#

INSERT INTO `users` VALUES (1,'admin','$2b$10$ZH/USx4IntrON/XqNDPDyOrACbOHMO9cNIl2xMdODMvovcSvXpRN2','admin','2026-01-08 22:08:56','2026-01-08 22:08:56'),(2,'mayk','$2b$10$ZH/USx4IntrON/XqNDPDyOrACbOHMO9cNIl2xMdODMvovcSvXpRN2','admin','2026-01-08 23:56:18','2026-01-08 23:56:18'),(3,'morikawa','$2b$10$EyPz74i4CB1cdnAeNBj4HOApZ3oCIkOnPnXq1USW0N31HX70maCxi','user','2026-01-09 01:02:48','2026-01-09 01:02:48');
